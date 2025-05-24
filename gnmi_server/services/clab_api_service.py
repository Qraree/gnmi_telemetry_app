import httpx
import requests
from redis import Redis
from starlette.responses import JSONResponse

from config.enum.redis_enum import RedisEnum
from core.settings import settings
from core.logging import logger


class ClabAPIService:

    def __init__(self, redis: Redis):
        self.redis = redis

    host = settings.lab_server
    port = settings.lab_server_port
    base_url = f"http://{host}:{port}"

    async def login(self):
        try:
            headers = {
                "Content-Type": "application/json",
            }

            url = f"{ClabAPIService.base_url}/login"

            payload = {
                "username": settings.ssh_username,
                "password": settings.ssh_password,
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url,
                    headers=headers,
                    json=payload,
                )

            if response.status_code != 200:
                logger.error(response.json())

            success_response_json = response.json()

            await self.redis.set(
                RedisEnum.gnmi_server_token.value, success_response_json["token"]
            )

            return success_response_json

        except Exception as e:
            logger.error(e)
            return JSONResponse(
                status_code=400,
                content={"message": f"Ошибка запроса! {e}"},
            )

    async def ssh_request(self):
        try:
            headers = await ClabAPIService.__get_auth_headers(self)
            body = {"duration": "30m"}

            labName = "srlceos01"
            nodeName = "clab-srlceos01-ceos1"
            url = (
                f"{ClabAPIService.base_url}/api/v1/labs/{labName}/nodes/{nodeName}/ssh"
            )

            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json=body)

            return response.json()

        except Exception as e:
            logger.error(e)
            raise

    async def get_all_labs(self):
        try:
            print("get all labs")

            headers = await ClabAPIService.__get_auth_headers(self)
            url = f"{ClabAPIService.base_url}/api/v1/labs"

            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers)

            return response.json()

        except httpx.TimeoutException:
            logger.error("Запрос к Clab API превысил таймаут")
            return JSONResponse(
                status_code=504,
                content={"message": "Clab API не ответил вовремя"},
            )

        except Exception as e:
            logger.error(e)
            return JSONResponse(
                status_code=400,
                content={"message": f"Ошибка запроса! {e}"},
            )

    async def __get_auth_headers(self):
        try:
            token = await self.redis.get(RedisEnum.gnmi_server_token.value)

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}",
            }

            return headers

        except Exception as e:
            logger.error(e)
            raise
