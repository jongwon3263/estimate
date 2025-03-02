from datetime import datetime

from flask import render_template, Blueprint, url_for, flash
from werkzeug.utils import redirect

from .. import db
from estimate.models import Site, Service, Company, Work
from estimate.forms import SiteForm, SiteEditForm, WorkAddForm, WorkEditForm

bp = Blueprint('work', __name__, url_prefix='/work')

@bp.route('/add/<string:site_id>', methods=['GET', 'POST'])
def add_work(site_id):
    site = Site.query.get_or_404(site_id)
    form = WorkAddForm()

    # 서비스, 업체 목록 설정
    form.service.choices = [(service.id, service.name) for service in Service.query.all()]
    form.company.choices = [(company.id, company.name) for company in Company.query.all()]

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
            status=form.status.data
        )

        db.session.add(new_work)
        db.session.commit()

        flash('새 시공 정보가 추가되었습니다.', 'success')
        return redirect(url_for('site.detail', site_id=site_id))
    
    # ✅ 폼 검증 실패 시, 서버 로그에 오류 출력
    else:
        print("폼 검증 실패:", form.errors)  # <<<<<< 추가된 디버깅 코드
        flash("입력한 데이터가 올바르지 않습니다.", "danger")

    return render_template('site/site_detail.html', form=form, site=site, work_add_form=form, site_form=SiteForm())