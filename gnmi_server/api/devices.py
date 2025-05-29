from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select

from config.dependencies import (
    get_device_service,
    get_clab_service,
    get_ssh_session_service,
)
from core.database import engine
from config.types.yang import (
    GetYangBody,
    SetInterfaceState,
    SetInterfaceIp,
    AddStaticRoute,
    DeleteStaticRoute,
)
from models.models import Device, Connection


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


@device_router.get("/devices/{device_id}/logs")
async def get_device_logs(
    device_id: int, lines: int, clab_service=Depends(get_clab_service)
):
    with Session(engine) as session:
        device = session.get(Device, device_id)
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")

        return await clab_service.get_logs(device.name, lines)


@device_router.post("/devices/")
def create_device(device: Device):
    with Session(engine) as session:
        session.add(device)
        session.commit()
        session.refresh(device)
        return device


@device_router.post("/devices/{device_id}/session/create")
async def create_ssh_session(
    device_id: int, ssh_session_service=Depends(get_ssh_session_service)
):
    with Session(engine) as session:
        device = session.get(Device, device_id)
        name = device.name

    session_id = await ssh_session_service.create_clab_session(name)
    return {"session_id": session_id}


@device_router.post("/yang")
def get_yang(body: GetYangBody, device_service=Depends(get_device_service)):
    return device_service.yang_request(body)
