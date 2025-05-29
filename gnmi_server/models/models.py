import datetime

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List


class Connection(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    device1_id: int = Field(foreign_key="device.id")
    device2_id: int = Field(foreign_key="device.id")
    port1: str
    port2: str
    cable: Optional[str] = None

    device1: Optional["Device"] = Relationship(
        back_populates="connections_as_device1",
        sa_relationship_kwargs={"foreign_keys": "[Connection.device1_id]"},
    )
    device2: Optional["Device"] = Relationship(
        back_populates="connections_as_device2",
        sa_relationship_kwargs={"foreign_keys": "[Connection.device2_id]"},
    )


class Device(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    short_id: str | None = Field(default=None, nullable=True)
    name: str = Field()
    short_name: str | None = Field(nullable=True)
    type: str | None = Field(nullable=True)
    image: str | None = Field(nullable=True)
    state: str | None = Field(nullable=True)
    status: str | None = Field(nullable=True)
    container_ipv4_address: str | None = Field(nullable=True)
    container_ipv6_address: str | None = Field(nullable=True)
    container_host_port: str | None = Field(nullable=True)
    container_port: str | None = Field(nullable=True)

    connections_as_device1: List[Connection] = Relationship(
        back_populates="device1",
        sa_relationship_kwargs={"foreign_keys": "[Connection.device1_id]"},
    )

    connections_as_device2: List[Connection] = Relationship(
        back_populates="device2",
        sa_relationship_kwargs={"foreign_keys": "[Connection.device2_id]"},
    )

    @property
    def connected_devices(self) -> List["Device"]:
        connected = [
            conn.device2 for conn in self.connections_as_device1 if conn.device2
        ]
        connected += [
            conn.device1 for conn in self.connections_as_device2 if conn.device1
        ]
        return connected


class UserRoleLink(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    role_id: int = Field(foreign_key="role.id", primary_key=True)


class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    group: str | None

    labs: List["Lab"] = Relationship(back_populates="user")
    roles: List["Role"] = Relationship(back_populates="users", link_model=UserRoleLink)


class Lab(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    path: str | None
    created: datetime.date
    status: str

    user_id: int = Field(foreign_key="user.id")
    user: Optional["User"] = Relationship(back_populates="labs")


class Role(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    value: str

    users: List["User"] = Relationship(back_populates="roles", link_model=UserRoleLink)
