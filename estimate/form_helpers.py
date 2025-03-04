from estimate.models import Site, Service, Company, Work

def get_company_choices():
    """Company 목록을 (id, name) 형태의 튜플 리스트로 반환"""
    return [(company.id, company.name) for company in Company.query.all()]

def get_service_choices():
    """Service 목록을 (id, name) 형태의 튜플 리스트로 반환"""
    return [(service.id, service.name) for service in Service.query.all()]
