from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import SQLModel

from config.dependencies import get_clab_service, get_user_service
from config.types.user import UserCreate
from models.models import User
from services.clab_api_service import ClabAPIService
from services.user_service import UserService, UserResponse

auth_router = APIRouter(tags=["auth"])


@auth_router.get("/auth/login")
async def user_login(
    clab_api_service: ClabAPIService = Depends(get_clab_service),
):
    return await clab_api_service.get_health()


@auth_router.get("/auth/register")
async def user_register(
    body: UserCreate,
    user_service: UserService = Depends(get_user_service),
):
    return await user_service.create_user(body)


@auth_router.get("/user/{user_id}")
async def get_user(
    user_id: int,
    user_service: UserService = Depends(get_user_service),
):
    return await user_service.get_user_by_id(user_id)


@auth_router.get("/user/all/", response_model=List[UserResponse])
async def get_users(
    user_service: UserService = Depends(get_user_service),
):
    return await user_service.get_users()


@auth_router.delete("/user/{user_id}")
async def delete_user(
    user_id: int,
    user_service: UserService = Depends(get_user_service),
):
    return await user_service.delete_user_by_id(user_id)
