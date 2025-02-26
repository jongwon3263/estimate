from flask import Flask, render_template, Blueprint

from estimate.models import Company

bp = Blueprint('company', __name__, url_prefix='/')

@bp.route('/company')
def index():
    company_list = Company.query.order_by(Company.name.desc())
    return render_template('company/company_list.html', company_list=company_list)

@bp.route('/company_detail/<int:company_id>/')
def detail(company_id):
    company = Company.query.get_or_404(company_id)
    return render_template('company/company_detail.html', company=company)