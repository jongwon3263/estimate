from flask import Flask, render_template, Blueprint

from estimate.models import Company

bp = Blueprint('company', __name__, url_prefix='/')

@bp.route('/company')
def index():
    company_list = Company.query.order_by(Company.name.desc())
    cleaning_companies = Company.query.filter_by(service_id="CL").all()
    grout_companies = Company.query.filter_by(service_id="GR").all()
    paint_companies = Company.query.filter_by(service_id="PT").all()
    coating_companies = Company.query.filter_by(service_id="CT").all()
    newhouse_companies = Company.query.filter_by(service_id="NH").all()
    appliance_companies = Company.query.filter_by(service_id="AP").all()
    etc_companies = Company.query.filter_by(service_id="ET").all()
    return render_template(
        'company/company_list.html',
        company_list=company_list,
        cleaning_companies=cleaning_companies,
        grout_companies=grout_companies,
        paint_companies=paint_companies,
        coating_companies=coating_companies,
        newhouse_companies=newhouse_companies,
        appliance_companies=appliance_companies,
        etc_companies=etc_companies
        )

@bp.route('/company_detail/<int:company_id>/')
def detail(company_id):
    company = Company.query.get_or_404(company_id)
    return render_template('company/company_detail.html', company=company)
