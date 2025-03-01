import os
from flask import Flask
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

load_dotenv()

naming_convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(column_0_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

db = SQLAlchemy(metadata=MetaData(naming_convention=naming_convention))
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object('estimate.config')
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    
    # ORM
    db.init_app(app)
    if app.config['SQLALCHEMY_DATABASE_URI'].startswith("sqlite"):
        migrate.init_app(app, db, render_as_batch=True)
    else:
        migrate.init_app(app, db)
    from . import models
    
    # Jinja 템플릿 필터 추가
    def format_currency(value):
        if value is None:
            return "₩0"
        return f"₩{value:,.0f}"  # 천 단위 콤마 추가
    
    app.jinja_env.filters["format_currency"] = format_currency  # 필터 등록
    
    # blueprint
    from .views import input_view, company_view, site_view, work_view, service_view
    app.register_blueprint(input_view.bp)
    app.register_blueprint(company_view.bp)
    app.register_blueprint(site_view.bp)
    app.register_blueprint(work_view.bp)
    app.register_blueprint(service_view.bp)

    return app  # Flask 인스턴스 반환