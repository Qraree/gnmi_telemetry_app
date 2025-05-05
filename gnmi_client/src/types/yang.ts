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
  state: { "admin-status": string };
}
