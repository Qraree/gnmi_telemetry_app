export interface YangBase<T = unknown> {
  notification: [
    {
      timestamp: number;
      prefix: null;
      alias: null;
      atomic: boolean;
      update: {
        path: string;
        val: T;
      }[];
    },
  ];
}

export interface OpenConfigInterface {
  "openconfig-interfaces:interface": OpenConfigInterfaceItem[];
}

export interface OpenConfigInterfaceItem {
  config: { mtu: number; name: string; type: string };
  name: string;
  state: {
    "admin-status": "UP" | "DOWN";
    "openconfig-platform-port:hardware-port": string;
    ifindex: number;
    "last-change": string;
    management: boolean;
    mtu: number;
    name: string;
    "oper-status": "UP" | "DOWN";
    "openconfig-platform-transceiver:transceiver": string;
    type: string;
  };
  subinterfaces: {
    subinterface: OpenConfigInterfaceSubInterface[];
  };
}

export interface OpenConfigInterfaceSubInterface {
  index: number;
  "openconfig-if-ip:ipv4": {
    addresses: {
      address: OpenConfigInterfaceSubInterfaceAddress[];
    };
    neighbors: {
      neighbor: OpenConfigInterfaceSubInterfaceNeighbor[];
    };
    state: {
      enabled: boolean;
    };
  };
  state: {
    ifindex: number;
  };
}

interface OpenConfigInterfaceSubInterfaceAddress {
  config: {
    ip: string;
    "prefix-length": number;
  };
  ip: string;
  state: {
    ip: string;
    origin: string;
    "prefix-length": number;
  };
}

interface OpenConfigInterfaceSubInterfaceNeighbor {
  config: {
    ip: string;
  };
  ip: string;
  state: {
    ip: string;
    "link-layer-address": string;
    origin: string;
  };
}
