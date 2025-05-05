from typing import List

from pydantic import BaseModel


class GetYangBody(BaseModel):
    id: int
    path: List[str]
