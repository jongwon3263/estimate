from flask import render_template, Blueprint, url_for, flash, request, jsonify
from werkzeug.utils import redirect

from .. import db
from mansys.models import Site, Service, Company, Work, Status
from mansys.forms import SiteForm, WorkAddForm, WorkEditForm

bp = Blueprint('work', __name__, url_prefix='/work')

@bp.route('/add/<string:site_id>', methods=['GET', 'POST'])
def add_work(site_id):
    site = Site.query.get_or_404(site_id)
    form = WorkAddForm()

    # 서비스, 업체 목록 설정
    form.service.choices = [(service.id, service.name) for service in Service.query.all()]
    form.company.choices = [(company.id, company.name) for company in Company.query.all()]
    form.status.choices = [(status.id, status.name) for status in Status.query.all()]

    if form.validate_on_submit():
        start_date = form.start_date.data

        # ✅ end_date가 None이면 start_date를 복사하여 설정
        if not form.end_date.data:
            end_date = start_date
        else:
            end_date = form.end_date.data

        new_work = Work(
            site_id=site.id,
            service_id=form.service.data,
            company_id=form.company.data,
            start_date=start_date,
            end_date=end_date,  # ✅ end_date가 None이면 start_date 사용
            company_cost=form.company_cost.data,
            customer_price=form.customer_price.data,
            work_time=form.work_time.data,
            details=form.details.data,
            memo=form.memo.data,
            status_id=form.status.data
        )

        db.session.add(new_work)
        
        #현장 총액 업데이트
        site.update_customer_price()
        db.session.commit()

        flash('새 시공 정보가 추가되었습니다.', 'success')
        return redirect(url_for('site.detail', site_id=site_id))
    
    # ✅ 폼 검증 실패 시, 서버 로그에 오류 출력
    else:
        print("폼 검증 실패:", form.errors)  # <<<<<< 추가된 디버깅 코드
        flash("입력한 데이터가 올바르지 않습니다.", "danger")

    return render_template('site/site_detail.html', work_add_form=form, site=site, site_form=SiteForm(), all_statuses=Status.query.all())

@bp.route('/edit_work/<string:work_id>', methods=['POST'])
def edit_work(work_id):
    work = Work.query.get_or_404(work_id)
    site = work.site  

    # 모든 서비스 및 업체 목록 불러오기
    all_services = Service.query.all()
    all_companies = Company.query.all()
    all_statuses = Status.query.all()
    # 🔹 시공 수정 폼을 생성하면서 choices 추가
    form = WorkEditForm(request.form, obj=work)
    form.service.choices = [(service.id, service.name) for service in all_services]
    form.company.choices = [(company.id, company.name) for company in all_companies]
    form.status.choices = [(status.id, status.name) for status in all_statuses]

    print("📌 요청된 데이터:", request.form)  # 🔍 요청 데이터 출력

    if form.validate_on_submit():
        print("✅ 폼 검증 성공", form.data)  # 🔍 폼이 유효할 때
        work.service_id = form.service.data
        work.company_id = form.company.data
        work.start_date = form.start_date.data
        work.end_date = form.end_date.data

        # 🔹 `company_cost`를 정수(`int`)로 변환하여 저장
        try:
            work.company_cost = int(form.company_cost.data)  # 🔹 Decimal → int 변환
        except (ValueError, TypeError):
            work.company_cost = 0  # 변환 실패 시 기본값
        
        # customer_price
        try:
            work.customer_price = int(form.customer_price.data)
        except (ValueError, TypeError):
            work.customer_price = 0

        work.work_time = form.work_time.data
        work.details = form.details.data
        work.memo = form.memo.data
        work.additional_cost = form.additional_cost.data
        work.status_id = form.status.data

        work.site.update_customer_price()
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
        return jsonify({
            "success": False,
            "error": "입력값이 올바르지 않습니다.",
            "form_errors": form.errors  # 🔥 추가: 디버깅용 폼 에러도 반환
        }), 400
    flash("입력값이 올바르지 않습니다.", "danger")
    
    return render_template(
        'site/site_detail.html',
        site=site,
        work_edit_forms={work.id: form},
        all_services=all_services,
        all_statuses=all_statuses
    )
    
@bp.route('/delete/<string:work_id>', methods=['POST'])
def delete_work(work_id):
    work = Work.query.get_or_404(work_id)

    try:
        site = work.site  # 시공 삭제 후 현장 총액 업데이트를 위해 참조
        db.session.delete(work)
        site.update_customer_price()  # ✅ 삭제 후에도 총액 반영
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

@bp.route("/done/<string:work_id>", methods=["POST"])
def mark_work_done(work_id):
    work = Work.query.get(work_id)
    if not work:
        return jsonify({"success": False, "error": "해당 시공 정보를 찾을 수 없습니다."}), 404

    done_status = Status.query.filter_by(name="시공완료").first()
    if done_status:
        work.status_id = done_status.id
    db.session.commit()

    return jsonify({"success": True, "status": work.status.name})