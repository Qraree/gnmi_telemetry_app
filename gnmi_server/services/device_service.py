from fastapi import HTTPException
from sqlmodel import Session
from starlette.responses import JSONResponse

from core.logging import logger
from core.database import engine
from config.types.yang import (
    GetYangBody,
    SetInterfaceState,
    SetInterfaceIp,
    AddStaticRoute,
    DeleteStaticRoute,
)
from models.models import Device
from services.gnmi_service import (
    GNMIService,
)


class DeviceService:

    def __init__(self, gnmi_service: GNMIService):
        self.gnmi_service = gnmi_service

    def yang_request(self, body: GetYangBody):
        try:
            with Session(engine) as session:
                device = session.get(Device, body.id)

                if not device:
                    raise HTTPException(status_code=404, detail="Device not found")

                if not device.type == "network":
                    raise HTTPException(
                        status_code=400, detail="Device type not supported"
                    )

                return self.gnmi_service.call_gnmi_get(device, body.path)

        except Exception as e:
            logger.error(e)
            return JSONResponse(
                status_code=400,
                content={"message": f"Ошибка запроса! {e}"},
            )

    @staticmethod
    def remove_static_route(body: DeleteStaticRoute):
        try:
            with Session(engine) as session:
                device = session.get(Device, body.device_id)

                if not device:
                    raise HTTPException(status_code=404, detail="Device not found")

                if not device.type == "network":
                    raise HTTPException(
                        status_code=400, detail="Device type not supported"
                    )

            delete_path = [
                f"/network-instances/network-instance[name=default]/protocols/protocol[identifier=openconfig-policy-types:STATIC][name=STATIC]/static-routes/static[prefix={body.prefix}]/"
            ]

            return GNMIService.call_gnmi_delete(device, delete_path)

        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={"message": f"Ошибка запроса! {e}"},
            )

    def get_device_system_info(self, device_id: int):
        try:
            with Session(engine) as session:
                device = session.get(Device, device_id)

                if not device:
                    raise HTTPException(status_code=404, detail="Device not found")

                if not device.type == "network":
                    raise HTTPException(
                        status_code=400, detail="Device type not supported"
                    )

                return self.gnmi_service.call_gnmi_get(device, ["system"])

        except Exception as e:
            logger.error(e)
            return JSONResponse(
                status_code=400,
                content={"message": f"Ошибка запроса! {e}"},
            )

    def set_interface_state(self, body: SetInterfaceState):
        try:
            with Session(engine) as session:
                device = session.get(Device, body.device_id)

                if not device:
                    raise HTTPException(status_code=404, detail="Device not found")

                if not device.type == "network":
                    raise HTTPException(
                        status_code=400, detail="Device type not supported"
                    )

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

                return self.gnmi_service.call_gnmi_set(device, u)

        except Exception as e:
            logger.error(e)
            return JSONResponse(
                status_code=400,
                content={"message": f"Ошибка запроса! {e}"},
            )

    def set_static_route(self, body: AddStaticRoute):
        try:
            with Session(engine) as session:
                device = session.get(Device, body.device_id)

                if not device:
                    raise HTTPException(status_code=404, detail="Device not found")

                if not device.type == "network":
                    raise HTTPException(
                        status_code=400, detail="Device type not supported"
                    )

                static_index = "AUTO_" + body.prefix
                u = [
                    (
                        f"/network-instances/network-instance[name=default]/protocols/protocol[identifier=openconfig-policy-types:STATIC][name=STATIC]/static-routes/static[prefix={body.prefix}]/",
                        {
                            "config": {
                                "prefix": body.prefix,
                            },
                            "next-hops": {
                                "next-hop": [
                                    {
                                        "config": {
                                            "index": static_index,
                                            "metric": 0,
                                            "next-hop": body.next_hop,
                                            "preference": 1,
                                        },
                                        "index": static_index,
                                    }
                                ]
                            },
                            "prefix": body.prefix,
                        },
                    )
                ]

                return self.gnmi_service.call_gnmi_set(device, u)

        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={"messagse": f"Ошибка запроса! {e}"},
            )

    def set_interface_ip(self, body: SetInterfaceIp):
        try:
            with Session(engine) as session:
                device = session.get(Device, body.device_id)

                if not device:
                    raise HTTPException(status_code=404, detail="Device not found")

                if not device.type == "network":
                    raise HTTPException(
                        status_code=400, detail="Device type not supported"
                    )

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

                return self.gnmi_service.call_gnmi_replace(device, u)

        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={"messagse": f"Ошибка запроса! {e}"},
            )
