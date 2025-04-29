from sqlalchemy import create_engine

from core.config import settings

engine = create_engine(settings.db_url, echo=True)
