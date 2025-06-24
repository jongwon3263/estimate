from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from mansys import db, create_app
from mansys.models import (
    Service, Status, Tax, Company, Site, Work,
    Estimate, ServiceOption, EstimateItem
)

load_dotenv(dotenv_path=".env.local")

# Flask 앱 컨텍스트 설정
app = create_app()

# ✅ 상대경로로 SQLite 연결
sqlite_engine = create_engine('sqlite:///mansys/data_everyhome.db')
SQLiteSession = sessionmaker(bind=sqlite_engine)
sqlite_session = SQLiteSession()

# PostgreSQL 세션
pg_session = db.session

def migrate_services():
    for obj in sqlite_session.query(Service).all():
        if not pg_session.get(Service, obj.id):
            pg_session.add(Service(id=obj.id, name=obj.name))
    pg_session.commit()

def migrate_statuses():
    for obj in sqlite_session.query(Status).all():
        if not pg_session.get(Status, obj.id):
            pg_session.add(Status(id=obj.id, name=obj.name))
    pg_session.commit()

def migrate_taxes():
    for obj in sqlite_session.query(Tax).all():
        if not pg_session.get(Tax, obj.id):
            pg_session.add(Tax(id=obj.id, name=obj.name))
    pg_session.commit()

def migrate_companies():
    for obj in sqlite_session.query(Company).all():
        if not pg_session.get(Company, obj.id):
            pg_session.add(Company(
                id=obj.id,
                name=obj.name,
                service_id=obj.service_id,
                phone=obj.phone
            ))
    pg_session.commit()

def migrate_sites():
    for obj in sqlite_session.query(Site).all():
        if not pg_session.get(Site, obj.id):
            pg_session.add(Site(
                id=obj.id,
                district=obj.district,
                address=obj.address,
                residence_type=obj.residence_type,
                room_size=obj.room_size,
                notes=obj.notes,
                depositor=obj.depositor,
                customer_phone=obj.customer_phone,
                customer_price=obj.customer_price or 0,
                contract_deposit=obj.contract_deposit or 0,
                remaining_balance=obj.remaining_balance or 0,
                contract_date=obj.contract_date,
                modify_date=obj.modify_date,
                archive=obj.archive or 0,
                tax_id=obj.tax_id
            ))
    pg_session.commit()

def migrate_works():
    for obj in sqlite_session.query(Work).all():
        if not pg_session.get(Work, obj.id):
            pg_session.add(Work(
                id=obj.id,
                site_id=obj.site_id,
                status_id=int(obj.status_id) if obj.status_id else None,
                service_id=obj.service_id,
                work_time=obj.work_time,
                details=obj.details,
                company_id=int(obj.company_id) if obj.company_id else None,
                memo=obj.memo,
                start_date=obj.start_date,
                end_date=obj.end_date,
                company_cost=obj.company_cost or 0,
                customer_price=obj.customer_price or 0,
                additional_cost=obj.additional_cost or 0,
                modify_date=obj.modify_date
            ))
    pg_session.commit()

def migrate_estimates():
    for obj in sqlite_session.query(Estimate).all():
        new_obj = Estimate(
            id=obj.id,
            customer_name=obj.customer_name,
            address=obj.address,
            customer_phone=obj.customer_phone,
            created_at=obj.created_at or datetime.now(),
            total_price=0,
            status="초안"
        )
        pg_session.add(new_obj)
    pg_session.commit()

def run_all():
    migrate_services()
    migrate_statuses()
    migrate_taxes()
    migrate_companies()
    migrate_sites()
    migrate_works()
    migrate_estimates()
    print("✅ 모든 데이터 마이그레이션 완료!")

if __name__ == '__main__':
    with app.app_context():
        run_all()
        print("🏁 마이그레이션 실행 완료")