import { Request, Response, Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { userService } from "../container/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

//get all users
router.get("/" , authMiddleware, asyncHandler( async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  return res.status(200).json(users);
}));

//get user by id
router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const user = await userService.getUserById(id);
  return res.status(200).json(user);
}))


//delete user by id
router.delete("/:id", asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    await userService.deleteUser(id);

    return res.status(200).json({message: "User deleted"});
}))

//update user by id
router.put("/:id", asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const user = await userService.updateUser(id, req.body);
  return res.status(200).json(user);
}))

export default router;
