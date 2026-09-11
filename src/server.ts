import express from "express"
import "dotenv/config"

import { BookType } from "./types/BookType.js"
import { BookResponseType } from "./types/BookResponseType.js"
import { books } from "./data/books.js"

const cl = console.log;

// перевірка, щоб сервер не впав, якщо в .env файлі не буде PORT або HOST
const PORT = process.env.PORT || 4200;
const HOST = process.env.HOST || "http://localhost";

const app = express() // створення екземпляру express-сервера

const book:BookType = {
    id: 1,
    title: "The Great Gatsby",
    price: 2000,
    isActive: true
}

// req та res мають свої типи даних
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

app.get('/book', (req, res) => {
    res.writeHead(200, {
        "Content-Type": "application/json"
    })
    res.end(JSON.stringify(book));
})

app.get('/books/:id', (req, res) => {
    const id:number = +req.params.id; // +req.params.id - перетворює рядок в число
    const book:BookType | undefined = books.find((book) => book.id === id)

    let status_code:number = 200;
    const response:BookResponseType = {
        data: null,
        error: null,
        status: 200
    }

    if(book === undefined) {
        status_code = 404;
        response.status = status_code;
        response.error = "Book not found";
    }
    else {
        response.data = book;
    }
    
    res.writeHead(status_code, {
        "Content-Type": "application/json"
    })
    res.end(JSON.stringify(response));
})

app.get('/books', (req, res) => {
    res.writeHead(200, {
        "Content-Type": "application/json"
    })
    res.end(JSON.stringify(books));
})

app.listen(PORT, () => {
    cl(`Server ${HOST}:${PORT} has been started...`)
});