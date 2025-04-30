from fastapi import APIRouter
from sqlmodel import Session, select

from core.database import engine
from models.Device import Device

device_router = APIRouter()


@device_router.get("/devices/")
def get_all_devices():
    with Session(engine) as session:
        devices = session.exec(select(Device)).all()
        return devices


@device_router.post("/devices/")
def create_device(device: Device):
    with Session(engine) as session:
        session.add(device)
        session.commit()
        session.refresh(device)
        return device
