from mansys import db
from datetime import datetime, timezone
from sqlalchemy.orm import validates 
from sqlalchemy.ext.hybrid import hybrid_property

class Company(db.Model):
    __tablename__ = 'companies'  # 테이블 명시적 지정
    #업체 ID
    id = db.Column(db.Integer, primary_key=True)
    #업체명
    name = db.Column(db.String(100))
    #시공품목
    service_id = db.Column(db.Text, db.ForeignKey('services.id'))
    service = db.relationship('Service', back_populates='companies')
    #연락처
    phone = db.Column(db.Text())
    works = db.relationship("Work", back_populates="company")
class Site(db.Model):
    __tablename__ = 'sites'
    #시공ID
    id = db.Column(db.Text(), primary_key=True)
    #지역
    district = db.Column(db.Text())
    #주소
    address = db.Column(db.Text())
    #주거 형태
    residence_type = db.Column(db.Text())
    #방 크기
    room_size = db.Column(db.Integer)
    room_size_small = db.Column(db.String(50))
    #메모
    notes = db.Column(db.Text())
    #입금자명
    depositor = db.Column(db.Text())
    #고객 연락처
    customer_phone = db.Column(db.Text())
    #고객 판매가
    customer_price = db.Column(db.Integer, default=0)
    works = db.relationship("Work", back_populates="site", lazy="dynamic")
    
    #계약금
    contract_deposit = db.Column(db.Integer, default=0)
    #잔금
    remaining_balance = db.Column(db.Integer, default=0)
    #계약일
    contract_date = db.Column(db.Date())
    #수정일자
    modify_date = db.Column(db.DateTime(), nullable=True)
    #아카이브 여부
    archive = db.Column(db.Integer, default=0)
    #세금 ID 생성, 모델과의 연결
    tax_id = db.Column(db.Text(), db.ForeignKey('taxes.id'))
    tax = db.relationship('Tax', back_populates='site')
    
    # 시공 매출의 합으로 현장 매출 리턴
    @hybrid_property
    def total_customer_price(self):
        return sum(
            (work.customer_price or 0) + (work.additional_cost or 0) for work in self.works.all()
                   )
    
    def update_customer_price(self):
        self.customer_price = self.total_customer_price
        self.update_remaining_balance()
    

    # 현장 id 자동 생성
    def __init__(self, **kwargs):
        """객체가 생성될 때 id 자동 생성"""
        super().__init__(**kwargs)  # 기본 필드 값 설정

        if not self.id:  # id가 없으면 자동 생성
            self.id = self.generate_id()
    
    @staticmethod
    def generate_id():
        """ 오늘 날짜 기준으로 'YYMMDD-XXX' 형식의 id 자동 생성 """
        today_str = datetime.today().strftime("%y%m%d")  # '250226' 형식

        # 해당 날짜로 시작하는 ID 중 가장 큰 번호 찾기
        latest_site = Site.query.filter(Site.id.like(f"{today_str}-%"))\
                                .order_by(Site.id.desc()).first()

        if latest_site:
            last_number = int(latest_site.id.split("-")[1])  # 뒤의 숫자 추출
            new_number = last_number + 1
        else:
            new_number = 1  # 첫 번째 데이터면 001부터 시작

        return f"{today_str}-{new_number:03d}"  # 3자리 숫자로 맞추기
    
    def update_remaining_balance(self):
        """고객 판매가와 계약금 변경 시 잔금을 자동 업데이트"""
        self.remaining_balance = max(self.customer_price - self.contract_deposit, 0)
class Work(db.Model):
    __tablename__ = 'works'
    #개별시공ID
    id = db.Column(db.Text(), primary_key=True)
    #현장 ID 생성, 모델과의 연결
    site_id = db.Column(db.Text(), db.ForeignKey('sites.id', ondelete='CASCADE'))
    site = db.relationship('Site', back_populates="works")
    #상태 ID 생성, 모델과의 연결
    status_id = db.Column(db.Integer, db.ForeignKey('statuses.id', ondelete='CASCADE'))
    status = db.relationship('Status', back_populates="works")
    #서비스 ID 생성, 모델과의 연결
    service_id = db.Column(db.Text(), db.ForeignKey('services.id', ondelete='CASCADE'))
    service = db.relationship('Service', back_populates="works")
    #작업시간대
    work_time = db.Column(db.Text())
    #상세 내용
    details = db.Column(db.Text())
    #시공업체 ID 생성, 모델과의 연결
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'))
    company = db.relationship('Company', back_populates="works")
    #메모
    memo = db.Column(db.Text())
    #시작 날짜
    start_date = db.Column(db.Date())
    #종료 날짜
    end_date = db.Column(db.Date())
    #업체 도급가
    company_cost = db.Column(db.Integer, default=0)
    #고객 판매가
    customer_price = db.Column(db.Integer, default=0)
    #금액 변동
    additional_cost = db.Column(db.Integer, default=0)
    
    #수정일자
    modify_date = db.Column(db.DateTime(), nullable=True)

    
    def __init__(self, **kwargs):
        """id 자동 생성"""
        super().__init__(**kwargs)

        if not self.id:  # id가 없으면 자동 생성
            self.id = self.generate_id()

    def generate_id(self):
        """ ID 형식: site_id-service_id """
        return f"{self.site_id}-{self.service_id}"  # 예: 250226-001-CL

