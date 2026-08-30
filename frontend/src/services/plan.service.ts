import { type AxiosResponse } from "axios";
import type { IPlan } from "../models/response/IPlan";
import $api from "../http";

export class PlanService {
  static async createPlan( duration: string, price: number, description: string): Promise<AxiosResponse<IPlan>> {
    return $api.post("/plan", { duration, price, description,  });
  }

  static async updatePlan(id: string, duration: string, price: number, description: string): Promise<AxiosResponse<IPlan>> {
    return $api.put(`/plan/${id}`, { duration, price, description,  });
  }

  static async deletePlan(id: string): Promise<AxiosResponse<IPlan>> {
    return $api.delete(`/plan/${id}`);
  }
  static async getPlanById(id: string): Promise<AxiosResponse<IPlan>> {
    return $api.get(`/plan/${id}`);
  }
  static async getPlans(): Promise<AxiosResponse<IPlan[]>> {
    return $api.get("/plan");
  }

}
