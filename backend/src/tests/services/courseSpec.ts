import { BaseCourse } from "../../models";
import { courseService } from "../../services";
import { authService } from "../../services/auth";

let i1: { id: number };
let s1: { id: number };
let course: BaseCourse;

describe("Course Service Test Suite", () => {
  beforeAll(async () => {
    i1 = await authService.createAccount({
      name: "History Instructor",
      type: "instructor",
      username: "user123123",
      password: "pasw",
    });
    s1 = await authService.createAccount({
      name: "History Student",
      type: "student",
      username: "us23123",
      password: "pasw",
    });

    course = await courseService.add({ name: "History", instructor_id: i1.id });
  });

  it("Gets a course", async () => {
    const serviceCourse = await courseService.getOne(course.id);

    expect(serviceCourse.id).toBe(course.id);
    expect(serviceCourse.instructor.id).toBe(i1.id);
    expect(serviceCourse.students.length).toBeDefined();
  });

  it("Enrolls to a course", async () => {
    await courseService.enroll(course.id, s1.id);
  });

  it("Sets a student grade", async () => {
    await courseService.setGrade(course.id, s1.id, "B");
  });
});
