import express from "express"
import {bookRouter} from "./routes/bookRoutes.js"
import { authorsRouter } from "./routes/authorsRoutes.js";
import "dotenv/config"

const cl = console.log;

// перевірка, щоб сервер не впав, якщо в .env файлі не буде PORT або HOST
const PORT = process.env.PORT || 4200;
const HOST = process.env.HOST || "http://localhost";

const app = express() // створення екземпляру express-сервера
// middleware - попередній обробник
app.use(express.json()) // читати з body json

app.get('/', (req, res) => {
    res.writeHead(200, {
        // text/plain - для простого тексту
        // text/html - для html
        "Content-Type": "text/html"
    })
    // для просто тексту - метод send
    // для html - метод end
    res.end("<h1>Hello from express server!</h1>");
})

app.use('/books', bookRouter);
app.use('/authors', authorsRouter);

app.listen(PORT, () => {
    cl(`Server ${HOST}:${PORT} has been started...`)
});