import { Request, Response, Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { userService } from "../container/index.js";
import { createUserDto } from "../user/create-user.dto.js";
import { validate } from "../middlewares/validate.middleware.js";
import { logger } from "../utils/log.js";
const router = Router();


//register account

router.post("/register", validate(createUserDto), asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await userService.registration(req.body);
    res.cookie("refreshToken", user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.status(201).json(user);
  } catch (e: any) {
   logger.error("Failed to register user",e.message);
  } 
  
  }),
);

//activate account
router.get("/activate/:link", asyncHandler(async (req: Request, res: Response) => {
    const { link } = req.params as { link: string };
    await userService.activate(link);
    return res.redirect(process.env.CLIENT_URL || "http://localhost:5000");
    
}));





export default router;