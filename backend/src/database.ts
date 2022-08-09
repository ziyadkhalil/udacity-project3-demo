import { Pool } from "pg";

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  ENV,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = process.env;

console.log(ENV);

if (!ENV || !["dev", "test"].includes(ENV))
  throw new Error("Missing env variable");

const client = new Pool({
  host: POSTGRES_HOST,
  database: ENV === "dev" ? POSTGRES_DB : POSTGRES_TEST_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
});

export default client;
