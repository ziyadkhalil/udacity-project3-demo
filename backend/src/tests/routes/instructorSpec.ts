import supertest from "supertest";
import { app } from "../..";
import { authService } from "../../services/auth";

const request = supertest(app);
let instructor: { id: number };
describe("Instructor Route Test Suite", () => {
  beforeAll(async () => {
    instructor = await authService.createAccount({
      username: "user123",
      password: "password",
      type: "instructor",
      name: "Mr instructor",
    });
  });
  it("Gets all instructors", async () => {
    const res = await request.get("/api/instructor");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeDefined();
  });

  it("Gets an instructor by id", async () => {
    const res = await request.get(`/api/instructor/${instructor.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(instructor.id);
  });
});
