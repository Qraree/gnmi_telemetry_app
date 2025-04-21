from typing import Optional
from fastapi import FastAPI, HTTPException
from sqlmodel import SQLModel, Field, create_engine, Session, select
from contextlib import asynccontextmanager

from models.Device import Device

sqlite_url = "sqlite:///database.db"
engine = create_engine(sqlite_url, echo=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/devices/")
def get_heroes():
    with Session(engine) as session:
        devices = session.exec(select(Device)).all()
        return devices

@app.post("/devices/")
def create_device(device: Device):
    with Session(engine) as session:
        session.add(device)
        session.commit()
        session.refresh(device)
        return device

