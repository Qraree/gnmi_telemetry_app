from typing import Sequence, List

from sqlmodel import Session, select, SQLModel
from starlette.responses import JSONResponse

from config.types.user import UserCreate
from core.database import engine, SessionLocal
from models.models import User
from services.clab_api_service import ClabAPIService


class UserResponse(SQLModel):
    id: int
    name: str
    group: str


class UserService:

    def __init__(self, clab_api_service: ClabAPIService, db: SessionLocal):
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

    async def get_users(self) -> List[UserResponse]:

        result = self.db.execute(select(User))
        users = result.scalars().all()

        return [UserResponse.model_validate(user) for user in users]

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
