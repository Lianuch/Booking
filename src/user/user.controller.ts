import { Request, Response, Router } from "express";
import { UserService } from "./user.service.js";
import { createUserDto } from "./create-user.dto.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();
const userService = new UserService();

router.post(
  "/",
  validate(createUserDto),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
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
