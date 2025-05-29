from typing import TypedDict, List, Dict, Optional


class SSHRequestResponse(TypedDict):
    command: str
    expiration: str
    host: str
    port: str
    username: str


class PortInfo(TypedDict):
    host_ip: str
    host_port: int
    port: int
    protocol: str


class MountInfo(TypedDict):
    Source: str
    Destination: str


class NetworkSettings(TypedDict):
    IPv4addr: str
    IPv4pLen: int
    IPv4Gw: str
    IPv6addr: str
    IPv6pLen: int
    IPv6Gw: str


class ContainerInfo(TypedDict):
    Names: List[str]
    ID: str
    ShortID: str
    Image: str
    State: str
    Status: str
    Labels: Dict[str, str]
    Pid: int
    NetworkName: str
    NetworkSettings: NetworkSettings
    Mounts: List[MountInfo]
    Ports: List[PortInfo]


ContainerList = List[ContainerInfo]
