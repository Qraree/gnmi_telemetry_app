export interface ServerMetrics {
  serverInfo: {
    version: string;
    uptime: string;
    startTime: string;
  };
  metrics: {
    cpu: CPUMetrics;
    mem: MemoryMetrics;
    disk: DiskMetrics;
  };
}

export interface MemoryMetrics {
  totalMem: number;
  usedMem: number;
  availableMem: number;
  usagePercent: number;
  processMemMB: number;
  processMemPct: number;
}

export interface CPUMetrics {
  usagePercent: number;
  numCPU: number;
  loadAvg1: number;
  loadAvg5: number;
  loadAvg15: number;
  processPercent: number;
}

export interface DiskMetrics {
  path: string;
  totalDisk: number;
  usedDisk: number;
  freeDisk: number;
  usagePercent: number;
}
