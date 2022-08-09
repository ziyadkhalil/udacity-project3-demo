import { BaseCourse, makeCourseStore } from "../../models";
import { authService } from "../../services/auth";

const courseModel = makeCourseStore();
let instructor: { id: number };
let course: BaseCourse;

describe("Course Model Test Suite", () => {
  beforeAll(async () => {
    instructor = await authService.createAccount({
      name: "Mr Instructor",
      username: "user123",
      password: "password123",
      type: "instructor",
    });
  });

  it("Lists all courses", async () => {
    //Arrange

    //Act
    const courses = await courseModel.index();

    //Assert
    expect(courses.length).toBeDefined();
  });

  it("Adds a new course", async () => {
    // Arrange
    const courseBody = { name: "Maths", instructor_id: instructor.id };
    // Act
    course = await courseModel.add(courseBody);

    // Assert

    expect(course.name).toBe(courseBody.name);
  });

  it("Fails to add a new course if instructor does not exist", async () => {
    // Arrange
    const courseBody = { name: "Maths", instructor_id: 999 };
    // Act
    await expectAsync(courseModel.add(courseBody)).toBeRejected();
  });

  it("gets course by its id", async () => {
    const getCourse = await courseModel.get(course.id);
    expect(getCourse.id).toBe(course.id);
  });

  it("Fails to get course if id doesn't exist", async () => {
    await expectAsync(courseModel.get(999)).toBeRejected();
  });

  it("Updates a course", async () => {
    const updateCourse = await courseModel.update({
      id: course.id,
      name: "New name",
    });
    expect(updateCourse.name).toBe("New name");
  });

  it("Removes a course", async () => {
    await courseModel.remove(course.id);
  });
});
