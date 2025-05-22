from fastapi import HTTPException
from pygnmi.client import gNMIclient
from starlette.responses import JSONResponse

from core.config import settings
from core.types.logging import logger


class GNMIService:

    @staticmethod
    def call_gnmi_delete(device, path):
        try:
            target_port = device.container_host_port
            host = (settings.lab_server, target_port)

            with gNMIclient(
                target=host,
                username=settings.device_username,
                password=settings.device_password,
                insecure=True,
            ) as gc:
                result = gc.set(delete=path)
                return result
        except Exception as e:
            print(e)
            raise IOError(e)


def call_gnmi_get(device, path) -> JSONResponse | dict:
    try:
        target_port = device.container_host_port

        if not target_port:
            raise HTTPException(status_code=400, detail="Target port not found")

        host = (settings.lab_server, target_port)

        with gNMIclient(
            target=host,
            username=settings.device_username,
            password=settings.device_password,
            insecure=True,
        ) as gc:
            result = gc.get(path=path)
            return result

    except Exception as e:
        logger.error(e)
        return JSONResponse(
            status_code=400,
            content={"message": f"Ошибка gnmi запроса! {e}"},
        )


def call_gnmi_set(device, update_data):
    try:
        target_port = device.container_host_port
        host = (settings.lab_server, target_port)

        with gNMIclient(
            target=host,
            username=settings.device_username,
            password=settings.device_password,
            insecure=True,
        ) as gc:
            result = gc.set(update=update_data)
            return result
    except Exception as e:
        print(e)
        raise IOError(e)


def call_gnmi_replace(device, update_data):
    try:
        target_port = device.container_host_port
        host = (settings.lab_server, target_port)

        with gNMIclient(
            target=host,
            username=settings.device_username,
            password=settings.device_password,
            insecure=True,
        ) as gc:
            result = gc.set(replace=update_data)
            return result
    except Exception as e:
        print(e)
        raise IOError(e)
