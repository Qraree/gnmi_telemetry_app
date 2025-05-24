import json
from typing import List

import paramiko
from sqlalchemy import text
from sqlmodel import Session, select
from starlette.responses import JSONResponse

from core.database import engine
from core.settings import settings
from models.Device import Device, Connection

from services.clab_api_service import ClabAPIService


def migrate_connections_v1():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        ssh.connect(
            settings.lab_server,
            username=settings.ssh_username,
            password=settings.ssh_password,
        )

        command = "cd gnmi_graf_prom/ && yq '.topology.links[] | {endpoints}' ./topology.clab.yml"
        stdin, stdout, stderr = ssh.exec_command(command)
        json_data = stdout.read().decode("utf-8")

        objects = []
        buffer = ""

        for line in json_data.strip().splitlines():
            buffer += line.strip()
            if line.strip() == "}":
                obj = json.loads(buffer)
                objects.append(obj)
                buffer = ""

        connections: List[Connection] = []
        with Session(engine) as session:
            devices = session.exec(select(Device)).all()

            for obj in objects:
                first_device_name = obj["endpoints"][0].split(":")[0]
                first_device_port_name = obj["endpoints"][0].split(":")[1]
                second_device_name = obj["endpoints"][1].split(":")[0]
                second_device_port_name = obj["endpoints"][1].split(":")[1]

                first_device = next(
                    (item for item in devices if item.name == first_device_name),
                    None,
                )
                second_device = next(
                    (item for item in devices if item.name == second_device_name),
                    None,
                )

                connection = Connection()
                connection.device1 = first_device
                connection.device2 = second_device
                connection.port1 = first_device_port_name
                connection.port2 = second_device_port_name
                connections.append(connection)

            session.add_all(connections)
            session.commit()

        return "success"

    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"message": f"Ошибка запроса! {e}"},
        )

    finally:
        ssh.close()


class DataMigrateService:

    def __init__(self, clab_api_service: ClabAPIService):
        self.clab_api_service = clab_api_service

    async def migrate_devices_v2(self):
        try:
            print("get all devices")
            response = await self.clab_api_service.get_all_labs()
            print(response)
        except Exception as e:
            print(e)

    @staticmethod
    def migrate_devices_v1():
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        try:
            ssh.connect(
                settings.lab_server,
                username=settings.ssh_username,
                password=settings.ssh_password,
            )

            command = "cd gnmi_graf_prom/ && containerlab inspect --format json -t topology.clab.yml --details"
            stdin, stdout, stderr = ssh.exec_command(command)
            json_data = stdout.read().decode("utf-8")

            data = json.loads(json_data)

            devices: List[Device] = []
            with Session(engine) as session:
                table_names: List[str] = ["device", "connection"]

                for table in table_names:
                    session.exec(text(f"DELETE FROM {table};"))

                for lab_device in data["srlceos01"]:
                    device = Device()
                    device.short_id = lab_device.get("ShortID")
                    device.name = lab_device.get("Names")[0].split("-")[-1]
                    device.image = lab_device.get("Image")
                    device.state = lab_device.get("State")
                    device.status = lab_device.get("Status")

                    device.container_ipv4_address = lab_device.get(
                        "NetworkSettings"
                    ).get("IPv4addr")
                    device.container_ipv6_address = lab_device.get(
                        "NetworkSettings"
                    ).get("IPv6addr")

                    device.container_host_port = (
                        str(lab_device.get("Ports")[0].get("host_port"))
                        if len(lab_device.get("Ports")) > 0
                        else None
                    )

                    if not device.container_host_port is None:
                        device.type = "network"

                    device.container_port = (
                        str(lab_device.get("Ports")[0].get("port"))
                        if len(lab_device.get("Ports")) > 0
                        else None
                    )

                    devices.append(device)

                session.add_all(devices)
                session.commit()

            return devices

        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={"message": f"Ошибка запроса! {e}"},
            )

        finally:
            ssh.close()
