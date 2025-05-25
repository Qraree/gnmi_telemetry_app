from fastapi import Depends
from redis import Redis

from core.redis import  get_ioredis_client
from services.clab_api_service import ClabAPIService
from services.data_migrate_service import DataMigrateService
from services.device_service import DeviceService
from services.gnmi_service import GNMIService
from services.ssh_session_service import SSHSessionService


def get_clab_service(redis: Redis = Depends(get_ioredis_client)) -> ClabAPIService:
    return ClabAPIService(redis)

def get_data_migrate_service(club_api_service: ClabAPIService = Depends(get_clab_service)) -> DataMigrateService:
    return DataMigrateService(club_api_service)

def get_gnmi_service():
    return GNMIService()

def get_device_service(gnmi_service: GNMIService = Depends(get_gnmi_service)) -> DeviceService:
    return DeviceService(gnmi_service)

def get_ssh_session_service(club_api_service: ClabAPIService = Depends(get_clab_service)) -> SSHSessionService:
    return SSHSessionService(club_api_service)

