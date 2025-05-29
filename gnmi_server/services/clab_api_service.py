import httpx
from fastapi import HTTPException
from httpx import Response
from redis import Redis
from starlette.responses import JSONResponse

from config.enum.redis_enum import RedisEnum
from config.types.clab import SSHRequestResponse, ContainerList
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

    async def ssh_request(
        self, node_name="clab-srlceos01-ceos1", duration="30m", lab_name="srlceos01"
    ) -> SSHRequestResponse:
        try:
            headers = await ClabAPIService.__get_auth_headers(self)
            body = {"duration": duration}

            url = f"{ClabAPIService.base_url}/api/v1/labs/{lab_name}/nodes/{node_name}/ssh"

            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json=body)

            return ClabAPIService.response_validator(response)

        except HTTPException as http_exception:
            raise http_exception

        except Exception as e:
            logger.error(e)
            raise

    async def get_logs(
        self,
        node_name: str,
        lines: int = 20,
        lab_name: str = "srlceos01",
    ):
        try:
            headers = await ClabAPIService.__get_auth_headers(self)
            params = {
                "tail": f"{lines}",
            }

            url = f"{ClabAPIService.base_url}/api/v1/labs/{lab_name}/nodes/{node_name}/logs"

            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers, params=params)

                response.raise_for_status()

                logger.debug(f"Raw response: {response.text}")

            ClabAPIService.response_validator(response)

            return response.text

        except HTTPException as http_exception:
            return JSONResponse(
                status_code=400,
                content=http_exception.detail,
            )

        except Exception as e:
            logger.error(e)

    async def inspect_lab_with_details(self, lab_name: str) -> ContainerList:
        try:
            headers = await ClabAPIService.__get_auth_headers(self)
            url = f"{ClabAPIService.base_url}/api/v1/labs/{lab_name}?details=true"

            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers)

            return ClabAPIService.response_validator(response)

        except HTTPException as http_exception:
            raise http_exception

        except Exception as e:
            logger.error(e)

    async def get_all_labs(self):
        try:

            headers = await ClabAPIService.__get_auth_headers(self)
            url = f"{ClabAPIService.base_url}/api/v1/labs"

            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers)

            return ClabAPIService.response_validator(response)

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

    async def get_health(self):
        try:

            headers = await ClabAPIService.__get_auth_headers(self)
            url = f"{ClabAPIService.base_url}/api/v1/health/metrics"

            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers)

            return ClabAPIService.response_validator(response)

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

    @staticmethod
    def response_validator(response: Response):
        response_json = response.json()

        if (
            response.status_code == 401
            and response_json["error"] == "Invalid or expired token"
        ):
            raise HTTPException(401, {"message": f"Invalid or expired token"})

        return response_json
