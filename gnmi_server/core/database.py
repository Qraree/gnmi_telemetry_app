from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from core.settings import settings

engine = create_engine(settings.db_url, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)