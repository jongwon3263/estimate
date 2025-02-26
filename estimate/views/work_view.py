from datetime import datetime

from flask import Blueprint, url_for, request
from werkzeug.utils import redirect

from estimate import db
from estimate.models import Site, Work, Service, Company

bp = Blueprint('work', __name__, url_prefix='/work')


@bp.route('/work/add/<string:site_id>', methods=['POST'])
def add_work(site_id):
    site = Site.query.get_or_404(site_id)

    start_date_str = request.form.get('start_date')
    service_id = request.form.get('service')
    company_id = request.form.get('company')
    status = request.form.get('status')

    start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()

    new_work = Work(
        site_id=site.id,  # 항상 존재
        service_id=service_id,  # 항상 존재
        company_id=company_id,
        start_date=start_date,
        end_date=datetime.strptime(request.form['end_date'], "%Y-%m-%d").date(),
        work_time=request.form.get('work_time', ''),
        details=request.form.get('details', ''),
        memo=request.form.get('memo', ''),
        company_cost=int(request.form.get('company_cost', 0)),
        customer_price=int(request.form.get('customer_price', 0)),
        status=status
    )

    db.session.add(new_work)
    db.session.commit()
    
    return redirect(url_for('site.detail', site_id=site.id))