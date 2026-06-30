import { Request, Response, Router } from "express";
import { createUserDto } from "./create-user.dto.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { userService } from "../container/index.js";
import { logger } from "../utils/log.js";

const router = Router();

router.post("/", validate(createUserDto), asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await userService.registration(req.body);
    res.cookie("refreshToken", user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.status(201).json(user);
  } catch (e: any) {
   logger.error("Failed to register user",e.message);
  } 
  
  }),
);

router.get("/", asyncHandler( async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  return res.status(200).json(users);
}));


router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const user = await userService.getUserById(id);
  return res.status(200).json(user);
}))

router.delete("/:id", asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    await userService.deleteUser(id);

    return res.status(200).json({message: "User deleted"});
}))

router.put("/:id", asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const user = await userService.updateUser(id, req.body);
  return res.status(200).json(user);
}))

export default router;
