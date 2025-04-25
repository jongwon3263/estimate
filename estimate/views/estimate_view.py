from flask import render_template, Blueprint
from estimate.models import Estimate

bp = Blueprint('estimate', __name__, url_prefix='/estimate')

@bp.route('/')
def index():
    estimate_list = Estimate.query.order_by(Estimate.id.desc())
    return render_template('estimate/esitmate_list.html', estimate_list=estimate_list)