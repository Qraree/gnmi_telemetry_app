import json
from typing import List

import paramiko
from fastapi import APIRouter
from pygnmi.client import gNMIclient
from sqlmodel import Session

from core.config import settings
from core.database import engine
from core.types.container_info import ContainerInfo
from models.Device import Device

test_router = APIRouter()


@test_router.get("/test/")
def test():
    host = (settings.lab_server, 12000)

    with gNMIclient(
        target=host, username="admin", password="admin", insecure=True
    ) as gc:
        result = gc.capabilities()
        return result


@test_router.get("/test/connections")
def test():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        ssh.connect(
            settings.lab_server,
            username=settings.ssh_username,
            password=settings.ssh_password,
        )

        command = "cd gnmi_graf_prom/ && yq '.topology.links[] | {endpoints}' ./topology.club.yml"
        stdin, stdout, stderr = ssh.exec_command(command)
        json_data = stdout.read().decode("utf-8")

        data = json.loads(json_data)

        print(data)

        return data

    except Exception as e:
        print(e)

    finally:
        ssh.close()


@test_router.get("/test/ssh")
def migrate_lab_devices():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        ssh.connect(
            settings.lab_server,
            username=settings.ssh_username,
            password=settings.ssh_password,
        )

        command = "cd gnmi_graf_prom/ && containerlab inspect --format json -t topology.club.yml --details"
        stdin, stdout, stderr = ssh.exec_command(command)
        json_data = stdout.read().decode("utf-8")

        data: ContainerInfo = json.loads(json_data)

        devices: List[Device] = []
        with Session(engine) as session:
            for lab_device in data:
                device = Device()
                device.short_id = lab_device.get("ShortID")
                device.name = lab_device.get("Names")[0]
                device.image = lab_device.get("Image")
                device.state = lab_device.get("State")
                device.status = lab_device.get("Status")
                device.container_ipv4_address = lab_device.get("NetworkSettings").get(
                    "IPv4addr"
                )
                device.container_ipv6_address = lab_device.get("NetworkSettings").get(
                    "IPv6addr"
                )

                print(len(lab_device.get("Ports")))
                device.container_host_port = (
                    str(lab_device.get("Ports")[0].get("host_port"))
                    if len(lab_device.get("Ports")) > 0
                    else None
                )
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
        print(e)

    finally:
        ssh.close()
