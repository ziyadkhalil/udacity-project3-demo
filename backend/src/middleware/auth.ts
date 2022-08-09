import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new Error("Invalid token");

    const user = authService.verify(token);
    res.locals.user = user;
    next();
  } catch (e) {
    res.status(401).send("Unauthorized");
  }
}
