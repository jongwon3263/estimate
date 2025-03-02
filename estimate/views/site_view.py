from datetime import date, datetime, timedelta

from flask import render_template, Blueprint, request, url_for, jsonify, flash
from werkzeug.utils import redirect

from .. import db
from estimate.models import Site, Service, Company, Work
from estimate.forms import SiteForm, SiteEditForm, WorkAddForm, WorkEditForm


bp = Blueprint('site', __name__, url_prefix='/')

@bp.route('/')
def index():
    filter_option = request.args.get("filter", "전체 내용")
    keyword = request.args.get("keyword", "").strip()
    today_works = request.args.get("today-works")
    tomorrow_works = request.args.get("tomorrow-works")

    query = Site.query.filter(Site.archive == 0)

    # 오늘, 내일 날짜 설정
    today = date.today()
    tomorrow = today + timedelta(days=1)

    # 선택된 체크박스에 따라 필터링할 site_id 목록 가져오기
    site_ids = set()
    if today_works:
        today_sites = db.session.query(Work.site_id).filter(
            Work.start_date <= today, Work.end_date >= today
        ).distinct()
        site_ids.update([site_id for site_id, in today_sites])

    if tomorrow_works:
        tomorrow_sites = db.session.query(Work.site_id).filter(
            Work.start_date <= tomorrow, Work.end_date >= tomorrow
        ).distinct()
        site_ids.update([site_id for site_id, in tomorrow_sites])

    # site_id 필터 적용 (선택된 경우)
    if site_ids:
        query = query.filter(Site.id.in_(site_ids))

    # 검색어 필터 적용
    if keyword:
        if filter_option == "주소":
            query = query.filter(Site.address.contains(keyword))
        elif filter_option == "고객 연락처":
            query = query.filter(Site.customer_phone.contains(keyword))
        elif filter_option == "입금자명":
            query = query.filter(Site.depositor.contains(keyword))
        else:
            query = query.filter(
                (Site.address.contains(keyword)) |
                (Site.customer_phone.contains(keyword)) |
                (Site.depositor.contains(keyword))
            )

    # 최종 필터링된 목록 가져오기
    site_list = query.order_by(Site.id.desc()).all()

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
        form.set_choices(all_services, available_companies)

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
    
    # 🔹 거래 유형 선택지 추가
    form.transaction_type.choices = [
        ('일반', '일반'),
        ('세금계산서 발행', '세금계산서 발행'),
        ('현금영수증 발행', '현금영수증 발행'),
        ('카드결제', '카드결제')
    ]
    
    # 🔹 service와 company의 choices 추가 (필수)
    # all_services = Service.query.all()
    # all_companies = Company.query.all()
    # form.service.choices = [(service.id, service.name) for service in all_services]
    # form.company.choices = [(company.id, company.name) for company in all_companies]
    
    if request.method == 'POST' and form.validate_on_submit():
        site = Site(
            district=form.district.data,
            address=form.address.data,
            residence_type=form.residence_type.data,
            room_size=form.room_size.data,
            depositor=form.depositor.data,
            notes=form.notes.data,
            customer_phone=form.customer_phone.data,
            transaction_type=form.transaction_type.data,  # ✅ 추가
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
    site.transaction_type = request.form.get('transaction_type')
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
        "transaction_type": site.transaction_type
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
    
@bp.route('/work/delete/<string:work_id>', methods=['POST'])
def delete_work(work_id):
    work = Work.query.get_or_404(work_id)

    try:
        db.session.delete(work)  # ✅ 시공 삭제
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


# @bp.route('/work_add/<string:site_id>', methods=['GET', 'POST'])
# def add_work(site_id):
#     site = Site.query.get_or_404(site_id)
#     form = WorkAddForm()

#     # 서비스 목록 가져오기
#     form.service.choices = [(service.id, service.name) for service in Service.query.all()]
#     # 업체 목록 가져오기
#     form.company.choices = [(company.id, company.name) for company in Company.query.all()]

#     if form.validate_on_submit():
#         # start_date 값 가져오기
#         start_date = form.start_date.data

#         # end_date가 비어있으면 start_date와 동일하게 설정
#         end_date = form.end_date.data if form.end_date.data else start_date  

#         new_work = Work(
#             site_id=site.id,
#             service_id=form.service.data,
#             company_id=form.company.data,
#             start_date=start_date,
#             end_date=end_date,  # 수정된 부분
#             company_cost=form.company_cost.data,
#             customer_price=form.customer_price.data,
#             work_time=form.work_time.data,
#             details=form.details.data,
#             memo=form.memo.data,
#             status=form.status.data
#         )

#         db.session.add(new_work)
#         db.session.commit()

#         flash('새 시공 정보가 추가되었습니다.', 'success')
#         return redirect(url_for('site.detail', site_id=site_id))

#     return render_template('site/site_detail.html', form=form, site=site)

@bp.route('/get_companies/<string:service_id>', methods=['GET'])
def get_companies(service_id):
    # service_id가 알파벳 문자열이므로 그대로 필터링
    companies = Company.query.filter_by(service_id=service_id).all()

    company_list = [{"id": company.id, "name": company.name} for company in companies]
    
    return jsonify(company_list)



@bp.route('/edit_work/<string:work_id>', methods=['POST'])
def edit_work(work_id):
    work = Work.query.get_or_404(work_id)
    site = work.site  

    # 모든 서비스 및 업체 목록 불러오기
    all_services = Service.query.all()
    all_companies = Company.query.all()

    # 🔹 시공 수정 폼을 생성하면서 choices 추가
    form = WorkEditForm(obj=work)
    form.service.choices = [(service.id, service.name) for service in all_services]
    form.company.choices = [(company.id, company.name) for company in all_companies]

    print("📌 요청된 데이터:", request.form)  # 🔍 요청 데이터 출력

    if form.validate_on_submit():
        print("✅ 폼 검증 성공")  # 🔍 폼이 유효할 때
        work.service_id = form.service.data
        work.company_id = form.company.data
        work.start_date = form.start_date.data
        work.end_date = form.end_date.data

        # 🔹 `company_cost`를 정수(`int`)로 변환하여 저장
        try:
            work.company_cost = int(form.company_cost.data)  # 🔹 Decimal → int 변환
        except (ValueError, TypeError):
            work.company_cost = 0  # 변환 실패 시 기본값

        work.work_time = form.work_time.data
        work.details = form.details.data
        work.memo = form.memo.data
        work.status = form.status.data

        db.session.commit()

        # 🔹 AJAX 요청이면 JSON 응답 반환
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({
                "success": True,
                "service": work.service.name,
                "company": work.company.name if work.company else "미정",
                "start_date": work.start_date.strftime("%Y-%m-%d"),
                "end_date": work.end_date.strftime("%Y-%m-%d"),
                "work_time": work.work_time,
                "details": work.details,
                "memo": work.memo,
                "company_cost": work.company_cost  # ✅ 이제 정수로 저장됨
            })

        # 🔹 일반 폼 제출일 경우 기존 방식 유지
        flash("시공 정보가 수정되었습니다!", "success")
        return redirect(url_for('site.detail', site_id=work.site_id))

    print("❌ 폼 검증 실패:", form.errors)  # 🔍 검증 실패 이유 출력

    # 🔹 AJAX 요청이면 JSON으로 에러 반환
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({"success": False, "error": "입력값이 올바르지 않습니다."}), 400

    flash("입력값이 올바르지 않습니다.", "danger")
    return render_template(
        'site/site_detail.html',
        site=site,
        work_edit_forms={work.id: form},
        all_services=all_services
    )
