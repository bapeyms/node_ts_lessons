// підключення до бази даних
import { Pool } from "pg";
export const pool = new Pool({
    host:"localhost",
    port:5432,
    user: "bapeyms",
    password: "123456",
    database: "library"
});