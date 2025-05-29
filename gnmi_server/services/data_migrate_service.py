import json
from typing import List
import sshtunnel

import paramiko
from fastapi import HTTPException
from pygnmi.client import gNMIclient
from sqlalchemy import text
from sqlmodel import Session, select
from starlette.responses import JSONResponse

from core.database import engine
from core.logging import logger
from core.settings import settings
from models.models import Device, Connection

from services.clab_api_service import ClabAPIService


def create_gnmi_tunnel(api_host: str, ssh_port: int, node_name: str):
    tunnel = sshtunnel.SSHTunnelForwarder(
        (settings.lab_server, ssh_port),
        ssh_username="admin",
        ssh_password="admin",
        remote_bind_address=(node_name, 6030),
        local_bind_address=("127.0.0.1", 57400),
    )
    tunnel.start()
    return tunnel


class DataMigrateService:

    def __init__(self, clab_api_service: ClabAPIService):
        self.clab_api_service = clab_api_service

    @staticmethod
    def migrate_connections_v1(path: str = "~/gnmi_graf_prom/topology.clab.yml"):
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        try:
            ssh.connect(
                settings.lab_server,
                username=settings.ssh_username,
                password=settings.ssh_password,
            )

            command = f"yq '.topology.links[] | {{endpoints}}' {path}"
            stdin, stdout, stderr = ssh.exec_command(command)
            print(stdout.read().decode("utf-8"))
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
                        (
                            item
                            for item in devices
                            if item.short_name == first_device_name
                        ),
                        None,
                    )

                    print(first_device)
                    second_device = next(
                        (
                            item
                            for item in devices
                            if item.short_name == second_device_name
                        ),
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

    async def device_gnmi_test(self):
        try:
            response = await self.clab_api_service.ssh_request()

            target_port = response["port"]

            if not target_port:
                raise HTTPException(status_code=400, detail="Target port not found")

            tunnel = create_gnmi_tunnel(
                api_host=response["host"],
                ssh_port=response["port"],
                node_name="clab-srlceos01-ceos1",
            )

            host = ("127.0.0.1", tunnel.local_bind_address)

            with gNMIclient(
                target=host,
                username=settings.device_username,
                password=settings.device_password,
                insecure=True,
            ) as gc:
                return gc.capabilities()

        except Exception as e:
            logger.error(e)
            return JSONResponse(status_code=400, content={"message": f"Ошибка! {e}"})

    async def migrate_devices_v2(self, lab_name: str):

        try:
            response = await self.clab_api_service.inspect_lab_with_details(lab_name)

            print(response)

            devices: List[Device] = []
            with Session(engine) as session:
                table_names: List[str] = ["device", "connection"]

                for table in table_names:
                    session.exec(text(f"DELETE FROM {table};"))

                for lab_device in response:
                    device = Device()

                    device.short_id = lab_device["ShortID"]
                    device.short_name = lab_device.get("Names")[0].split("-")[-1]
                    device.name = lab_device.get("Names")[0]
                    device.image = lab_device.get("Image")
                    device.state = lab_device.get("State")
                    device.status = lab_device.get("Status")
                    device.type = "network"
                    device.container_ipv4_address = lab_device["NetworkSettings"][
                        "IPv4addr"
                    ]
                    device.container_ipv6_address = lab_device["NetworkSettings"][
                        "IPv6addr"
                    ]
                    device.container_host_port = str(
                        lab_device["Ports"][0]["host_port"]
                    )
                    device.container_port = str(lab_device["Ports"][0]["port"])

                    devices.append(device)

                print(devices)
                session.add_all(devices)

                # self.migrate_connections_v1()

                session.commit()

            return devices

        except HTTPException as http_exception:
            return JSONResponse(status_code=401, content=http_exception.detail)

        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={"message": f"Ошибка запроса! {e}"},
            )

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
                    device.short_name = lab_device.get("Names")[0].split("-")[-1]
                    device.name = lab_device.get("Names")[0]
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

            DataMigrateService.migrate_connections_v1()
            return devices

        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={"message": f"Ошибка запроса! {e}"},
            )

        finally:
            ssh.close()
