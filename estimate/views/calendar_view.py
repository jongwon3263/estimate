from flask import render_template, Blueprint

bp = Blueprint('calendar', __name__, url_prefix='/calendar')

@bp.route('/')
def index():
    return render_template('calendar/calendar.html')