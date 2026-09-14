import express, { response } from "express"
import "dotenv/config"

import { BookType } from "./types/BookType.js"
import { BookResponseType } from "./types/BookResponseType.js"
import { books } from "./data/books.js"
import { getBooksByTitle } from "./utilis/showBooks.js"
import {compareBooks} from "./utilis/compareBooks.js"

const cl = console.log;

// перевірка, щоб сервер не впав, якщо в .env файлі не буде PORT або HOST
const PORT = process.env.PORT || 4200;
const HOST = process.env.HOST || "http://localhost";

const app = express() // створення екземпляру express-сервера
// middleware - попередній обробник
app.use(express.json()) // читати з body json

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

// додавання книжок
app.post('/books', (req, res) => {
    const body = req.body;
    let response:BookResponseType = {
        data:null,
        error:null,
        status:500
    };

    // typeof - оперетор, який визначає тип значення та повертає його як рядок
    if (body && typeof body.title === "string" && typeof body.price === "number" && typeof body.isActive === "boolean") {
        const id = books.length > 0 ? books.sort(compareBooks)[0].id+1:1;
        const book:BookType = {
            id,
            title: body.title,
            price: body.price,
            isActive: body.isActive
        }
        books.push()

        response = {
            data:{
                id,
                title: body.title,
                price: body.price,
                isActive: body.isActive
            },
            error:null,
            status: 201 
        }
    }
    else {
        response = {
            data: null,
            error: "Invalid book data",
            status: 400
        }
    }

    res.status(response.status).json(response)
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

// домашнє завдання 11.09.2026
app.get('/books/:title/:isActive', (req, res) => {
    const title:string = req.params.title;
    const isActive:boolean = req.params.isActive === "true";
    // find() - шукає перший елемент, що відповідає умові і повертає сам елемент/underfined
    // filter() - шукає усі елементи, що  відповідають умові та повертає їх у нового масиву
    // includes() - проста перевірка на наявність. повертає або 1, або 0 
    const filteredBooks = books.filter((book) => 
        book.isActive === isActive && book.title.toLowerCase().includes(title.toLowerCase()))

    const existBooks:boolean = filteredBooks.length > 0;

    const response:BookResponseType = {
        data:existBooks ? filteredBooks : null,
        error:existBooks ? null : "Books not found",
        status:existBooks ? 200 : 404
    }
    res.status(response.status).json(response);
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
    const title = req.query.title as string | undefined;

    let our_books:BookType[] | null = null;
    if (title !== undefined) {
        our_books = getBooksByTitle(title, books);
    }

    let response: BookResponseType;

    if (!exist_book) {
        response = {
            data: null,
            error: "Books list is empty",
            status: 404
        };
    }
    else if (title !== undefined && our_books === null) {
        response = {
            data: null,
            error: "Book not found",
            status: 404
        };
    }
    else {
        response = {
            data: title !== undefined ? our_books : books,
            error: null,
            status: 200
        };
    }

    res.status(response.status).json(response)
})

app.listen(PORT, () => {
    cl(`Server ${HOST}:${PORT} has been started...`)
});