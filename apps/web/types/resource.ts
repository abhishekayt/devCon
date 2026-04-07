export type ResourceType = "compute" | "postgres" | "redis";

export type ResourceStatus = "CREATED" | "CREATING" | "RUNNING" | "STOPPED" | "EXITED" | "ERROR";

export interface Resource {
  id: string;
  name: string;
  image: string;
  type: ResourceType;
  status: ResourceStatus;
  created_at: number;
  host_ports: string[];
  container_ports: string[];
}

export interface CreateResourcePayload {
  name: string;
  image: string;
  containerPort: string;
  hostPort: string;
  env?: string[];
}
