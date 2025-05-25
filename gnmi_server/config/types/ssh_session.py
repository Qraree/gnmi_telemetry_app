from asyncssh import SSHClientConnection

from config.types.clab import SSHRequestResponse


class SSHSession:
    session_id: str
    session: SSHRequestResponse
    connection: SSHClientConnection

    def __init__(
        self,
        session_id: str,
        session: SSHRequestResponse,
        connection: SSHClientConnection,
    ):
        self.session_id = session_id
        self.session = session
        self.connection = connection
