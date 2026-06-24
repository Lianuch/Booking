import "dotenv/config";
import { logger } from './utils/log.js';
import { prisma } from './prisma.js';
import express, { NextFunction, Request, Response } from "express";
import cors from 'cors';

import userRouter from "./user/user.controller.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;


async function main(){
    app.use(express.json());
    app.use(cors());

    app.all("/*", (req: Request, res: Response) => {
        res.status(404).json({message: "Route not found"});
    })
    app.use("/api/user", userRouter )

    app.use(errorMiddleware);
    app.get("/", (req: Request, res: Response, next: NextFunction) => {
        res.send("Backend is running");
    });
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`)
    })
}


main()
    .then( async ()=> {
        await prisma.$connect();
        console.log("Connected to the database successfully.");
    }).
    catch( async (error) => {
        logger.error("Error starting the server: ", error);
        await prisma.$disconnect();
        process.exit(1);
    })