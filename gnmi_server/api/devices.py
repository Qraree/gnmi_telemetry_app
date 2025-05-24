from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select

from config.dependencies import get_device_service
from core.database import engine
from config.types.yang import (
    GetYangBody,
    SetInterfaceState,
    SetInterfaceIp,
    AddStaticRoute,
    DeleteStaticRoute,
)
from models.Device import Device, Connection


device_router = APIRouter(tags=["devices"])


@device_router.get("/connections/")
def get_all_connections():
    with Session(engine) as session:
        connections = session.exec(select(Connection)).all()
        return connections


@device_router.get("/devices/")
def get_all_devices():
    with Session(engine) as session:
        devices = session.exec(select(Device)).all()
        return devices


@device_router.get("/devices/{device_id}/specs")
def get_one_device_specs(device_id: int, device_service=Depends(get_device_service)):
    return device_service.get_device_system_info(device_id)


@device_router.post("/devices/interface/state")
def change_interface_state(
    state: SetInterfaceState, device_service=Depends(get_device_service)
):
    return device_service.set_interface_state(state)


@device_router.post("/devices/interface/ip")
def change_interface_ip(
    state: SetInterfaceIp, device_service=Depends(get_device_service)
):
    return device_service.set_interface_ip(state)


@device_router.post("/devices/routes/static/add")
def add_static_route(body: AddStaticRoute, device_service=Depends(get_device_service)):
    return device_service.set_static_route(body)


@device_router.post("/devices/routes/static/delete")
def delete_static_route(
    body: DeleteStaticRoute, device_service=Depends(get_device_service)
):
    return device_service.remove_static_route(body)


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
def get_yang(body: GetYangBody, device_service=Depends(get_device_service)):
    return device_service.yang_request(body)
