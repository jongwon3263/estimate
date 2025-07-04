from flask import Blueprint, request, jsonify, render_template
from mansys.models import ServiceOption, Discount

bp = Blueprint('service_api', __name__, url_prefix='/api')

@bp.route('/get_price')
def get_price():
    service_id = request.args.get('service_id')
    option_code = request.args.get('option_code')
    category_code = request.args.get('category_code')

    if not service_id:
        return jsonify(success=False, error="service_id 누락"), 400

    query = ServiceOption.query.filter_by(service_id=service_id)

    if option_code:
        query = query.filter_by(code=option_code)
    if category_code:
        query = query.filter_by(category_code=category_code)

    option = query.first()

    if not option:
        return jsonify(success=False, error="옵션을 찾을 수 없습니다."), 404

    return jsonify(success=True, price=option.price, category_code=option.category_code, discounted_price=option.discounted_price, service_option_id=option.id)
