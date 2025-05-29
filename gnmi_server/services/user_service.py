from typing import Sequence

from sqlmodel import Session, select
from starlette.responses import JSONResponse

from config.types.user import UserCreate
from core.database import engine
from models.models import User
from services.clab_api_service import ClabAPIService


class UserService:

    def __init__(self, clab_api_service: ClabAPIService, db: Session):
        self.clab_api_service = clab_api_service
        self.db = db

    async def create_user(self, body: UserCreate):
        with Session(engine) as session:
            user = User()
            user.name = body["name"]
            user.group = body["group"]

            session.add(user)
            session.commit()

            return user

    async def get_user_by_id(self, user_id: int):
        with Session(engine) as session:
            user = session.get(User, user_id)

            if user is None:
                return JSONResponse(
                    status_code=404, content={"message": "User not found"}
                )

            return user

    async def get_users(self) -> Sequence[User]:
        users = self.db.exec(select(User)).all()
        return users

    async def delete_user_by_id(self, user_id: int):
        with Session(engine) as session:
            user = session.get(User, user_id)

            if user is None:
                return JSONResponse(
                    status_code=404, content={"message": "User not found"}
                )

            session.delete(user)
            session.commit()
            return JSONResponse(status_code=200, content={"message": "User deleted"})
