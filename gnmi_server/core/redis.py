import redis.asyncio as redis
from fastapi import Request, FastAPI, Depends

from core.logging import logger
from core.settings import settings


async def init_redis(app: FastAPI):
    try:
        redis_client = redis.from_url(settings.redis_url, decode_responses=True)
        app.state.redis = redis_client
    except Exception as e:
        logger.error(e)

async def close_redis(app: FastAPI):
    await app.state.redis.close()

def get_ioredis_client(request: Request):
    return request.app.state.redis