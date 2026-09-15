// підключення до бази даних PostgreSQL через бібліотеку pg
// бібліотека pg дозволяє серверу виконувати SQL-запити
import { Pool } from "pg";
export const pool = new Pool({
    host:"localhost",
    port:5432,
    user: "bapeyms",
    password: "123456",
    database: "library"
});