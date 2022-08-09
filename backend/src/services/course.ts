import client from "../database";
import { BaseCourse, makeCourseStore } from "../models";

type Course = Omit<BaseCourse, "instructor_id"> & {
  instructor: { id: number; name: string };
  students: { id: number; name: string; grade: string }[];
};

const courseModel = makeCourseStore();

async function getOne(courseId: number): Promise<Course> {
  const connection = await client.connect();
  try {
    const result = await connection.query(
      `
        SELECT course.id, course.name,
        instructor.name as "instructorName",
        instructor.id as "instructorId",
        course_student.grade,
        student.name as "studentName",
        student.id as "studentId"
        FROM course INNER JOIN instructor ON course.instructor_id = instructor.id
        LEFT OUTER JOIN course_student ON course.id = course_student.course_id
        LEFT OUTER JOIN student ON student.id = course_student.student_id
        WHERE course.id = $1;
    `,
      [courseId]
    );

    if (result.rowCount === 0) throw new Error(`Course ${courseId} not found`);

    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      instructor: {
        id: result.rows[0].instructorId,
        name: result.rows[0].instructorName,
      },
      students: result.rows.map((row) => ({
        id: row.studentId,
        name: row.studentName,
        grade: row.grade,
      })),
    };
  } finally {
    connection.release();
  }
}

async function enroll(courseId: number, studentId: number): Promise<void> {
  const connection = await client.connect();
  try {
    await connection.query(
      "INSERT INTO course_student (student_id, course_id) VALUES($1, $2);",
      [studentId, courseId]
    );
  } catch (e) {
    console.error(e);
    throw new Error("Failed to enroll to course");
  } finally {
    connection.release();
  }
}

async function setGrade(
  courseId: number,
  studentId: number,
  grade: string
): Promise<void> {
  const connection = await client.connect();
  try {
    await connection.query(
      "UPDATE course_student SET grade = $1 WHERE course_id = $2 AND student_id = $3;",
      [grade, courseId, studentId]
    );
  } catch (e) {
    console.error(e);
    throw new Error("Failed to set grade");
  } finally {
    connection.release();
  }
}

export const courseService = {
  getOne,
  enroll,
  setGrade,
  add: courseModel.add,
  remove: courseModel.remove,
  update: courseModel.update,
};
