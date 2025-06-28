from flask import render_template, Blueprint
from mansys.models import Estimate, ServiceOption
from mansys.forms import EstimateForm
from .. import db

from flask import render_template, Blueprint, request, url_for, jsonify, flash
from werkzeug.utils import redirect

bp = Blueprint('estimate', __name__, url_prefix='/estimate')

@bp.route('/')
def index():
    estimate_list = Estimate.query.order_by(Estimate.id.desc())
    return render_template('estimate/estimate_list.html', estimate_list=estimate_list)

@bp.route('/create/', methods=('GET', 'POST'))
def create():
    form = EstimateForm()

    grout_floor_items = ServiceOption.query.filter_by(service_id='GR', category_code=1).order_by(ServiceOption.code).all()
    grout_wall_items = ServiceOption.query.filter_by(service_id='GR', category_code=2).order_by(ServiceOption.code).all()
    grout_silicone_items = ServiceOption.query.filter_by(service_id='GR', category_code=3).order_by(ServiceOption.code).all()

    if request.method == 'POST' and form.validate_on_submit():
        estimate = Estimate(
            customer_name=form.customer_name.data,
            address=form.address.data,
            customer_phone=form.customer_phone.data,
        )
        db.session.add(estimate)
        db.session.commit()
        return redirect(url_for('estimate.index'))

    return render_template(
        'estimate/estimate_form.html',
        form=form,
        grout_floor_items=grout_floor_items,
        grout_wall_items=grout_wall_items,
        grout_silicone_items=grout_silicone_items
    )