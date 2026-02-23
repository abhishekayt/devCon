import { AxiosResponse } from "axios";
import { api } from "../api";
import { SystemStats } from "@/types/system";

interface ISystemService {
  getSystemStats: () => Promise<AxiosResponse<{ stats: SystemStats }>>;
}

const SERVICE_ENDPOINTS = {
  SYSTEM: () => "/stats",
};

export const system_service: ISystemService = {
  getSystemStats: async () => {
    return api.get<{ stats: SystemStats }>(SERVICE_ENDPOINTS.SYSTEM());
  },
};
