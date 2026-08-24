import "dotenv/config";
import { logger } from "./utils/log.js";
import { prisma } from "./prisma.js";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./user/user.controller.js";
import authRouter from "./auth/auth.controller.js";
import planRouter from "./plan/plan.controller.js";
import googleAuthRouter from "./google/google.auth.controller.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;


async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");

    app.use(cors({
      origin: process.env.CLIENT_URL,
      credentials: true
    }));
    
    app.use(express.json());
    app.use(cookieParser());

    app.use("/api/auth/google", googleAuthRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/user", userRouter);
    app.use("/api/plan", planRouter);

   
    app.get("/", (req: Request, res: Response) => {
      res.send("Backend is running");
    });
   

    app.use(errorMiddleware);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
  } catch (error) {
    logger.error("Error starting the server: ", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
