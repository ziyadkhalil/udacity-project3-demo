import supertest from "supertest";
import { app } from "../..";
import { authService } from "../../services/auth";

const request = supertest(app);
let student: { id: number };
describe("Student Route Test Suite", () => {
  beforeAll(async () => {
    student = await authService.createAccount({
      username: "user123",
      password: "password",
      type: "student",
      name: "Mr student",
    });
  });
  it("Gets all students", async () => {
    const res = await request.get("/api/student");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeDefined();
  });

  it("Gets an student by id", async () => {
    const res = await request.get(`/api/student/${student.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(student.id);
  });
});
