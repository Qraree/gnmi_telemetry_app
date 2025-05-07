from typing import List

from pydantic import BaseModel


class GetYangBody(BaseModel):
    id: int
    path: List[str]

class SetInterfaceState(BaseModel):
    state: bool
    name: str
    device_id: int