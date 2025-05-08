from mansys import db
from datetime import datetime, timezone
from sqlalchemy.orm import validates 
from sqlalchemy.ext.hybrid import hybrid_property

# 중간 테이블 정의 (plain Table 사용)
estimate_services = db.Table('estimate_services',
    db.Column('estimate_id', db.Integer, db.ForeignKey('estimates.id')),
    db.Column('service_id', db.Text, db.ForeignKey('services.id'))
)

class Company(db.Model):
    __tablename__ = 'companies'  # 테이블 명시적 지정
    #업체 ID
    id = db.Column(db.Integer, primary_key=True)
    #업체명
    name = db.Column(db.String(100))
    #시공품목
    service_id = db.Column(db.Text, db.ForeignKey('services.id'))
    service = db.relationship('Service', backref='companies')
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
    room_size = db.Column(db.Text())
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
    
    #현장 ID
    site_id = db.Column(db.Text(), db.ForeignKey('sites.id', ondelete='CASCADE'))
    #시공현장
    site = db.relationship('Site', back_populates="works")
    #상태 ID
    status_id = db.Column(db.Text(), db.ForeignKey('statuses.id', ondelete='CASCADE'))
    status = db.relationship('Status', back_populates="works")
    
    #서비스 ID
    service_id = db.Column(db.Text(), db.ForeignKey('services.id', ondelete='CASCADE'))
    #서비스
    service = db.relationship('Service', back_populates="works")
    
    #작업시간대
    work_time = db.Column(db.Text())
    #상세 내용
    details = db.Column(db.Text())
    
    #시공업체 ID
    company_id = db.Column(db.Text(), db.ForeignKey('companies.id', ondelete='CASCADE'))
    #시공업체
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
    
class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Text, primary_key=True)
    name = db.Column(db.Text())

    works = db.relationship("Work", back_populates="service")
    estimates = db.relationship('Estimate', secondary=estimate_services, back_populates='services')
    
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
    
class Estimate(db.Model):
    __tablename__ = 'estimates'
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(10))
    address = db.Column(db.String(100))
    customer_phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    estimate_status_id = db.Column(db.Integer, db.ForeignKey('estimate_statuses.id'))
    estimate_status = db.relationship('EstimateStatus', back_populates='estimates')
    # N:M 관계
    services = db.relationship('Service', secondary=estimate_services, back_populates='estimates')
class EstimateStatus(db.Model):
    __tablename__ = 'estimate_statuses'
    #상태ID
    id = db.Column(db.Integer, primary_key=True)
    #시공품목
    name = db.Column(db.String(10))
    
    estimates = db.relationship('Estimate', back_populates='estimate_status')
    