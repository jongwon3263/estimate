from flask import Flask, render_template
from dotenv import load_dotenv
import time

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    #라우트 정의
    @app.route('/')
    def home():
        return render_template('1_input.html', time=time)
    
    @app.route('/quotations')
    def quotation_history():
        return render_template('2_quotation_history.html')

    @app.route('/sites')
    def site_list():
        sites = ["서울 오피스텔", "부산 아파트", "대전 빌라", "광주 주택"]
        return render_template('3_site_list.html', sites=sites)

    @app.route('/teams')
    def team_list():
        return render_template('4_team_list.html')

    return app  # Flask 인스턴스 반환