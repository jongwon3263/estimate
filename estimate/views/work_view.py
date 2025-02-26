from datetime import datetime

from flask import Blueprint, url_for, request
from werkzeug.utils import redirect

from estimate import db
from estimate.models import Site, Work, Service, Company

bp = Blueprint('work', __name__, url_prefix='/work')


@bp.route('/add/<string:site_id>', methods=['POST'])
def add_work(site_id):
    site = Site.query.get_or_404(site_id)
    
    start_date = datetime.strptime(request.form['start_date'], "%Y-%m-%d").date()
    service_id = request.form['service']
    company_id = request.form['company']
    
    new_work = Work(
        site_id=site.id,
        service_id=service_id,
        company_id=company_id,
        start_date=start_date,
        end_date=datetime.strptime(request.form['end_date'], "%Y-%m-%d").date(),
        work_time=request.form['work_time'],
        details=request.form['details'],
        memo=request.form['memo'],
        company_cost=int(request.form['company_cost']),
        customer_price=int(request.form['customer_price'])
    )

    db.session.add(new_work)
    db.session.commit()
    
    return redirect(url_for('site.detail', site_id=site.id))