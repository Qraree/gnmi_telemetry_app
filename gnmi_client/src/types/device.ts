export interface Device {
  id: number;
  container_host_port: string;
  container_ipv4_address: string;
  container_ipv6_address: string;
  container_port: string;
  image: string;
  name: string;
  short_id: string;
  state: string;
  status: string;
  type: string;
}

export interface Connection {
  id: number;
  device1_id: number;
  device2_id: number;
  port1: string;
  port2: string;
  cable: string | null;
}

export type VisEdge = {
  id: string;
  from: string | number;
  to: string | number;
  label?: string;
  title?: string;
  length?: number;
  fromPort?: string;
  toPort?: string;
  fromDeviceName?: string;
  toDeviceName?: string;
};

export type DeviceStatus = "Online" | "Offline";
