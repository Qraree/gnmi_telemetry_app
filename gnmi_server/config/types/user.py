from typing import TypedDict


class UserCreate(TypedDict):
    name: str
    group: str | None
