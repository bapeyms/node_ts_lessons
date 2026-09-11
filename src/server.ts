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

// одна книга за айді
app.get('/books/:id', (req,res)=>{
    const id:number = +req.params.id
    const book:BookType|undefined = books.find((book)=>book.id===id);
    const exist_book:boolean = (book!==undefined)
    const response:BookResponseType = {
        data:exist_book?book as BookType:null,
        error:exist_book?null:"The book not found",
        status:exist_book?200:404
    };

    res.status(response.status).json(response)
})

// створення книжки
app.post('/books',(req,res)=>{
    const new_book:BookType = {
        id: books.length+1,
        title: "New Book",
        price: 100,
        isActive: false
    }

    books.push(new_book)
    const response:BookResponseType = {
        data:new_book,
        error:null,
        status:201
    };

    res.status(response.status).json(response)
})

// видалити одну книгу за айді
app.delete('/books/:id', (req, res) => {
    const id:number = +req.params.id;
    const index:number = books.findIndex((book) => book.id === id);
    let status_code:number = 200;
    const response:BookResponseType = {
        data: null,
        error: null,
        status: 200
    }

    if(index === -1) {
        status_code = 404;
        response.status = status_code;
        response.error = "Book not found";
    }
    else {
        books.splice(index, 1);
        response.data = books[index];
    }
    
    res.writeHead(status_code, {
        "Content-Type": "application/json"
    })
    res.end(JSON.stringify(response));
})

// усі книги
app.get('/books',(req,res)=>{
    const exist_book:boolean = books.length>0
    const response:BookResponseType = {
        data:exist_book?books:null,
        error:exist_book?null:"Books list is empty",
        status:exist_book?200:404
    };

    res.status(response.status).json(response)
})

app.listen(PORT, () => {
    cl(`Server ${HOST}:${PORT} has been started...`)
});