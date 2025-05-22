from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    client_url: str
    db_url: str
    lab_server: str
    ssh_password: str
    ssh_username: str
    device_username: str
    device_password: str

    class Config:
        env_file = ".env"


settings = Settings()
