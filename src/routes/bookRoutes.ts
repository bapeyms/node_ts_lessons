import { Router, Request, Response } from "express";
import { BookType, BookCreateType } from "../types/BookType.js";
import { ResponseType } from "../types/ResponseType.js";

import { books } from "../data/books.js";
import { pool } from "../db/databaseConnection.js";

import { getItemsBySearch } from "../utilis/getItemsBySearch.js";
import { createResponse } from "../utilis/createResponse.js";
import { compareBooks } from "../utilis/compareBooks.js";
import { title } from "node:process";

import multer from "multer";
import path from "node:path";
import fs from "node:fs/promises"

export const bookRouter = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadFile = path.join(process.cwd(), "public", "imgs");
        cb(null, uploadFile);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const tempName = `temp_${Date.now()}${ext}`
        cb(null, tempName);
    }
});
const upload = multer({ storage });

// post для форми
bookRouter.get("/add-book", (req: Request, res: Response) => {
    res.render("pages/book-form", { title: "Add Book" });
});

bookRouter.post("/add-book",  upload.single("image"), async (req: Request<{}, BookCreateType>, res: Response) => {
    try {
        const { title, price, year } = req.body;
        const parsedPrice = Number(price) || 0;
        const parsedYear = Number(year) || new Date().getFullYear();
        const isActive = req.body.isActive === "true"; 

        const result = await pool.query(
            `INSERT INTO books (title, price, publication_year, image, is_active)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id`,
            [title, parsedPrice, parsedYear, "", isActive]
        );

        const newBookId = result.rows[0].id;

        let finalFileName = "";
        if (req.file) {
            const ext = path.extname(req.file.originalname);
            finalFileName = `pic${newBookId}${ext}`;

            const oldPath = req.file.path;
            const newPath = path.join(process.cwd(), "public", "imgs", finalFileName);

            await fs.rename(oldPath, newPath);

            await pool.query(
                `UPDATE books
                SET image = $1 WHERE id = $2`,
                [finalFileName, newBookId]
            );
        }

        res.redirect(`/books/${newBookId}`)
    }
    catch (error) {
        console.error("DATABASE ERROR:", error);
        res.status(500).render("pages/error", 
            { message: "Error occured during book adding" });
    }
    }
)

// для json-сервера
// bookRouter.get("/", async (req: Request<{}, BookCreateType, null, { title: string }>, res: Response) => {
//         const data = await fetch(`${process.env.PATH_TO_JSON_SERVER}/book`)
//         const json = await data.json()
//         console.log(json)
//         res.render("pages/books", { book: json, title: "Books" })

//     });

// отримання всіх книжок, або пошук по тайтлу
bookRouter.get('/', async ( // req та res мають свої типи даних
    req:Request<{}, ResponseType<BookType>, null, {title: string}>, res:Response) => {
        console.log()
        
    // const title = req.query.title as string | undefined;
    
    // let our_books:BookType[] | null = null;
    // if (title !== undefined) {
    //     our_books = getItemsBySearch(title, books, book => book.title);
    // }
    
    // res.render("pages/books", {books, title: "Books"});
    
    // формування респонсу
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
                "SELECT * FROM books WHERE title ILIKE $1",
                // %% - означає будь-яку к-сть символів, тобто дозволяє знаходити тайтл по одному слову
                [`%${title}%`]
            );
        }
        else {
            result = await pool.query(
                "SELECT * FROM books"
            );
        }

        res.render('pages/books', {
            books: result.rows,
            title: "Books"
        })


        // json-формат
        // const response: ResponseType<BookType> = {
        //     data: result.rows,
        //     error: null,
        //     status: 200
        // }
        // res.status(response.status).json(response);
    }
    catch (error) {
        console.error(error);
        console.error("DATABASE ERROR:", error);

        // json-формат
        // const response: ResponseType<BookType> = {
        //     data: null,
        //     error: "Database error",
        //     status: 500
        // };
        // res.status(response.status).json(response);
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
    if (isNaN(id)) {
        return res.status(400).render('pages/error', {
            message: "Incorrect book ID!"
        });
    }

    try {
        const {id} = req.params;
        const result = await pool.query(
            "SELECT * FROM books WHERE id = $1",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).render('pages/error', {
                message: "Book is not found!"
            })
            // json-формат
            // const response: ResponseType<BookType> = {
            //     data: null,
            //     error: "The book not found",
            //     status: 404
            // };
            // res.status(response.status).json(response);
            // return;
        }

        const book: BookType = result.rows[0];
        res.render('pages/book-details', {
            book: result.rows[0],
            title: result.rows[0]?.title || "Book details"
        })

        // json-формат
        // const response: ResponseType<BookType> = {
        //     data: result.rows[0],
        //     error: null,
        //     status: 200
        // }
        // res.status(response.status).json(response);
    }
    catch (error) {
        console.error("DATABASE ERROR:", error);
        res.status(500).render("pages/error", 
            { message: "Error fetching book details" });

        // json-формат
        // const response: ResponseType<BookType> = {
        //     data: null,
        //     error: "Database error",
        //     status: 500
        // };
        // res.status(response.status).json(response);
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