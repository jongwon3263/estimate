from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, DateField, IntegerField, SubmitField, DecimalField, BooleanField
from wtforms.validators import DataRequired, NumberRange

class SiteForm(FlaskForm):
    district = StringField('지역')
    address = TextAreaField('주소')
    residence_type = TextAreaField('주거 형태')
    room_size = TextAreaField('평수')
    depositor = TextAreaField('입금자명')
    customer_phone=TextAreaField('고객 연락처')
    notes = TextAreaField('메모')
    
class SiteEditForm(FlaskForm):
    district = StringField('지역')
    address = StringField('주소')
    residence_type = StringField('주거 형태')
    room_size = StringField('평수')
    depositor = StringField('입금자명')
    customer_phone = StringField('고객 연락처')
    notes = TextAreaField('메모')
    customer_price = DecimalField('고객 판매가', default=0, places=0)
    contract_deposit = IntegerField('계약금', default=0)
    transaction_type = SelectField(
        '거래 유형',
        choices=[
            ('일반', '일반'),
            ('세금계산서 발행', '세금계산서 발행'),
            ('현금영수증 발행', '현금영수증 발행'),
            ('카드결제', '카드결제'),
        ],
        validators=[DataRequired()], default="일반"
    )
    archive = IntegerField('아카이브')
    
    def process_formdata(self, valuelist):
        if valuelist:
            try:
                self.data = int(float(valuelist[0]))  # 🔹 소수점 제거
            except (ValueError, TypeError):
                self.data = None
    
class WorkAddForm(FlaskForm):
    service = SelectField('서비스', choices=[], coerce=str)
    company = SelectField('업체', choices=[],coerce=str)
    start_date = DateField('시작 날짜', format='%Y-%m-%d')
    end_date = DateField('종료 날짜', format='%Y-%m-%d')
    company_cost = DecimalField('업체 비용', default=0, validators=[DataRequired(), NumberRange(min=0)])
    customer_price = DecimalField('고객 가격', default=0, validators=[DataRequired(), NumberRange(min=0)])
    work_time = TextAreaField('작업 시간대')
    details = TextAreaField('상세 내용')
    memo = TextAreaField('메모')
    status = SelectField(
        '상태',
        choices=[
            ('미배정', '미배정'),
            ('시공예정', '시공예정'),
            ('시공중', '시공중'),
            ('시공완료', '시공완료'),
            ('사건발생', '사건발생'),
        ],
        validators=[DataRequired()]
    )
    submit = SubmitField('등록')

class WorkEditForm(FlaskForm):
    service = SelectField('시공', choices=[])
    company = SelectField('업체', choices=[])
    start_date = DateField('시작일', format='%Y-%m-%d')
    end_date = DateField('종료일', format='%Y-%m-%d')
    work_time = StringField('작업 시간대')
    details = StringField('상세 사항')
    memo = StringField('메모')
    company_cost = DecimalField('업체 도급가', default=0)
    status = SelectField(
        '상태',
        choices=[
            ('미배정', '미배정'),
            ('시공예정', '시공예정'),
            ('시공중', '시공중'),
            ('시공완료', '시공완료'),
            ('사건발생', '사건발생'),
        ],
        validators=[DataRequired()]
    )

    def set_choices(self, services, companies):
        """ 드롭다운 목록을 설정하는 함수 """
        self.service.choices = [(service.id, service.name) for service in services]
        self.company.choices = [(company.id, company.name) for company in companies]
    
