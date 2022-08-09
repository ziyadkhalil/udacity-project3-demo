import cors from "cors";
import express, { json, urlencoded } from "express";
import { courseRouter } from "./routes";
import { authRouter } from "./routes/auth";
import { instructorRouter } from "./routes/instructor";
import { studentRouter } from "./routes/student";
export const app = express();

const PORT = process.env.PORT || 3000;

app.use(urlencoded());
app.use(json());
app.use(cors());
app.use("/api/course", courseRouter);
app.use("/api/instructor", instructorRouter);
app.use("/api/student", studentRouter);
app.use("/api/auth", authRouter);

app.get("/", (_, res) => res.json({ data: "Server is 🚀" }));
app.listen(PORT, () => console.log("Server up"));
