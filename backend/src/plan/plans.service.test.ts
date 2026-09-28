import { PlanService } from "./plans.service";
import { prisma } from "../prisma.js";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
vi.mock("../prisma.js", () => ({
  prisma: {
    plan: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const plan = (overrides = {}) => ({
  id: "1",
  name: "Basic",
  description: "Basic plan",
  price: 5,
  duration: "30",
  ...overrides,
});


describe("PlanService", () => {
  let planService: PlanService;
  beforeEach(() => {
    vi.clearAllMocks();
    planService = new PlanService();
  });

  describe("getPlans", () => {
    it("should return a list of plans", async () => {
      const plans = [plan()];
      vi.mocked(prisma.plan.findMany).mockResolvedValue(plans as any);
      const result = await planService.getPlans();
      expect(result).toEqual(plans);
      expect(prisma.plan.findMany).toHaveBeenCalledOnce();
    });
  });

  describe("getPlanById", () => {
    it("should throw an error if the plan is not found", async () => {});

    it("should return a plan by id", async () => {
      const currPlan = plan();

      vi.mocked(prisma.plan.findUnique).mockResolvedValue(currPlan as any);

      const result = await planService.getPlanById("1");

      expect(result).toEqual(currPlan);

      expect(prisma.plan.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });
  });
  describe("create plan", () => {
    it("should throw an error if the plan already exists", async () => {
      const existingPlan = plan();

      vi.mocked(prisma.plan.findUnique).mockResolvedValue(existingPlan as any);

      await expect(planService.createPlan(plan())).rejects.toThrow(
        "Plan already exists",
      );

      expect(prisma.plan.findUnique).toHaveBeenCalledWith({
        where: { duration: "30" },
      });

      expect(prisma.plan.create).not.toHaveBeenCalled();
    });
    it("should create a new plan", async () => {
      const newPlan = plan();

      vi.mocked(prisma.plan.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.plan.create).mockResolvedValue(newPlan as any);

      const result = await planService.createPlan(plan());

      expect(result).toEqual(newPlan);

      expect(prisma.plan.create).toHaveBeenCalledWith({
        data: {
          id: "1",
          name: "Basic",
          description: "Basic plan",
          price: 5,
          duration: "30",
        },
      });
    });
  });
  describe("delete plan", () => {
    it("should delete a plan", async () => {
      const currPlan = plan();
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(currPlan as any);
      vi.mocked(prisma.plan.delete).mockResolvedValue(currPlan as any);
      const result = await planService.deletePlan("1");
      expect(result).toEqual(currPlan);
      expect(prisma.plan.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(prisma.plan.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });
  });
  describe("update plan", () => {
    it("should update a plan", async () => {
      const currPlan = plan();
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(currPlan as any);
      vi.mocked(prisma.plan.update).mockResolvedValue(currPlan as any);
      const result = await planService.updatePlan("1", plan());
      expect(result).toEqual(currPlan);
      expect(prisma.plan.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(prisma.plan.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          id: "1",
          name: "Basic",
          description: "Basic plan",
          price: 5,
          duration: "30",
        },
      });
    });
  });
});
