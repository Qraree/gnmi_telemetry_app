from fastapi import HTTPException
from sqlmodel import Session
from starlette.responses import JSONResponse

from core.types.logging import logger
from core.database import engine
from core.types.yang import GetYangBody, SetInterfaceState, SetInterfaceIp
from models.Device import Device
from services.gnmi_service import call_gnmi_get, call_gnmi_set


def yang_request(body: GetYangBody):
    try:
        with Session(engine) as session:
            device = session.get(Device, body.id)

            if not device:
                raise HTTPException(status_code=404, detail="Device not found")

            if not device.type == "network":
                raise HTTPException(status_code=400, detail="Device type not supported")

            return call_gnmi_get(device, body.path)

    except Exception as e:
        logger.error(e)
        return JSONResponse(
            status_code=400,
            content={"message": f"Ошибка запроса! {e}"},
        )


def get_device_system_info(device_id: int):
    try:
        with Session(engine) as session:
            device = session.get(Device, device_id)

            if not device:
                raise HTTPException(status_code=404, detail="Device not found")

            if not device.type == "network":
                raise HTTPException(status_code=400, detail="Device type not supported")

            return call_gnmi_get(device, ["system"])

    except Exception as e:
        logger.error(e)
        return JSONResponse(
            status_code=500,
            content={"message": f"Ошибка запроса! {e}"},
        )


def set_interface_state(body: SetInterfaceState):
    try:
        with Session(engine) as session:
            device = session.get(Device, body.device_id)

            if not device:
                raise HTTPException(status_code=404, detail="Device not found")

            if not device.type == "network":
                raise HTTPException(status_code=400, detail="Device type not supported")

            u = [
                (
                    f"openconfig:/interfaces/interface[name={body.name}]/",
                    {
                        "config": {
                            "name": f"{body.name}",
                            "enabled": body.state,
                        }
                    },
                )
            ]

            return call_gnmi_set(device, u)

    except Exception as e:
        logger.error(e)
        return JSONResponse(
            status_code=500,
            content={"message": f"Ошибка запроса! {e}"},
        )


def set_interface_ip(body: SetInterfaceIp):
    try:
        with Session(engine) as session:
            device = session.get(Device, body.device_id)

            if not device:
                raise HTTPException(status_code=404, detail="Device not found")

            if not device.type == "network":
                raise HTTPException(status_code=400, detail="Device type not supported")

            u = [
                (
                    f"/interfaces/interface[name={body.interface_name}]/subinterfaces/subinterface[index={body.index}]/ipv4/addresses/",
                    {
                        "address": [
                            {
                                "ip": body.ip,
                                "config": {
                                    "ip": body.ip,
                                    "prefix-length": body.prefix_length,
                                },
                            },
                        ],
                    },
                )
            ]

            return call_gnmi_set(device, u)

    except Exception as e:
        logger.error(e)
        return {"error": str(e)}
