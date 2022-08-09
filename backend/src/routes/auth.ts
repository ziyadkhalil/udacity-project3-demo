import { Router } from "express";
import { authService } from "../services/auth";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const params = req.body as {
      username: string;
      password: string;
      type: "instructor" | "student";
      name: string;
    };
    const userInfo = await authService.createAccount({
      username: params.username,
      password: params.password,
      name: params.name,
      type: params.type,
    });

    res.json(userInfo);
  } catch (e) {
    console.error(e);
    res.status(404).send("Failed to create an account");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const params = req.body as {
      username: string;
      password: string;
    };

    const userInfo = await authService.login({
      username: params.username,
      password: params.password,
    });

    res.json(userInfo);
  } catch (e) {
    console.error(e);
    res.status(404).send("Failed to login");
  }
});
