from flask import Blueprint, request, jsonify, render_template
from models.book import db, Book, book_schema, books_schema

book_bp = Blueprint('book', __name__)

@book_bp.route("/")
def home():
    return render_template("index.html")

@book_bp.route("/book", methods=["POST"])
def add_book():
    title = request.json["title"]
    author = request.json["author"]
    
    new_book = Book(title, author)
    db.session.add(new_book)
    db.session.commit()
    
    return book_schema.jsonify(new_book)

@book_bp.route("/book", methods=["GET"])
def get_books():
    all_books = Book.query.all()
    return books_schema.jsonify(all_books)

@book_bp.route("/book/<int:id>", methods=["GET"])
def get_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"message": "Book not found"}), 404
    return book_schema.jsonify(book)

@book_bp.route("/book/<int:id>", methods=["PUT", "PATCH"])
def update_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"message": "Book not found"}), 404

    data = request.json
    if "title" not in data and "author" not in data:
        return jsonify({"message": "Pelo menos um campo (título ou autor) deve ser fornecido"}), 400

    if "title" in data:
        new_title = data["title"].strip()
        if not new_title:
            return jsonify({"message": "O título não pode estar vazio"}), 400
        book.title = new_title

    if "author" in data:
        new_author = data["author"].strip()
        if not new_author:
            return jsonify({"message": "O autor não pode estar vazio"}), 400
        book.author = new_author

    db.session.commit()
    return book_schema.jsonify(book)

@book_bp.route("/book/<int:id>", methods=["DELETE"])
def delete_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"message": "Book not found"}), 404

    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted successfully"})