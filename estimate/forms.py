from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, DateField, IntegerField, SubmitField, DecimalField
from wtforms.validators import DataRequired, NumberRange

class SiteForm(FlaskForm):
    address = TextAreaField('주소')
    residence_type = TextAreaField('주거 형태')
    room_size = TextAreaField('평수')
    depositor = TextAreaField('입금자명')
    customer_phone=TextAreaField('고객 연락처')    
    notes = TextAreaField('메모')
    
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
            ('내일시공예정', '내일시공예정'),
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

    def set_choices(self, services, companies):
        """ 드롭다운 목록을 설정하는 함수 """
        self.service.choices = [(service.id, service.name) for service in services]
        self.company.choices = [(company.id, company.name) for company in companies]
    
class SiteEditForm(FlaskForm):
    address = StringField('주소')
    residence_type = StringField('주거 형태')
    room_size = StringField('평수')
    depositor = StringField('입금자명')
    customer_phone = StringField('고객 연락처')
    notes = TextAreaField('메모')