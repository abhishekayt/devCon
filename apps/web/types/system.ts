export type CPU = {
  model: string;
  cores: number;
  mhz: number;
  usage_percent: number;
};

export type Disk = {
  total_gb: number;
  used_gb: number;
  free_gb: number;
  used_percent: number;
};
export type Memory = {
  total_gb: number;
  used_gb: number;
  used_percent: number;
};
export type Host = {
  hostname: string;
  os: string;
  platform: string;
  version: string;
};

export type SystemStats = {
  cpu: CPU;
  host: Host;
  memory: Memory;
  disk: Disk;
};
