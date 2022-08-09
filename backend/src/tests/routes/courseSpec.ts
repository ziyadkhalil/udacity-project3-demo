import supertest from "supertest";
import { app } from "../..";
import { BaseCourse } from "../../models";
import { courseService } from "../../services";
import { authService } from "../../services/auth";

const request = supertest(app);
let course: BaseCourse;
let instructor: { id: number; token: string };
let student: { id: number; token: string };

describe("Course Route Test Suite", () => {
  beforeAll(async () => {
    instructor = await authService.createAccount({
      name: "Cool Instructor",
      type: "instructor",
      username: "username12",
      password: "password",
    });

    student = await authService.createAccount({
      name: "Cool student",
      type: "student",
      username: "student123",
      password: "password",
    });

    course = await courseService.add({
      name: "Maths",
      instructor_id: instructor.id,
    });
  });

  it("Gets a course by id", async () => {
    const res = await request
      .get(`/api/course/${course.id}`)
      .set("Authorization", `Bearer ${instructor.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(course.id);
    expect(res.body.name).toBe(course.name);
  });

  it("Enrolls a student to a course", async () => {
    const res = await request
      .post("/api/course/enroll")
      .send({ studentId: student.id, courseId: course.id });
    expect(res.statusCode).toBe(200);
  });

  it("Sets a grade to a student", async () => {
    const res = await request
      .post("/api/course/grade")
      .send({ courseId: course.id, studentId: student.id, grade: "C" });

    expect(res.statusCode).toBe(200);
  });
});
