from fastapi import APIRouter, HTTPException
from pygnmi.client import gNMIclient
from sqlmodel import Session, select

from core.config import settings
from core.database import engine
from core.types.logging import logger
from core.types.yang import GetYangBody
from models.Device import Device, Connection

device_router = APIRouter()


@device_router.get("/connections/")
def get_all_connections():
    with Session(engine) as session:
        connections = session.exec(select(Connection)).all()
        print(connections)
        return connections


@device_router.get("/devices/")
def get_all_devices():
    with Session(engine) as session:
        devices = session.exec(select(Device)).all()
        return devices


@device_router.get("/devices/{device_id}/specs")
def get_one_device_specs(device_id: int):
    try:
        with Session(engine) as session:
            device = session.get(Device, device_id)

            if not device:
                raise HTTPException(status_code=404, detail="Device not found")

            if not device.type == "network":
                raise HTTPException(status_code=400, detail="Device type not supported")

            target_port = device.container_host_port
            host = (settings.lab_server, target_port)

            with gNMIclient(
                target=host, username="admin", password="admin", insecure=True
            ) as gc:
                result = gc.get(path=["system"])
                print(result)
                return result

    except Exception as e:
        logger.error(e)
        return {"error": str(e)}


@device_router.get("/devices/{device_id}")
def get_one_device(device_id: int):
    with Session(engine) as session:
        device = session.get(Device, device_id)
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")

        return device


@device_router.post("/devices/")
def create_device(device: Device):
    with Session(engine) as session:
        session.add(device)
        session.commit()
        session.refresh(device)
        return device


@device_router.post("/yang")
def get_yang(body: GetYangBody):
    try:
        with Session(engine) as session:
            device = session.get(Device, body.id)

            if not device:
                raise HTTPException(status_code=404, detail="Device not found")

            if not device.type == "network":
                raise HTTPException(status_code=400, detail="Device type not supported")

            target_port = device.container_host_port

            if not target_port:
                raise HTTPException(status_code=400, detail="Target port not found")

            host = (settings.lab_server, target_port)

            with gNMIclient(
                target=host, username="admin", password="admin", insecure=True
            ) as gc:
                result = gc.get(path=body.path)
                print(result)
                return result

    except Exception as e:
        logger.error(e)
        return {"error": str(e)}
