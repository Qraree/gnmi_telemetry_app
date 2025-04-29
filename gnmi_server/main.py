from fastapi import FastAPI, HTTPException
from sqlmodel import SQLModel, Field, create_engine, Session, select
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from pygnmi.client import gNMIclient
from api.devices_controller import device_router
from core.config import settings
from core.database import engine

origins = [settings.client_url]


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(device_router)


@app.get("/test/")
def create_device():
    host = (settings.lab_server, 12000)

    with gNMIclient(
        target=host, username="admin", password="admin", insecure=True
    ) as gc:
        result = gc.capabilities()
        return result
