import { Plan } from "@prisma/client";
import { prisma } from "../prisma.js";
import { logger } from "../utils/log.js";
import { AppError } from "../utils/app-error.middleware.js";
import { PlanDto } from "./plan.dto.js";

export class PlanService {
  async getPlans(): Promise<Plan[]> {
    const plans = await prisma.plan.findMany();
    return plans;
  }

  async getPlanById(id: string): Promise<Plan> {
    const plan = await prisma.plan.findUnique({
      where: { id },
    });
    if (!plan) {
      logger.warn(`Plan not found: ${id}`);
      throw AppError.BadRequest("Plan not found");
    }
    return plan;
  }
  async createPlan(data: PlanDto): Promise<Plan> {

    const existingPlan = await prisma.plan.findUnique({ where: { duration: data.duration } });
    if (existingPlan) {
      logger.warn(`Plan already exists: ${data.id}`);
      throw AppError.BadRequest("Plan already exists");
    }

    const plan = await prisma.plan.create({ data });
    return plan;

  }

  async deletePlan(id: string): Promise<Plan> {
    await this.getPlanById(id);
    return await prisma.plan.delete({
      where: { id },
    });
  }

  async updatePlan(id: string, data: PlanDto): Promise<Plan> {
      await this.getPlanById(id);
      const plan = await prisma.plan.update({
        where: { id },
        data
      })
      return plan
  }

}
