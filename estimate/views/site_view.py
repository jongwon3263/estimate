from datetime import datetime

from flask import render_template, Blueprint, request, url_for
from werkzeug.utils import redirect

from .. import db
from estimate.models import Site, Service, Company
from estimate.forms import SiteForm


bp = Blueprint('site', __name__, url_prefix='/')

@bp.route('/site')
def index():
    site_list = Site.query.order_by(Site.id.desc())
    return render_template('site/site_list.html', site_list=site_list)

@bp.route('/site_detail/<string:site_id>/')
def detail(site_id):
    site = Site.query.get_or_404(site_id)
    services = Service.query.all()  # 서비스 목록 추가
    companies = Company.query.all()  # 서비스 목록 추가
    return render_template('site/site_detail.html', site=site, services=services, companies=companies)

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