import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import MetaData
from dotenv import load_dotenv

# .env 로드
load_dotenv()

# naming convention 설정
naming_convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(column_0_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

# SQLAlchemy와 Migrate 인스턴스 생성
db = SQLAlchemy(metadata=MetaData(naming_convention=naming_convention))
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object('mansys.config')

    # .env에서 불러온 설정 적용
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['TEMPLATES_AUTO_RELOAD'] = os.getenv('TEMPLATES_AUTO_RELOAD', 'False') == 'True'
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')

    # ORM 및 마이그레이션 설정
    db.init_app(app)
    uri = app.config.get("SQLALCHEMY_DATABASE_URI", "")
    if uri.startswith("sqlite"):
        migrate.init_app(app, db, render_as_batch=True)
    else:
        migrate.init_app(app, db)

    # 모델 로드
    from . import models

    # 템플릿 필터 등록
    def format_currency(value):
        return f"₩{value:,.0f}" if value else "₩0"
    app.jinja_env.filters["format_currency"] = format_currency

    # 블루프린트 등록
    from .views import input_view, company_view, site_view, work_view, service_view, estimate_view, calendar_view, estimate_api
    app.register_blueprint(input_view.bp)
    app.register_blueprint(company_view.bp)
    app.register_blueprint(site_view.bp)
    app.register_blueprint(work_view.bp)
    app.register_blueprint(service_view.bp)
    app.register_blueprint(estimate_view.bp)
    app.register_blueprint(calendar_view.bp)
    app.register_blueprint(estimate_api.bp)

    return app