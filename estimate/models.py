from estimate import db
from datetime import datetime
from sqlalchemy.orm import validates 

class Company(db.Model):
    __tablename__ = 'companies'  # 테이블 명시적 지정
    #업체 ID
    id = db.Column(db.Integer, primary_key=True)
    #업체명
    name = db.Column(db.String(100))
    #시공품목
    service_id = db.Column(db.Text())
    #연락처
    phone = db.Column(db.Text())
    
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
    #계약금
    contract_deposit = db.Column(db.Integer, default=0)
    #잔금
    remaining_balance = db.Column(db.Integer, default=0)
    #계약일
    contract_date = db.Column(db.Date())
    #수정일자
    modify_date = db.Column(db.DateTime(), nullable=True)
    #거래 유형
    transaction_type = db.Column(db.Text())
    #아카이브 여부
    archive = db.Column(db.Integer, default=0)
    
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
    site = db.relationship('Site', backref=db.backref('work_set'))
    
    #서비스 ID
    service_id = db.Column(db.Text(), db.ForeignKey('services.id', ondelete='CASCADE'))
    #서비스
    service = db.relationship('Service', backref=db.backref('service_set'))
    
    #작업시간대
    work_time = db.Column(db.Text())
    #상세 내용
    details = db.Column(db.Text())
    
    #시공업체 ID
    company_id = db.Column(db.Text(), db.ForeignKey('companies.id', ondelete='CASCADE'))
    #시공업체
    company = db.relationship('Company', backref=db.backref('company_set'))
    
    #메모
    memo = db.Column(db.Text())
    #시작 날짜
    start_date = db.Column(db.Date())
    #종료 날짜
    end_date = db.Column(db.Date())
    #업체 도급가
    company_cost = db.Column(db.Integer, default=0)  # 최종 도급가
    #고객 판매가
    customer_price = db.Column(db.Integer)
    #진행상태
    status = db.Column(db.Text())
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
    #시공ID
    id = db.Column(db.Text(), primary_key=True)
    #시공품목
    name = db.Column(db.Text())