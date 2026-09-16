// підключення до бази даних PostgreSQL через бібліотеку pg
// бібліотека pg дозволяє серверу виконувати SQL-запити
import { Pool } from "pg";
import "dotenv/config"

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});