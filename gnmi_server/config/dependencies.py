from fastapi import Depends
from redis import Redis

from core.redis import  get_ioredis_client
from services.clab_api_service import ClabAPIService
from services.data_migrate_service import DataMigrateService


def get_clab_service(redis: Redis = Depends(get_ioredis_client)) -> ClabAPIService:
    return ClabAPIService(redis)

def get_data_migrate_service(club_api_service: ClabAPIService = Depends(get_clab_service)) -> DataMigrateService:
    return DataMigrateService(club_api_service)