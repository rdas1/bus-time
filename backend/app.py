from flask import Flask
from config import Config
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

from endpoints.routes import api_bp

app.register_blueprint(api_bp)

if __name__ == "__main__":
    app.run(debug=True)

