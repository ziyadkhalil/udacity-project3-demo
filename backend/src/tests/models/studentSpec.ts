import client from "../../database";
import { makeStudentStore } from "../../models";

const studentModel = makeStudentStore();

let user: { id: number };

describe("Student Model Test Suite", () => {
  beforeAll(async () => {
    const connection = await client.connect();
    user = (
      await connection.query(
        `INSERT INTO "user" (username, password) VALUES($1,$2) RETURNING id;`,
        ["username12", "password"]
      )
    ).rows[0];
    connection.release();
  });

  it("Lists all students", async () => {
    //Arrange

    //Act
    const students = await studentModel.index();

    //Assert
    expect(students.length).toBeDefined();
  });

  it("Adds a new student", async () => {
    // Arrange
    const studentBody = { id: user.id, name: "Cool Student" };
    // Act
    const student = await studentModel.add(studentBody);
    // Assert

    expect(student.id).toBe(user.id);
  });

  it("Fails to add a new student if doesn't exist in user", async () => {
    // Arrange
    const studentBody = { id: 999, name: "Cool Student" };
    // Act & Assert
    await expectAsync(studentModel.add(studentBody)).toBeRejected();
  });

  it("gets student by its id", async () => {
    const student = await studentModel.get(user.id);
    expect(student.id).toBe(user.id);
  });

  it("Fails to get student if id doesn't exist", async () => {
    await expectAsync(studentModel.get(999)).toBeRejected();
  });

  it("Updates a student", async () => {
    const updatedStudent = await studentModel.update({
      id: user.id,
      name: "New name",
    });
    expect(updatedStudent.name).toBe("New name");
  });

  it("Removes a student", async () => {
    await studentModel.remove(user.id);
  });
});
