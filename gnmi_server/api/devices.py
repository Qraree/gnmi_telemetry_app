from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select

from core.database import engine
from core.types.yang import (
    GetYangBody,
    SetInterfaceState,
    SetInterfaceIp,
    AddStaticRoute,
    DeleteStaticRoute,
)
from models.Device import Device, Connection
from services.device_service import (
    get_device_system_info,
    set_interface_state,
    set_interface_ip,
    set_static_route,
    DeviceService,
)

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
def get_one_device_specs(device_id: int):
    return get_device_system_info(device_id)


@device_router.post("/devices/interface/state")
def change_interface_state(state: SetInterfaceState):
    return set_interface_state(state)


@device_router.post("/devices/interface/ip")
def change_interface_ip(state: SetInterfaceIp):
    return set_interface_ip(state)


@device_router.post("/devices/routes/static/add")
def add_static_route(body: AddStaticRoute):
    return set_static_route(body)


@device_router.post("/devices/routes/static/delete")
def delete_static_route(body: DeleteStaticRoute):
    return DeviceService.remove_static_route(body)


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
    return DeviceService.yang_request(body)
