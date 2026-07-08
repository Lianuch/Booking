import { NextFunction, Request, Response, Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { userService } from "../container/index.js";
import { createUserDto } from "../user/create-user.dto.js";
import { validate } from "../middlewares/validate.middleware.js";
import { logger } from "../utils/log.js";
const router = Router();


//register account

router.post("/register", validate(createUserDto), asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.registration(req.body);
    res.cookie("refreshToken", user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.status(201).json(user);
  } 
));

//activate account
router.get("/activate/:link", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { link } = req.params as { link: string };
    await userService.activate(link);
    return res.redirect(process.env.CLIENT_URL || "http://localhost:5000");
    
}));



router.post("/login", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body;
  const userData = await userService.login(email, password); 

  res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

  return res.status(200).json(userData);
}))

router.post("/logout", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;
  const token = await userService.logout(refreshToken);
  res.clearCookie("refreshToken");
  return res.status(200).json(token);
}))
export default router;