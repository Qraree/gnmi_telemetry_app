from fastapi import APIRouter, Depends

from config.dependencies import get_clab_service
from services.clab_api_service import ClabAPIService

common_router = APIRouter(tags=["common"])


@common_router.get("/server-health/")
async def get_server_health(
    clab_api_service: ClabAPIService = Depends(get_clab_service),
):
    return await clab_api_service.get_health()
