from datetime import date, datetime, timedelta
from sqlalchemy import or_
from sqlalchemy.orm import aliased

from flask import render_template, Blueprint, request, url_for, jsonify, flash
from werkzeug.utils import redirect

from .. import db
from estimate.models import Site, Service, Company, Work, Status, Tax
from estimate.forms import SiteForm, SiteEditForm, WorkAddForm, WorkEditForm


bp = Blueprint('site', __name__, url_prefix='/sites')

@bp.route('/')
def index():
    keyword = request.args.get('search_kw', '').strip()
    service_ids = request.args.getlist('services')
    company_id = request.args.get('company')
    status_ids = request.args.getlist('statuses')
    contract_date = request.args.get('contract_date')
    tax_ids = request.args.getlist('taxes')
    sort_by = request.args.get('sort_by', 'contract-date')
    sort_order = request.args.get('sort_order', 'desc')

    # 관계 모델 alias
    company_alias = aliased(Company)
    work_alias = aliased(Work)

    site_query = Site.query.filter(Site.archive == 0)

    # 🧠 work 테이블을 반드시 join해야 하는 조건
    need_work_join = (
        keyword or
        service_ids or
        company_id or
        status_ids or
        sort_by == 'start-date'
    )

    # 필요하면 work 테이블 조인
    if need_work_join:
        site_query = site_query.join(work_alias, work_alias.site_id == Site.id)

    # 🔍 키워드 필터 (추가적으로 company 조인)
    if keyword:
        site_query = site_query.join(company_alias, company_alias.id == work_alias.company_id).filter(or_(
            Site.address.ilike(f"%{keyword}%"),
            Site.depositor.ilike(f"%{keyword}%"),
            company_alias.name.ilike(f"%{keyword}%"),
            work_alias.details.ilike(f"%{keyword}%"),
            work_alias.memo.ilike(f"%{keyword}%")
        ))

    # 🔎 서비스 필터
    if service_ids:
        site_query = site_query.filter(work_alias.service_id.in_(service_ids))

    # 🔎 업체 필터
    if company_id:
        site_query = site_query.filter(work_alias.company_id == company_id)

    # 🔎 상태 필터
    if status_ids:
        site_query = site_query.filter(work_alias.status_id.in_(status_ids))

    # 🔎 계약일 필터
    if contract_date:
        site_query = site_query.filter(Site.contract_date == contract_date)

    # 🔎 세금 처리 필터
    if tax_ids:
        site_query = site_query.filter(Site.tax_id.in_(tax_ids))

    # 🔁 정렬 설정
    sort_column_map = {
        'district': Site.district,
        'address': Site.address,
        'contract-date': Site.contract_date,
        'depositor': Site.depositor,
        'start-date': work_alias.start_date  # work_alias 기준으로 변경
    }

    sort_column = sort_column_map.get(sort_by, Site.contract_date)
    if sort_order == 'desc':
        sort_column = sort_column.desc()
    else:
        sort_column = sort_column.asc()

    site_query = site_query.order_by(sort_column)

    # 🔚 실행
    site_list = site_query.distinct().all()

    return render_template('site/site_list.html',
        site_list=site_list,
        services=Service.query.all(),
        companies=Company.query.all(),
        statuses=Status.query.all(),
        taxes=Tax.query.all()
    )

