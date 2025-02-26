from flask import render_template, Blueprint
from estimate.models import Site, Service, Company

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