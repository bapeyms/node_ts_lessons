import { Router, Request, Response } from "express";
import { BookType, BookCreateType } from "../types/BookType.js";
import { ResponseType } from "../types/ResponseType.js";

import { books } from "../data/books.js";
import { pool } from "../db/database.js";

import { getItemsBySearch } from "../utilis/getItemsBySearch.js";
import { createResponse } from "../utilis/createResponse.js";
import { compareBooks } from "../utilis/compareBooks.js";


export const bookRouter = Router();

// отримання всіх книжок, або пошук по тайтлу
bookRouter.get('/', async ( // req та res мають свої типи даних
    req:Request<{}, ResponseType<BookType>, null, {title: string}>, res:Response) => {
    // const title = req.query.title as string | undefined;
    
    // let our_books:BookType[] | null = null;
    // if (title !== undefined) {
    //     our_books = getItemsBySearch(title, books, book => book.title);
    // }
    
    // const response = createResponse<BookType>(
    //     books,
    //     our_books,
    //     title !== undefined
    // );
    
    // res.status(response.status).json(response)

    // для бази даних
    try {
        const title = req.query.title;
        let result;

        if (title) {
            result = await pool.query(
                // ILIKE дозволяє не враховувати регістр
                // $1 - місце для значень, куди підставляється перше значення з масиву, яке передається другим аргументом
                // такий спосіб передачі даних називається параметризованим SQL-запитом
                "SELECT * FROM booksdb WHERE title ILIKE $1",
                // %% - означає будь-яку к-сть символів, тобто дозволяє знаходити тайтл по одному слову
                [`%${title}%`]
            );
        }
        else {
            result = await pool.query(
                "SELECT * FROM booksdb"
            );
        }

        const response: ResponseType<BookType> = {
            data: result.rows,
            error: null,
            status: 200
        }
        res.status(response.status).json(response);
    }
    catch (error) {
        const response: ResponseType<BookType> = {
            data: null,
            error: "Database error",
            status: 500
        };
        res.status(response.status).json(response);
    }
})

// додавання книжок
// Request<Params, ResBody, ReqBody, ReqQuery>
bookRouter.post('/', (req:Request<{}, ResponseType<BookType>, BookCreateType>, res) => {
    const body = req.body;
    let response:ResponseType<BookType> = {
        data:null,
        error:null,
        status:500
    };

    // typeof - оперетор, який визначає тип значення та повертає його як рядок
    if (body && typeof body.title === "string" && typeof body.price === "number" && typeof body.isActive === "boolean") {
        const id = 
        books.length > 0 ? books.sort(compareBooks)[0].id+1:1;
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
bookRouter.get('/:id', async (req:Request<{id: string}, ResponseType<BookType>, BookCreateType>,res)=>{
    // const id: number = +req.params.id;
    
    // const book: BookType | undefined =
    // books.find(book => book.id === id);
    
    // if (book === undefined) {
    //     const response: ResponseType<BookType> = {
    //         data: null,
    //         error: "The book not found",
    //         status: 404
    //     };

    //     res.status(response.status).json(response);
    //     return;
    // }

    // const response: ResponseType<BookType> = {
    //     data: book,
    //     error: null,
    //     status: 200
    // };

    // res.status(response.status).json(response);

    // для бази даних
    const id: number = +req.params.id;
    try {
        const result = await pool.query(
            "SELECT * FROM booksdb  WHERE id = $1",
            [id]
        );
        if (result.rows.length === 0) {
            const response: ResponseType<BookType> = {
                data: null,
                error: "The book not found",
                status: 404
            };
            res.status(response.status).json(response);
            return;
        }

        const response: ResponseType<BookType> = {
            data: result.rows[0],
            error: null,
            status: 200
        }
        res.status(response.status).json(response);
    }
    catch (error) {
        const response: ResponseType<BookType> = {
            data: null,
            error: "Database error",
            status: 500
        };
        res.status(response.status).json(response);
    }
})

// домашнє завдання 11.09.2026
bookRouter.get('/:title/:isActive', (req, res) => {
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
bookRouter.delete('/:id', (req:Request, res:Response) => {
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
        const deleteBook = books[index];
        books.splice(index, 1);
        response.data = deleteBook;
    }
    
    res.status(response.status).json(response);
})