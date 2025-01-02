from flask import Flask, render_template
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
@app.route('/')
def home():
    return render_template('add.html')

if __name__ == '__main__':
    app.run(debug=True)
