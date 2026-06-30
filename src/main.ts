import "dotenv/config";
import { logger } from "./utils/log.js";
import { prisma } from "./prisma.js";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./user/user.controller.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors());

    app.use("/api/user", userRouter);
    app.get("/", (req: Request, res: Response, next: NextFunction) => {
      res.send("Backend is running");
    });
    // app.all("/*", (req: Request, res: Response) => {
    //     res.status(404).json({message: "Route not found"});
    // })

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
