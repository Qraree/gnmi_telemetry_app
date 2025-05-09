from fastapi import FastAPI
from sqlmodel import SQLModel
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from api.devices_controller import device_router
from api.test_controller import test_router
from core.config import settings
from core.database import engine
from core.rabbitmq import RabbitMQClient

origins = [settings.client_url]
rabbitmq_client: RabbitMQClient | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global rabbitmq_client
    SQLModel.metadata.create_all(engine)
    rabbitmq_client = RabbitMQClient(
        username=settings.rabbitmq_username,
        password=settings.rabbitmq_password,
    )
    try:
        yield
    finally:
        if rabbitmq_client and rabbitmq_client.connection.is_open:
            rabbitmq_client.connection.close()


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(device_router)
app.include_router(test_router)
