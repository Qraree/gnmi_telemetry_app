from fastapi import APIRouter, Depends
from pygnmi.client import gNMIclient

from config.dependencies import get_data_migrate_service
from core.settings import settings
from services.data_migrate_service import DataMigrateService

# from services.data_migrate_service import DataMigrateService

test_router = APIRouter(tags=["migrate_data"])


@test_router.get("/test/")
def test():
    host = (settings.lab_server, 12000)

    with gNMIclient(
        target=host, username="admin", password="admin", insecure=True
    ) as gc:
        result = gc.capabilities()
        return result


@test_router.get("/test/connections")
def migrate_connections(
    data_migrate_service=Depends(get_data_migrate_service),
):
    return data_migrate_service.migrate_connections_v1()


@test_router.get("/test/migrate_v2")
async def migrate_v2(
    data_migrate_service: DataMigrateService = Depends(get_data_migrate_service),
):
    return await data_migrate_service.migrate_devices_v2()


@test_router.get("/test/device_gnmi")
async def migrate_v2(
    data_migrate_service: DataMigrateService = Depends(get_data_migrate_service),
):
    return await data_migrate_service.device_gnmi_test()


@test_router.get("/test/ssh")
async def migrate_lab_devices(
    data_migrate_service=Depends(get_data_migrate_service),
):
    return await data_migrate_service.migrate_devices_v2("hello2")
