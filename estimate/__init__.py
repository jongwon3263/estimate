from flask import Flask
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object('estimate.config')
    
    # ORM
    db.init_app(app)
    migrate.init_app(app, db)
    from . import models
    
    # blueprint
    from .views import input_view, company_view, site_view, work_view, service_view
    app.register_blueprint(input_view.bp)
    app.register_blueprint(company_view.bp)
    app.register_blueprint(site_view.bp)
    app.register_blueprint(work_view.bp)
    app.register_blueprint(service_view.bp)

    return app  # Flask 인스턴스 반환