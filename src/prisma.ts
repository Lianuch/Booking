import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { logger } from "./utils/log.js";

const connectionString = process.env.DATABASE_URL;

if(!connectionString){
    logger.error("DATABASE_URL is not defined in environment variables.");
    process.exit(1);
}

const adapter = new PrismaPg(connectionString);
export const prisma = new PrismaClient({adapter});