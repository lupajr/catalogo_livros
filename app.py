from flask import Flask
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent))

from models.book import db, ma
from routes.book_routes import book_bp
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Inicializa as extensões
    db.init_app(app)
    ma.init_app(app)
    
    # Registra os blueprints
    app.register_blueprint(book_bp)
    
    # Cria as tabelas do banco de dados
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)