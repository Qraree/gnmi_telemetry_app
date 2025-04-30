from sqlmodel import SQLModel, Field
from typing import Optional


class Device(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    short_id: str | None = Field(default=None, nullable=True)
    name: str = Field()
    image: str | None = Field(nullable=True)
    state: str | None = Field(nullable=True)
    status: str | None = Field(nullable=True)
    container_ipv4_address: str | None = Field(nullable=True)
    container_ipv6_address: str | None = Field(nullable=True)
    container_host_port: str | None = Field(nullable=True)
    container_port: str | None = Field(nullable=True)
