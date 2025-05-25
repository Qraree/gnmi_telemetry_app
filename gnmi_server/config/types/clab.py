from typing import TypedDict


class SSHRequestResponse(TypedDict):
    command: str
    expiration: str
    host: str
    port: str
    username: str
