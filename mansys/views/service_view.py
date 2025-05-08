from flask import render_template, Blueprint
from mansys.models import Service

bp = Blueprint('service', __name__, url_prefix='/service')

@bp.route('/')
def index():
    service_list = Service.query.order_by(Service.id.desc())
    return render_template('service/service_list.html', service_list=service_list)