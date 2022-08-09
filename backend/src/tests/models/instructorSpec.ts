import client from "../../database";
import { makeInstructorStore } from "../../models";

const instructorModel = makeInstructorStore();

let user: { id: number };

describe("Instructor Model Test Suite", () => {
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

  it("Lists all instructors", async () => {
    //Arrange

    //Act
    const instructors = await instructorModel.index();

    //Assert
    expect(instructors.length).toBeDefined();
  });

  it("Adds a new instructor", async () => {
    // Arrange
    const instructorBody = { id: user.id, name: "Cool Instructor" };
    // Act
    const instructor = await instructorModel.add(instructorBody);
    // Assert

    expect(instructor.id).toBe(user.id);
  });

  it("Fails to add a new instructor if doesn't exist in user", async () => {
    // Arrange
    const instructorBody = { id: 999, name: "Cool Instructor" };
    // Act & Assert
    await expectAsync(instructorModel.add(instructorBody)).toBeRejected();
  });

  it("gets instructor by its id", async () => {
    const instructor = await instructorModel.get(user.id);
    expect(instructor.id).toBe(user.id);
  });

  it("Fails to get instructor if id doesn't exist", async () => {
    await expectAsync(instructorModel.get(999)).toBeRejected();
  });

  it("Updates an instructor", async () => {
    const updatedInstructor = await instructorModel.update({
      id: user.id,
      name: "New name",
    });
    expect(updatedInstructor.name).toBe("New name");
  });

  it("Removes an instructor", async () => {
    await instructorModel.remove(user.id);
  });
});
