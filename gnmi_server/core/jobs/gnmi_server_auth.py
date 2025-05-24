from redis import Redis

from core.logging import logger
from core.settings import settings
from services.clab_api_service import ClabAPIService


# Джоба для обновления токена для взаимодействия с gnmi сервером
async def token_update_job():
    try:
        redis = Redis.from_url(settings.redis_url)
        service = ClabAPIService(redis)
        result = await service.login()
        logger.info(f"Token updated: {result}")

        await redis.close()
    except Exception as e:
        logger.error(f"Failed to update token: {e}")
