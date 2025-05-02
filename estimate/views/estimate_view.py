from flask import render_template, Blueprint
from estimate.models import Estimate
from estimate.forms import EstimateForm
from .. import db

from flask import render_template, Blueprint, request, url_for, jsonify, flash
from werkzeug.utils import redirect

bp = Blueprint('estimate', __name__, url_prefix='/estimate')

@bp.route('/')
def index():
    estimate_list = Estimate.query.order_by(Estimate.id.desc())
    return render_template('estimate/esitmate_list.html', estimate_list=estimate_list)

@bp.route('/create/', methods=('GET', 'POST'))
def create():
    form = EstimateForm()
    
    if request.method == 'POST' and form.validate_on_submit():
        estimate = Estimate(
            customer_name=form.customer_name.data,
            address=form.address.data,
            customer_phone=form.customer_phone.data,
            )
        db.session.add(estimate)
        db.session.commit()
        return redirect(url_for('estimate.index'))
    return render_template('estimate/esitmate_form.html', form=form)