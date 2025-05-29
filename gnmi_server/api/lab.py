from fastapi import APIRouter, Depends

from config.dependencies import get_clab_service
from services.clab_api_service import ClabAPIService

lab_router = APIRouter(tags=["labs"])


@lab_router.get("/labs/all")
async def get_all_labs(clab_service: ClabAPIService = Depends(get_clab_service)):
    return clab_service.get_all_labs()
