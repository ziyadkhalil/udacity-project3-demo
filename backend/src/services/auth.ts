/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import client from "../database";
import { makeInstructorStore, makeStudentStore } from "../models";

const { PEPPER, SALT_ROUNDS, TOKEN_SECRET } = process.env;

if (!PEPPER || !SALT_ROUNDS || !TOKEN_SECRET)
  throw new Error("Missing environment variables");

type CreateAccountParams = {
  username: string;
  password: string;
  type: "instructor" | "student";
  name: string;
};

const studentModel = makeStudentStore();
const instructorModel = makeInstructorStore();

async function createAccount(params: CreateAccountParams) {
  const hash = await bcrypt.hash(params.password + PEPPER, Number(SALT_ROUNDS));
  const connection = await client.connect();
  try {
    const userResult = await connection.query(
      `
    INSERT INTO "user" (username, password) VALUES ($1, $2) RETURNING id, username;
    `,
      [params.username, hash]
    );

    if (params.type === "instructor") {
      await instructorModel.add({
        name: params.name,
        id: userResult.rows[0].id,
      });
    } else {
      await studentModel.add({ name: params.name, id: userResult.rows[0].id });
    }

    const token = jwt.sign(userResult.rows[0], TOKEN_SECRET!);

    return { token, id: userResult.rows[0].id };
  } finally {
    connection.release();
  }
}

type LoginParams = {
  username: string;
  password: string;
};
async function login(params: LoginParams) {
  const connection = await client.connect();
  const result = await connection.query(
    `
    SELECT * FROM "user" WHERE username = $1;
    `,
    [params.username]
  );
  if (result.rowCount === 0) throw new Error("Wrong username or password");
  const { password: hashed, ...user } = result.rows[0];
  const isValid = await bcrypt.compare(params.password + PEPPER, hashed);

  if (!isValid) throw new Error("Wrong username or password");

  const token = jwt.sign(user, TOKEN_SECRET!);

  return { token, id: user.id };
}

function verify(token: string) {
  return jwt.verify(token, TOKEN_SECRET!);
}

export const authService = {
  createAccount,
  login,
  verify,
};
