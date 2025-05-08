from flask import Flask, render_template, Blueprint
import time

bp = Blueprint('input', __name__, url_prefix='/')

@bp.route('/input')
def home():
    return render_template('1_input.html', time=time)
