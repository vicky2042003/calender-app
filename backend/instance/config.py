import os

class Config:
    SECRET_KEY = "CRO"
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.abspath('../database/app.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
