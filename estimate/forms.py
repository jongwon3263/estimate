from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, DateField, IntegerField, SubmitField, FloatField
from wtforms.validators import DataRequired, NumberRange, Optional

class SiteForm(FlaskForm):
    district = StringField('지역')
    address = TextAreaField('주소')
    residence_type = TextAreaField('주거 형태')
    room_size = TextAreaField('평수')
    depositor = TextAreaField('입금자명')
    customer_phone=TextAreaField('고객 연락처')
    notes = TextAreaField('메모')
    # customer_price = FloatField('고객 판매가')
    contract_deposit = FloatField('계약금')
    tax_id = SelectField('세금 처리',choices=[],validators=[DataRequired()], default="일반")
    
class SiteEditForm(FlaskForm):
    district = StringField('지역')
    address = StringField('주소')
    residence_type = StringField('주거 형태')
    room_size = StringField('평수')
    depositor = StringField('입금자명')
    customer_phone = StringField('고객 연락처')
    notes = TextAreaField('메모')
    customer_price = FloatField('고객 판매가', default=0)
    contract_deposit = IntegerField('계약금', default=0)
    tax_treatment = SelectField('세금 처리',choices=[], coerce=str)
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
    start_date = DateField('시작 날짜', format='%Y-%m-%d', validators=[DataRequired()])
    end_date = DateField('종료 날짜', format='%Y-%m-%d', validators=[DataRequired()])
    company_cost = FloatField('업체 도급가', default=0)
    customer_price = FloatField('고객 판매가', default=0)
    work_time = TextAreaField('작업 시간대')
    details = TextAreaField('상세 내용')
    memo = TextAreaField('메모')
    status = SelectField('상태',choices=[], validators=[DataRequired()], coerce=int)
    submit = SubmitField('등록')

class WorkEditForm(FlaskForm):
    service = SelectField('시공', choices=[])
    company = SelectField('업체', choices=[], validate_choice=False, coerce=str)
    start_date = DateField('시작일', format='%Y-%m-%d', validators=[Optional()])
    end_date = DateField('종료일', format='%Y-%m-%d', validators=[Optional()])
    work_time = StringField('작업 시간대', validators=[Optional()])
    details = StringField('상세 사항', validators=[Optional()])
    memo = StringField('메모', validators=[Optional()])
    customer_price = FloatField('고객 판매가', default=0, validators=[Optional()])
    company_cost = FloatField('업체 도급가', default=0, validators=[Optional()])
    additional_cost = FloatField('금액 변동', default=0, validators=[Optional()])
    status = SelectField('상태', choices=[], coerce=int, validators=[Optional()])

    def set_choices(self, services, companies, statuses):
        """ 드롭다운 목록을 설정하는 함수 """
        self.service.choices = [(service.id, service.name) for service in services]
        self.company.choices = [(company.id, company.name) for company in companies]
        self.status.choices = [(status.id, status.name) for status in statuses]
    
class EstimateForm(FlaskForm):
    customer_name = TextAreaField('고객명')
    address = TextAreaField('주소')
    customer_phone = TextAreaField('고객 연락처')
    estimated_date = DateField('견적서 생성일', format='%Y-%m-%d', validators=[DataRequired()])
    