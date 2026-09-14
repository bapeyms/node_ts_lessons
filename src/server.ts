import express, { response, Request } from "express"
import "dotenv/config"

import { BookType, BookCreateType } from "./types/BookType.js"
import { AuthorsType, AuthorCreateType } from "./types/AuthorsType.js"
import { ResponseType } from "./types/ResponseType.js"

import { books } from "./data/books.js"
import { authors } from "./data/authors.js"

import { getItemsBySearch } from "./utilis/getItemsBySearch.js"
import {compareBooks} from "./utilis/compareBooks.js"
import { createResponse } from "./utilis/createResponse.js"

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
    isActive: true,
    authorIds: [2]
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
// Request<Params, ResBody, ReqBody, ReqQuery>
app.post('/books', (req:Request<{}, ResponseType<BookType>, BookCreateType>, res) => {
    const body = req.body;
    let response:ResponseType<BookType> = {
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
            isActive: body.isActive,
            authorIds: body.authorIds
        }
        books.push(book)

        response = {
            data: book,
            error: null,
            status: 201
        };
    }
    else {
        response = {
            data: null,
            error: "Invalid book data",
            status: 400
        };
    }

    res.status(response.status).json(response)
})

// одна книга за айді
app.get('/books/:id', (req,res)=>{
    const id:number = +req.params.id
    const book:BookType|undefined = books.find((book)=>book.id===id);
    const exist_book:boolean = (book!==undefined)
    const response:ResponseType<BookType> = {
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

    const response:ResponseType<BookType> = {
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
    const response:ResponseType<BookType> = {
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
app.get('/books',(req: Request<{}, ResponseType<BookType>, BookCreateType>,res)=>{
    const title = req.query.title as string | undefined;

    let our_books:BookType[] | null = null;
    if (title !== undefined) {
        our_books = getItemsBySearch(title, books, book => book.title);
    }

    const response = createResponse<BookType>(
        books,
        our_books,
        title !== undefined
    );

    res.status(response.status).json(response)
})

// усі автори
app.get('/authors', (req:Request<{}, ResponseType<AuthorsType>, AuthorCreateType>, res) => {
    const lastName = req.query.lastName as string | undefined;

    let our_author: AuthorsType[] | null = null; 
    if (lastName !== undefined) {
        our_author = getItemsBySearch(lastName, authors, author => author.lastName);
    }

    const response = createResponse<AuthorsType>(
        authors,
        our_author,
        lastName !== undefined
    );

    res.status(response.status).json(response)
})

app.listen(PORT, () => {
    cl(`Server ${HOST}:${PORT} has been started...`)
});