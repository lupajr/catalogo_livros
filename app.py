from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os
# Inicializando o Flask
app = Flask(__name__)

# Configuração do Banco de Dados (SQLite)

db_path = os.path.abspath("database.db")
print(f"Banco de dados será criado/acessado em: {db_path}")

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"

# Inicializando o banco e o Marshmallow
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Criando o Modelo do Banco de Dados
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)

    def __init__(self, title, author):
        self.title = title
        self.author = author

# Criando o Schema para serialização
class BookSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Book

book_schema = BookSchema()
books_schema = BookSchema(many=True)

# Criar as tabelas no banco de dados
with app.app_context():
    db.create_all()

# Rota Principal (Página HTML)
@app.route("/")
def home():
    return render_template("index.html")

# 📌 CRUD - CREATE (Criar um novo livro)
@app.route("/book", methods=["POST"])
def add_book():
    title = request.json["title"]
    author = request.json["author"]
    
    new_book = Book(title, author)
    db.session.add(new_book)
    db.session.commit()
    
    return book_schema.jsonify(new_book)

# 📌 CRUD - READ (Listar todos os livros)
@app.route("/book", methods=["GET"])
def get_books():
    all_books = Book.query.all()
    return books_schema.jsonify(all_books)

# 📌 CRUD - READ (Buscar um livro específico)
@app.route("/book/<int:id>", methods=["GET"])
def get_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"message": "Book not found"}), 404
    return book_schema.jsonify(book)

# 📌 CRUD - UPDATE (Atualizar um livro)
@app.route("/book/<int:id>", methods=["PUT", "PATCH"])
def update_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"message": "Book not found"}), 404

    data = request.json
    if "title" in data:
        book.title = data["title"]
    if "author" in data:
        book.author = data["author"]

    db.session.commit()
    return book_schema.jsonify(book)

# 📌 CRUD - DELETE (Excluir um livro)
@app.route("/book/<int:id>", methods=["DELETE"])
def delete_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"message": "Book not found"}), 404

    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted successfully"})

# Rodando o aplicativo
if __name__ == "__main__":
    app.run(debug=True)
