import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { courseService } from "../services/course";

export const courseRouter = Router();

courseRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const course = await courseService.getOne(Number(req.params.id));
    res.send(course);
  } catch (e) {
    let message = "An errour occured";
    if (e instanceof Error) {
      message = e.message;
    }
    res.status(400).send(message);
  }
});

courseRouter.post("/grade", async (req, res) => {
  try {
    if (!req.body.courseId || !req.body.studentId || !req.body.grade)
      throw new Error("Missing parameters");

    await courseService.setGrade(
      Number(req.body.courseId),
      Number(req.body.studentId),
      req.body.grade
    );
    res.send("Grade set successfully");
  } catch (err) {
    let message = "An errour occured";
    if (err instanceof Error) {
      message = err.message;
    }
    res.status(400).send(message);
  }
});

courseRouter.post("/enroll", async (req, res) => {
  try {
    if (!req.body.studentId || !req.body.courseId)
      throw new Error("Missing parameters");

    await courseService.enroll(
      Number(req.body.courseId),
      Number(req.body.studentId)
    );
    res.send("Student enrolled successfully");
  } catch (err) {
    let message = "An errour occured";
    if (err instanceof Error) {
      message = err.message;
    }
    res.status(400).send(message);
  }
});
