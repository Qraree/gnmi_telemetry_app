export interface OpenConfigSystem {
  "openconfig-system:aaa"?: OpenConfigAaa;
  "openconfig-system:clock"?: Clock;
  "openconfig-system:config"?: SystemConfig;
  "gnsi-credentialz:console"?: GNSIConsole;
  "openconfig-system-controlplane:control-plane-traffic"?: ControlPlaneTraffic;
  "arista-system-augments:fhrp"?: Record<string, never>;
  "openconfig-system-grpc:grpc-servers"?: GrpcServers;
  "openconfig-system:logging"?: Logging;
  "openconfig-system:mac-address"?: MacAddress;
  "openconfig-system:ssh-server"?: SshServer;
  "openconfig-system:state"?: SystemState;
}

export interface OpenConfigAaa {
  authentication: {
    "admin-user": {
      config: {
        "arista-system-augments:password-mode": string;
      };
      state: {
        "gnsi-credentialz:authorized-keys-list-created-on": string;
        "gnsi-credentialz:authorized-keys-list-version": string;
        "gnsi-credentialz:authorized-principals-list-created-on": string;
        "gnsi-credentialz:authorized-principals-list-version": string;
        "gnsi-credentialz:password-created-on": string;
        "arista-system-augments:password-mode": string;
        "gnsi-credentialz:password-version": string;
      };
    };
    config: {
      "authentication-method": string[];
    };
    state: {
      "authentication-method": string[];
    };
    users: {
      user: AaaUser[];
    };
  };
  authorization: {
    state: {
      "gnsi-authz:grpc-authz-policy-created-on": string;
      "gnsi-authz:grpc-authz-policy-version": string;
    };
  };
}

export interface AaaUser {
  username: string;
  config: {
    "password-hashed": string;
    "arista-system-augments:password-mode": string;
    role: string;
    username: string;
  };
  state: {
    "gnsi-credentialz:authorized-keys-list-created-on": string;
    "gnsi-credentialz:authorized-keys-list-version": string;
    "gnsi-credentialz:authorized-principals-list-created-on": string;
    "gnsi-credentialz:authorized-principals-list-version": string;
    "gnsi-credentialz:password-created-on": string;
    "password-hashed": string;
    "arista-system-augments:password-mode": string;
    "gnsi-credentialz:password-version": string;
    role: string;
    username: string;
  };
}

export interface Clock {
  config: {
    "timezone-name": string;
  };
}

export interface SystemConfig {
  hostname: string;
}

export interface GNSIConsole {
  state: {
    counters: {
      "access-accepts": string;
      "access-rejects": string;
      "last-access-accept": string;
      "last-access-reject": string;
    };
  };
}

export interface ControlPlaneTraffic {
  ingress: {
    acl: Record<string, unknown>;
  };
}

export interface GrpcServers {
  "grpc-server": GrpcServer[];
}

export interface GrpcServer {
  name: string;
  config: GrpcServerConfig;
  state: GrpcServerState;
  "gnsi-authz:authz-policy-counters": {
    rpcs: {
      rpc: RpcEntry[];
    };
  };
}

export interface RpcEntry {
  name: string;
  state: {
    "access-accepts": string;
    "access-rejects": string;
    "last-access-accept": string;
    "last-access-reject": string;
    name: string;
  };
}

export interface GrpcServerConfig {
  enable: boolean;
  "metadata-authentication": boolean;
  name: string;
  "network-instance": string;
  port: number;
  "transport-security": boolean;
}

export interface GrpcServerState extends GrpcServerConfig {
  "gnsi-certz:authentication-policy-created-on": string;
  "gnsi-certz:authentication-policy-version": string;
  "gnsi-certz:ca-trust-bundle-created-on": string;
  "gnsi-certz:ca-trust-bundle-version": string;
  "gnsi-certz:certificate-created-on": string;
  "gnsi-certz:certificate-revocation-list-bundle-created-on": string;
  "gnsi-certz:certificate-revocation-list-bundle-version": string;
  "gnsi-certz:certificate-version": string;
  "gnsi-certz:counters": {
    "connection-accepts": string;
    "connection-rejects": string;
    "last-connection-accept": string;
    "last-connection-reject": string;
  };
  "gnsi-certz:ssl-profile-id": string;
}

export interface Logging {
  console: {
    selectors: {
      selector: LoggingSelector[];
    };
  };
}

export interface LoggingSelector {
  config: LoggingFacilitySeverity;
  facility: string;
  severity: string;
  state: LoggingFacilitySeverity;
}

export interface LoggingFacilitySeverity {
  facility: string;
  severity: string;
}

export interface MacAddress {
  config: {
    "routing-mac": string;
  };
  state: {
    "routing-mac": string;
    "arista-system-augments:system-mac": string;
  };
}

export interface SshServer {
  config: {
    "session-limit": number;
    timeout: number;
  };
  state: {
    "gnsi-credentialz:active-host-certificate-created-on": string;
    "gnsi-credentialz:active-host-certificate-version": string;
    "gnsi-credentialz:active-host-key-created-on": string;
    "gnsi-credentialz:active-host-key-version": string;
    "gnsi-credentialz:active-trusted-user-ca-keys-created-on": string;
    "gnsi-credentialz:active-trusted-user-ca-keys-version": string;
    "gnsi-credentialz:counters": {
      "access-accepts": string;
      "access-rejects": string;
      "last-access-accept": string;
      "last-access-reject": string;
    };
    "session-limit": number;
    timeout: number;
  };
}

export interface SystemState {
  "boot-time": string;
  "current-datetime": string;
  hostname: string;
  "last-configuration-timestamp": string;
  "software-version": string;
}
