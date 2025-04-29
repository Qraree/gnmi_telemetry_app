from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    client_url: str
    db_url: str
    lab_server: str

    class Config:
        env_file = ".env"


settings = Settings()
