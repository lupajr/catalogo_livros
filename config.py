import os

class Config:
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.abspath('database.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False