@bp.route('/site_detail/<string:site_id>/', methods=['GET'])
def detail(site_id):
    site = Site.query.get_or_404(site_id)

    # 현장 수정 폼
    site_form = SiteEditForm(obj=site)

    # 모든 서비스 목록 불러오기
    all_services = Service.query.all()
    all_statuses = Status.query.all()

    # 시공 추가 폼
    work_add_form = WorkAddForm()
    work_add_form.service.choices = [(service.id, service.name) for service in all_services]

    # 시공 수정 폼 (각 work 객체별로 개별 폼 생성)
    work_edit_forms = {}  # 폼 객체만 저장
    selected_company_names = {}  # 기존 선택된 업체 이름 저장
    
    # 세금처리 드롭다운 세팅
    tax_list = Tax.query.all()
    site_form.tax_treatment.choices = [(tax.id, tax.name) for tax in tax_list]
    site_form.tax_treatment.data = site.tax_id  # 선택된 항목 표시용

    work_json =[]
    
    for work in site.works:
        form = WorkEditForm(obj=work)

        # 🔹 해당 시공(service_id)에 맞는 업체만 필터링
        available_companies = Company.query.filter_by(service_id=work.service_id).all()
        form.set_choices(all_services, available_companies, all_statuses)

        # 🔹 기존 선택된 업체 유지
        form.service.choices = [(service.id, service.name) for service in Service.query.all()]
        form.company.choices = [(int(company.id), company.name) for company in available_companies]  # ✅ 미리 int 변환
        form.status.choices = [(status.id, status.name) for status in Status.query.all()]
        
        work.company_id = int(work.company_id) if work.company_id else None  # ✅ 미리 int 변환

        work_edit_forms[work.id] = form  # ✅ 수정된 폼 저장
        
        work_json.append({
        'id': work.id,
        'start_date': work.start_date.strftime('%-m/%-d') if work.start_date else "",
        'company_cost': work.company_cost or 0,
        'address': site.address,
        'customer_phone': site.customer_phone,
        'depositor': site.depositor
        })

    return render_template(
        'site/site_detail.html',
        site=site,
        site_form=site_form,
        work_add_form=work_add_form,
        work_edit_forms=work_edit_forms,
        selected_company_names=selected_company_names,
        all_services=all_services,
        work_json=work_json,
        remaining_balance=site.remaining_balance,
        address = site.address,
        customer_phone = site.customer_phone,
        depositor = site.depositor,
        all_statuses=Status.query.all()
    )

@bp.route('/create/', methods=('GET', 'POST'))
def create():
    form = SiteForm()
    
    taxes = Tax.query.all()
    form.tax_id.choices = [(tax.id, tax.name) for tax in taxes]
    
    if request.method == 'POST' and form.validate_on_submit():
        site = Site(
            district=form.district.data,
            address=form.address.data,
            residence_type=form.residence_type.data,
            room_size=form.room_size.data,
            depositor=form.depositor.data,
            notes=form.notes.data,
            customer_phone=form.customer_phone.data,
            tax_id=form.tax_id.data,  # ✅ 추가
            contract_date=datetime.now()
            )
        db.session.add(site)
        db.session.commit()
        return redirect(url_for('site.index'))
    return render_template('site/site_form.html', form=form)

@bp.route('/modify/<string:site_id>', methods=['POST'])
def modify_site(site_id):
    site = Site.query.get_or_404(site_id)

    site.district = request.form.get('district')
    site.address = request.form.get('address')
    site.residence_type = request.form.get('residence_type')
    site.room_size = request.form.get('room_size')
    site.depositor = request.form.get('depositor')
    site.customer_phone = request.form.get('customer_phone')
    site.notes = request.form.get('notes')

    # 🔹 숫자로 변환하여 저장 (콤마 제거 후 정수 변환)
    customer_price = request.form.get('customer_price', "0").replace(",", "")
    contract_deposit = request.form.get('contract_deposit', "0").replace(",", "")

    try:
        site.customer_price = int(customer_price)  # 🔹 정수 변환
    except ValueError:
        site.customer_price = 0

    try:
        site.contract_deposit = int(contract_deposit)  # 🔹 정수 변환
    except ValueError:
        site.contract_deposit = 0

    site.update_remaining_balance()
    print("🔍 세금 처리 ID:", request.form.get('tax_treatment'))
    site.tax_id = request.form.get('tax_treatment')
    site.modify_date = datetime.now()

    db.session.commit()

    return jsonify({
        "success": True,
        "district": site.district,
        "address": site.address,
        "residence_type": site.residence_type,
        "room_size": site.room_size,
        "depositor": site.depositor,
        "customer_phone": site.customer_phone,
        "customer_price": site.customer_price,  # ✅ 정수 값 반환
        "contract_deposit": site.contract_deposit,  # ✅ 정수 값 반환
        "remaining_balance": site.remaining_balance,  # ✅ 자동 계산된 값 반환
        "tax_treatment": site.tax.name if site.tax else "",
        "notes": site.notes,
    })

    
@bp.route('/site/archive/<string:site_id>', methods=['POST'])
def archive_site(site_id):
    site = Site.query.get_or_404(site_id)

    try:
        site.archive = True  # ✅ Boolean 값으로 설정
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
    

@bp.route('/get_companies/<string:service_id>', methods=['GET'])
def get_companies(service_id):
    # service_id가 알파벳 문자열이므로 그대로 필터링
    companies = Company.query.filter_by(service_id=service_id).all()

    company_list = [{"id": company.id, "name": company.name} for company in companies]
    
    return jsonify(company_list)

