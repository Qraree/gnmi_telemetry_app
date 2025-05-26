import asyncio

import asyncssh
from fastapi import APIRouter, WebSocket, Depends
from starlette.websockets import WebSocketDisconnect

from services.clab_api_service import ClabAPIService
from services.ssh_session_service import SSHSessionService

terminal_router = APIRouter(tags=["terminal"])


@terminal_router.websocket("/terminal/ws/{session_id}")
async def terminal(
    session_id: str,
    websocket: WebSocket,
):
    redis = websocket.app.state.redis
    clab_api_service = ClabAPIService(redis)
    ssh_session_service = SSHSessionService(clab_api_service)
    await websocket.accept()

    connection = ssh_session_service.get_connection(session_id)
    if connection is None:
        await websocket.send_text("ERROR: SSH connection not found")
        await websocket.close(code=1008)
        return

    try:
        channel = await connection.create_process(
            "bash",
            term_type="xterm-256color",
        )

        print(channel)

        async def forward_to_client():
            try:
                while True:
                    data = await channel.stdout.read(4096)
                    print(data)
                    if not data:
                        break
                    await websocket.send_bytes(data)
            except asyncssh.ChannelOpenError as e:
                print(f"Channel open error: {e}")
            except asyncssh.SFTPError as e:
                print(f"SFTP error: {e}")
            except Exception as e:
                print(f"Error forwarding to client: {e}")
            finally:
                print("Forward to client task finished.")

        producer = asyncio.create_task(forward_to_client())

        while True:
            text = await websocket.receive_text()
            # data = await web/socket.receive_bytes()
            print(text)
            print(channel)
            if not channel:
                print(
                    f"Attempted to write to a closed/none channel for session_id: {session_id}. Breaking 'forward_from_client'."
                )
                break

            await channel.stdin.write(text)

    except WebSocketDisconnect:
        print("WebSocket disconnected, client input task finished.")
    except Exception as e:
        print(f"Error forwarding from client: {e}")
    finally:
        print("Forward from client task finished.")

        # await ssh_session_service.close_connection(session_id)
