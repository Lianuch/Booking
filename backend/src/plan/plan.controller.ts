import { Request, Response, Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { PlanService } from "./plans.service.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const planService = new PlanService(); 

router.get("/", asyncHandler(async (req: Request, res: Response) => {
    const plans = await planService.getPlans();
    return res.status(200).json(plans);
}));

router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const plan = await planService.getPlanById(id);
    return res.status(200).json(plan);
}));

router.post("/", authMiddleware, requireRole("ADMIN"), asyncHandler(async (req: Request, res: Response) => {
    const plan = await planService.createPlan(req.body);
    return res.status(201).json(plan);
}));

router.delete("/:id", authMiddleware, requireRole("ADMIN"), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const plan = await planService.deletePlan(id);
    return res.status(200).json(plan);
}));

router.put("/:id", authMiddleware, requireRole("ADMIN"), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const plan = await planService.updatePlan(id, req.body);
    return res.status(200).json(plan);
}))

export default router;