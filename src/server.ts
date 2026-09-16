import express from "express"
import { Request } from "express";

import {bookRouter} from "./routes/bookRoutes.js"
import { authorsRouter } from "./routes/authorsRoutes.js";
import "dotenv/config"
import ejs from "ejs"
import path from "node:path"
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cl = console.log;

// перевірка, щоб сервер не впав, якщо в .env файлі не буде PORT або HOST
const PORT = process.env.PORT || 4200;
const HOST = process.env.HOST || "http://localhost";

const app = express() // створення екземпляру express-сервера
// middleware - попередній обробник
app.use(express.json()) // читати з body json
app.use(express.static("public")) // підключення статичних файлів до серверу

// для динамічного рендерингу за допомогою шаблонізатора EJS 
app.set("views", path.join(__dirname, "..", path.sep, "views")); // вказує абсолютний шлях до папки, де зберігаються всі файли із шаблонів ejs
app.set("view engine", "ejs"); // вказується, який шаблонізатор використовується за замовчуванням


app.get('/', (req:Request<null, null, null, {value: string}>, res) => {
    // за допомогою команди app.set("view engine", "ejs") express автоматично розуміє, що треба шукати файл з розширенням
    res.render("pages/home", {
        value: req.query.value
    });
})

// app.get('/', (req, res) => {
//     res.writeHead(200, {
//         // text/plain - для простого тексту
//         // text/html - для html
//         "Content-Type": "text/html"
//     })
//     // для просто тексту - метод send
//     // для html - метод end
//     res.end("<h1>Hello from express server!</h1>");
// })

app.use('/books', bookRouter);
app.use('/authors', authorsRouter);

app.listen(PORT, () => {
    cl(`Server ${HOST}:${PORT} has been started...`)
});