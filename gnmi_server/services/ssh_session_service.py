import uuid
from typing import Dict

import asyncssh
from asyncssh import SSHClientConnection, SSHClientConnectionOptions
from asyncssh.misc import _ACMWrapper

from core.settings import settings
from services.clab_api_service import ClabAPIService


class SSHSessionService:
    sessions: Dict[str, _ACMWrapper[SSHClientConnection]] = {}

    def __init__(self, clab_api_service: ClabAPIService):
        self.clab_api_service = clab_api_service

        self.sessions: Dict[str, _ACMWrapper[SSHClientConnection]] = {}

    async def create_clab_session(
        self, node_name: str, lab_name: str = "srlceos01"
    ) -> str | None:
        try:

            session_id = f"{lab_name}-{node_name}-{uuid.uuid4()}"
            clab_ssh_session = await self.clab_api_service.ssh_request(node_name, "1m")

            options = SSHClientConnectionOptions(
                username=settings.device_username,
                password=settings.device_password,
                known_hosts=None,
            )

            ssh_connection = await asyncssh.connect(
                host=settings.lab_server,
                port=clab_ssh_session["port"],
                options=options,
            )

            SSHSessionService.sessions[session_id] = ssh_connection

            return session_id

        except Exception as e:
            print(e)

    def get_connection(self, session_id: str):
        print("SessionId2", session_id)
        if session_id not in SSHSessionService.sessions:
            raise KeyError(f"SSH session {session_id} not founds")

        return SSHSessionService.sessions[session_id]

    def close_connection(self, session_id: str):
        connection = self.sessions.pop(session_id)
        connection.close()
