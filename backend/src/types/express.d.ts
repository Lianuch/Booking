import { TokenPayload } from "../token/token-payload.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}