from typing import TypedDict, List, Dict, Optional


class NetworkSettings(TypedDict):
    IPv4addr: str
    IPv4pLen: int
    IPv4Gw: str
    IPv6addr: str
    IPv6pLen: int
    IPv6Gw: str


class Mount(TypedDict):
    Source: str
    Destination: str


class Port(TypedDict):
    host_ip: str
    host_port: int
    port: int
    protocol: str


class ContainerInfo(TypedDict):
    Names: List[str]
    ID: str
    ShortID: str
    Image: str
    State: str
    Status: str
    Labels: Dict[str, str]
    Pid: int
    NetworkSettings: NetworkSettings
    Mounts: List[Mount]
    Ports: List[Port]


class ContainerInfoV2(TypedDict):
    name: str
    container_id: str
    image: str
    kind: str
    state: str
    status: str
    ipv4_address: str
    ipv6_address: str
    lab_name: str
    labPath: str
    absLabPath: str
    group: str
    owner: str


ContainerMap = Dict[str, List[ContainerInfoV2]]