class Status(db.Model):
    __tablename__ = 'statuses'
    #상태ID
    id = db.Column(db.Integer, primary_key=True)
    #시공품목
    name = db.Column(db.Text())
    works = db.relationship('Work', back_populates='status')
class Tax(db.Model):
    __tablename__ = 'taxes'
    #상태ID
    id = db.Column(db.Text(), primary_key=True)
    #시공품목
    name = db.Column(db.Text())
    site = db.relationship('Site', back_populates='tax')

class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Text, primary_key=True)
    name = db.Column(db.Text())
    
    companies = db.relationship('Company', back_populates='service')
    works = db.relationship("Work", back_populates='service')
    options = db.relationship('ServiceOption', back_populates='service', lazy=True)
    discounts = db.relationship('Discount', back_populates='service', lazy=True)
    categories = db.relationship('ServiceCategory', back_populates='service', cascade='all, delete-orphan')
    
class ServiceCategory(db.Model):
    __tablename__ = 'service_categories'
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Text, db.ForeignKey('services.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(10))
    
    service = db.relationship('Service', back_populates='categories')
    options = db.relationship('ServiceOption', back_populates='category')
class ServiceOption(db.Model):
    __tablename__ = 'service_options'

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Text, db.ForeignKey('services.id'), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('service_categories.id'))
    category = db.relationship('ServiceCategory', back_populates='options')

    name = db.Column(db.String(100), nullable=False)
    category_code = db.Column(db.Integer, nullable=True)
    code = db.Column(db.Integer, nullable=True)
    price = db.Column(db.Integer, nullable=False)
    per_pyeong = db.Column(db.Boolean, default=False)
    discounted_price = db.Column(db.Integer, nullable=True)
    

    service = db.relationship('Service', back_populates='options')
    
    estimate_items = db.relationship('EstimateItem', back_populates='service_option')
    
class Discount(db.Model):
    __tablename__ = 'discounts'

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Text, db.ForeignKey('services.id'), nullable=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    code = db.Column(db.String(3), nullable=True)
    discount_id = db.Column(db.Integer, nullable=True)
    amount = db.Column(db.Integer, nullable=False)
    per_pyeong = db.Column(db.Boolean, default=False) 
    
    service = db.relationship('Service', back_populates='discounts')
    
    # estimate_items = db.relationship('EstimateItem', back_populates='service_option')
    
class Estimate(db.Model):
    __tablename__ = 'estimates'
    id = db.Column(db.Integer, primary_key=True)
    #고객 이름
    customer_name = db.Column(db.String(10))
    #연락처
    customer_phone = db.Column(db.String(20))
    #주소
    address = db.Column(db.String(100))
    #집 구조
    room_type = db.Column(db.String(20))  # 예: 'smallType', 'mediumType', 'largeType'
    #평수
    pyeong = db.Column(db.Integer)
    #소형 평수 구조
    small_room_type = db.Column(db.String(50))
    #총 금액
    total_price = db.Column(db.Integer, default=0)
    #견적서 생성 날짜
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    #견적서 상태
    status = db.Column(db.String(20))
    items = db.relationship('EstimateItem', back_populates='estimate', lazy=True, cascade="all, delete-orphan")
    #할인
    discount1 = db.Column(db.Integer, default=0)
    discount2 = db.Column(db.Integer, default=0)
    discount3 = db.Column(db.Integer, default=0)
    
class EstimateItem(db.Model):
    __tablename__ = 'estimate_items'

    id = db.Column(db.Integer, primary_key=True)
    estimate_id = db.Column(db.Integer, db.ForeignKey('estimates.id'), nullable=False)
    estimate = db.relationship('Estimate', back_populates='items')

    # 날짜
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)

    # 가격
    price = db.Column(db.Integer, nullable=False)

    # 서비스 옵션
    service_option_id = db.Column(db.Integer, db.ForeignKey('service_options.id'), nullable=False)
    service_option = db.relationship('ServiceOption', back_populates='estimate_items')

    # ✅ 추가: 서비스 고유 코드 구성 요소
    service_id = db.Column(db.Text, nullable=False)           # 예: 'cl', 'gr', 'co'
    category_code = db.Column(db.Integer, nullable=False)     # 예: 9
    option_code = db.Column(db.Integer, nullable=False)       # 예: 1