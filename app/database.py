# shortener_app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from .config import get_settings

# this is the database URL, it is read from the settings
engine = create_engine(
    get_settings().db_url, connect_args={"check_same_thread": False}
)

# this is the session factory, it will be used to create database sessions
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)

# this is the base class for our models, which will be used to create the database tables by using the ORM
Base = declarative_base()