from typing import List

from pydantic import BaseModel


class GetYangBody(BaseModel):
    id: int
    path: List[str]

class SetInterfaceState(BaseModel):
    state: bool
    name: str
    device_id: int


class SetInterfaceIp(BaseModel):
    device_id: int
    ip: str
    prefix_length: int
    interface_name: str
    index: int
