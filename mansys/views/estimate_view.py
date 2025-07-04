from flask import render_template, Blueprint, request, url_for, jsonify, flash
from datetime import datetime, timezone
from mansys.models import Estimate, ServiceOption, EstimateItem
from mansys.forms import EstimateForm
from .. import db

from werkzeug.utils import redirect

bp = Blueprint('estimate', __name__, url_prefix='/estimate')

@bp.route('/')
def index():
    estimate_list = Estimate.query.order_by(Estimate.id.desc())
    return render_template('estimate/estimate_list.html', estimate_list=estimate_list)

@bp.route('/create/', methods=('GET', 'POST'))
def create():
    form = EstimateForm()
    
    # 청소 서비스 옵션 조회
    # 소형
    cleaning_small_items = ServiceOption.query.filter_by(service_id='CL', category_code=2).order_by(ServiceOption.code).all()

    # 줄눈 서비스 옵션 조회
    grout_package_items = ServiceOption.query.filter_by(service_id='GR', category_code=9).order_by(ServiceOption.code).all()
    grout_floor_items = ServiceOption.query.filter_by(service_id='GR', category_code=1).order_by(ServiceOption.code).all()
    grout_wall_items = ServiceOption.query.filter_by(service_id='GR', category_code=2).order_by(ServiceOption.code).all()
    grout_silicone_items = ServiceOption.query.filter_by(service_id='GR', category_code=3).order_by(ServiceOption.code).all()
    
    # 케라폭시 서비스 옵션 조회
    kera_package_items = ServiceOption.query.filter_by(service_id='KP', category_code=9).order_by(ServiceOption.code).all()
    kera_floor_items = ServiceOption.query.filter_by(service_id='KP', category_code=1).order_by(ServiceOption.code).all()
    kera_wall_items = ServiceOption.query.filter_by(service_id='KP', category_code=2).order_by(ServiceOption.code).all()
    
    # 생활코팅 서비스 옵션 조회
    coating_package_items = ServiceOption.query.filter_by(service_id='CT', category_code=9).order_by(ServiceOption.code).all()
    coating_countertop_items = ServiceOption.query.filter_by(service_id='CT', category_code=1).order_by(ServiceOption.code).all()
    coating_nano_items = ServiceOption.query.filter_by(service_id='CT', category_code=2).order_by(ServiceOption.code).all()
    coating_floortile_items = ServiceOption.query.filter_by(service_id='CT', category_code=3).order_by(ServiceOption.code).all()
    coating_walltile_items = ServiceOption.query.filter_by(service_id='CT', category_code=4).order_by(ServiceOption.code).all()
    
    # 탄성코트 서비스 옵션 조회
    paint_items = ServiceOption.query.filter_by(service_id='PT', category_code=1).order_by(ServiceOption.code).all()
    
    # 마루코팅 서비스 옵션 조회
    floor_coating_items = ServiceOption.query.filter_by(service_id='FC', category_code=1).order_by(ServiceOption.code).all()
    
    #가전분해청소 서비스 옵션 조회
    ap_ac_items = ServiceOption.query.filter_by(service_id='AP', category_code=1).order_by(ServiceOption.code).all()
    ap_wm_items = ServiceOption.query.filter_by(service_id='AP', category_code=2).order_by(ServiceOption.code).all()
    
    

    if request.method == 'POST' and form.validate_on_submit():
        estimate = Estimate(
            customer_name=form.customer_name.data,
            address=form.address.data,
            customer_phone=form.customer_phone.data,
        )
        db.session.add(estimate)
        db.session.commit()
        return redirect(url_for('estimate.estimate_list'))

    return render_template(
        'estimate/estimate_form.html',
        form=form,
        # 청소 데이터 렌더링
        cleaning_small_items=cleaning_small_items,
        
        # 줄눈 데이터 렌더링
        grout_floor_items=grout_floor_items,
        grout_wall_items=grout_wall_items,
        grout_silicone_items=grout_silicone_items,
        grout_package_items=grout_package_items,
        
        # 케라폭시 데이터 렌더링
        kera_floor_items=kera_floor_items,
        kera_wall_items=kera_wall_items,
        kera_package_items=kera_package_items,
        
        # 생활코팅 데이터 렌더링
        coating_countertop_items=coating_countertop_items,
        coating_nano_items=coating_nano_items,
        coating_floortile_items=coating_floortile_items,
        coating_walltile_items=coating_walltile_items,
        coating_package_items=coating_package_items,
        
        # 탄성코트 데이터 렌더링
        paint_items=paint_items,

        # 마루코팅 데이터 렌더링
        floor_coating_items=floor_coating_items,
        
        # 가전분해청소 데이터 렌더링
        ap_ac_items=ap_ac_items,
        ap_wm_items=ap_wm_items
    )
    
@bp.route('/save', methods=['POST'])
def save_estimate():
    data = request.get_json()
    
    try:
        #1. Estimate 저장
        estimate = Estimate(
            customer_name=data.get('customerName'),
            customer_phone=data.get('customerPhone'),
            address=data.get('address'),
            room_type=data.get('roomType'),
            pyeong=data.get('pyeong'),
            small_room_type=data.get('smallRoomType'),
            total_price=data.get('totalPrice'),
            discount1=data.get('discount1', 0),
            discount2=data.get('discount2', 0),
            discount3=data.get('discount3', 0),
            status='대기',  # 기본 상태
            created_at=datetime.now(timezone.utc)
        )
        db.session.add(estimate)
        db.session.flush()  # ID를 얻기 위해 즉시 DB에 저장
        
        # 2. EstimateItem들 저장
        for item in data.get('items', []):
            estimate_item = EstimateItem(
                estimate_id=estimate.id,
                service_option_id=item.get('service_option_id'),
                service_id=item.get('service_id'),
                category_code=item.get('category_code'),
                option_code=item.get('option_code'),
                start_date=item.get('start_date'),
                end_date=item.get('end_date'),
                price=item.get('price')
            )
            db.session.add(estimate_item)

        db.session.commit()
        return jsonify({'success': True, 'message': '견적서 저장 완료'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
    
@bp.route('/list')
def estimate_list():
    estimates = Estimate.query.order_by(Estimate.created_at.desc()).all()
    return render_template('estimate/estimate_list.html', estimates=estimates)

@bp.route('/<int:estimate_id>')
def detail(estimate_id):
    estimate = Estimate.query.get_or_404(estimate_id)
    return render_template('estimate/estimate_detail.html', estimate=estimate)

