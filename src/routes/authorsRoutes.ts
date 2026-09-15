import { Router, Request, Response } from "express";
import { AuthorsType, AuthorCreateType } from "../types/AuthorsType.js";
import { BookType } from "../types/BookType.js";
import { ResponseType } from "../types/ResponseType.js";

import { authors } from "../data/authors.js";
import { books } from "../data/books.js";

import { getItemsBySearch } from "../utilis/getItemsBySearch.js";
import { createResponse } from "../utilis/createResponse.js";

export const authorsRouter = Router();

// усі автори
authorsRouter.get('/', (req:Request<{}, ResponseType<AuthorsType>, AuthorCreateType>, res) => {
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

// все, що приходить з url спочатку сприймається як стрінг
authorsRouter.get('/:id', (req:Request<{id: string}, ResponseType<AuthorsType>, AuthorCreateType>, res) => {
    const id:number = +req.params.id;

    const author: AuthorsType | undefined = 
    authors.find((author) => author.id === id);

    if (author === undefined) {
        const response: ResponseType<AuthorsType> = {
            data: null,
            error: "The author not found",
            status: 404
        };

        res.status(response.status).json(response);
        return;
    }

    const allAuthorBooks: BookType[] = books.filter(
        (book) => book.authorIds.includes(id));
    

    const response = {
        data: { ...author, books: allAuthorBooks},
        error: null,
        status: 200
    };

    res.status(response.status).json(response);
})