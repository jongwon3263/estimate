from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField
from wtforms.validators import DataRequired

class SiteForm(FlaskForm):
    address = TextAreaField('주소')
    residence_type = TextAreaField('주거 형태')
    room_size = TextAreaField('평수')
    depositor = TextAreaField('입금자명')
    customer_phone=TextAreaField('고객 연락처')    
    notes = TextAreaField('메모')
