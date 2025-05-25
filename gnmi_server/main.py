from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI
from redis import Redis
from sqlmodel import SQLModel
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from api.devices import device_router
from api.data_migrate import test_router
from api.websocket import terminal_router
from core.jobs.gnmi_server_auth import token_update_job
from core.redis import init_redis, close_redis
from core.scheduler import scheduler
from core.settings import settings
from core.database import engine

origins = [settings.client_url]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await token_update_job()

    SQLModel.metadata.create_all(engine)
    await init_redis(app)
    scheduler.start()
    yield
    scheduler.shutdown()
    await close_redis(app)


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
app.include_router(terminal_router)
