from typing import List

from fastapi import FastAPI, HTTPException
from sqlmodel import SQLModel, Field, create_engine, Session, select
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from pygnmi.client import gNMIclient
from api.devices_controller import device_router
from core.config import settings
from core.database import engine
import paramiko
import json

from core.types.container_info import ContainerInfo
from models.Device import Device

origins = [settings.client_url]


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(device_router)


@app.get("/test/")
def test():
    host = (settings.lab_server, 12000)

    with gNMIclient(
        target=host, username="admin", password="admin", insecure=True
    ) as gc:
        result = gc.capabilities()
        return result


@app.get("/test/ssh")
def test_ssh():
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
