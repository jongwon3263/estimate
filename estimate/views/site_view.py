from datetime import datetime

from flask import render_template, Blueprint, request, url_for, jsonify, flash
from werkzeug.utils import redirect

from .. import db
from estimate.models import Site, Service, Company, Work
from estimate.forms import SiteForm, SiteEditForm, WorkAddForm, WorkEditForm


bp = Blueprint('site', __name__, url_prefix='/')

@bp.route('/')
def index():
    site_list = Site.query.order_by(Site.id.desc())
    return render_template('site/site_list.html', site_list=site_list)

@bp.route('/site_detail/<string:site_id>/', methods=['GET'])
def detail(site_id):
    site = Site.query.get_or_404(site_id)

    # 현장 수정 폼
    site_form = SiteEditForm(obj=site)

    # 모든 서비스 목록 불러오기
    all_services = Service.query.all()

    # 시공 추가 폼
    work_add_form = WorkAddForm()
    work_add_form.service.choices = [(service.id, service.name) for service in all_services]

    # 시공 수정 폼 (각 work 객체별로 개별 폼 생성)
    work_edit_forms = {}  # 폼 객체만 저장
    selected_company_names = {}  # 기존 선택된 업체 이름 저장

    for work in site.work_set:
        form = WorkEditForm(obj=work)

        # 🔹 해당 시공(service_id)에 맞는 업체만 필터링
        available_companies = Company.query.filter_by(service_id=work.service_id).all()

        # 🔹 기존 선택된 업체 유지
        form.service.choices = [(service.id, service.name) for service in Service.query.all()]
        form.company.choices = [(int(company.id), company.name) for company in available_companies]  # ✅ 미리 int 변환

        work.company_id = int(work.company_id) if work.company_id else None  # ✅ 미리 int 변환

        work_edit_forms[work.id] = form  # ✅ 수정된 폼 저장

    return render_template(
        'site/site_detail.html',
        site=site,
        site_form=site_form,
        work_add_form=work_add_form,
        work_edit_forms=work_edit_forms,
        selected_company_names=selected_company_names,
        all_services=all_services
    )

@bp.route('/create/', methods=('GET', 'POST'))
def create():
    form = SiteForm()
    if request.method == 'POST' and form.validate_on_submit():
        site = Site(
            address=form.address.data,
            residence_type=form.residence_type.data,
            room_size=form.room_size.data,
            depositor=form.depositor.data,
            notes=form.notes.data,
            customer_phone=form.customer_phone.data,
            contract_date=datetime.now()
            )
        db.session.add(site)
        db.session.commit()
        return redirect(url_for('site.index'))
    return render_template('site/site_form.html', form=form)

@bp.route('/work_add/<string:site_id>', methods=['GET', 'POST'])
def add_work(site_id):
    site = Site.query.get_or_404(site_id)
    form = WorkAddForm()

    # 서비스 목록 가져오기
    form.service.choices = [(service.id, service.name) for service in Service.query.all()]
    # 업체 목록 가져오기
    form.company.choices = [(company.id, company.name) for company in Company.query.all()]

    if form.validate_on_submit():
        new_work = Work(
            site_id=site.id,
            service_id=form.service.data,
            company_id=form.company.data,
            start_date=form.start_date.data,
            end_date=form.end_date.data,
            company_cost=form.company_cost.data,
            customer_price=form.customer_price.data,
            work_time=form.work_time.data,
            details=form.details.data,
            memo=form.memo.data,
            status=form.status.data
        )
        db.session.add(new_work)
        db.session.commit()

        flash('새 시공 정보가 추가되었습니다.', 'success')
        return redirect(url_for('site.detail', site_id=site_id))

    return render_template('site/work_add.html', form=form, site=site)

@bp.route('/get_companies/<string:service_id>', methods=['GET'])
def get_companies(service_id):
    # service_id가 알파벳 문자열이므로 그대로 필터링
    companies = Company.query.filter_by(service_id=service_id).all()

    company_list = [{"id": company.id, "name": company.name} for company in companies]
    
    return jsonify(company_list)

@bp.route('/modify/<string:site_id>', methods=['POST'])
def modify_site(site_id):
    site = Site.query.get_or_404(site_id)

    site.residence_type = request.form.get('residence_type')
    site.room_size = request.form.get('room_size')
    site.depositor = request.form.get('depositor')
    site.customer_phone = request.form.get('customer_phone')
    site.modify_date = datetime.now()

    db.session.commit()

    return jsonify({
        "success": True,
        "residence_type": site.residence_type,
        "room_size": site.room_size,
        "depositor": site.depositor,
        "customer_phone": site.customer_phone
    })
    
@bp.route('/edit_work/<string:work_id>', methods=['GET', 'POST'])
def edit_work(work_id):
    work = Work.query.get_or_404(work_id)
    form = WorkEditForm(obj=work)

    # 모든 서비스 목록 불러오기
    all_services = Service.query.all()

    if request.method == 'POST':  # ✅ 저장 버튼 클릭 시 실행
        if form.validate_on_submit():
            work.company_id = request.form.get('company', type=int)  # ✅ 데이터 반영
            work.start_date = request.form.get('start_date')
            work.end_date = request.form.get('end_date')
            work.company_cost = request.form.get('company_cost', type=int)
            work.customer_price = request.form.get('customer_price', type=int)
            work.work_time = request.form.get('work_time')
            work.details = request.form.get('details')
            work.memo = request.form.get('memo')
            work.status = request.form.get('status')

            db.session.commit()
            flash("시공 정보가 수정되었습니다!", "success")
            return redirect(url_for('site.detail', site_id=work.site_id))

        flash("입력값이 올바르지 않습니다.", "danger")

    return render_template('site/site_detail.html', site=work.site, form=form, all_services=all_services)