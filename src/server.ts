import http from "node:http"
import fs from "node:fs"
import path from "node:path"

import {books} from "./data/books.js"
import {showBooks} from "./utilis/showBooks.js"

const PORT:number = 4200
 
const server = http.createServer((req,res) => {
    const PATH_TO_PAGES = path.join("src", "pages");

    if (req.method === "GET" && req.url === '/books') {
        let books_content: string = "<html><head><link rel=\"stylesheet\" href=\"book.css\"></head><body><div class=\"container\">";
        books.forEach((book) => {
            books_content += showBooks(book);
        });
        books_content += `</div></body></html>`;

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(books_content);
        return;
    }

    if (req.method === "GET" && path.extname(req.url as string) === '.css') {
        // Видаляємо початковий слеш з req.url, щоб шлях сформувався коректно
        const cssFileName = (req.url as string).substring(1);
        const PATH_TO_CSS = path.join("src", "styles", cssFileName);

        if (fs.existsSync(PATH_TO_CSS)) {
            const content = fs.readFileSync(PATH_TO_CSS);
            res.setHeader("Content-Type", "text/css; charset=utf-8");
            res.end(content);
        } else {
            res.statusCode = 404;
            res.end("CSS not found");
        }
        return;
    }

    if (req.method === "GET" && req.url === '/') {
        const PATH_TO_INDEX_PAGE = path.join(PATH_TO_PAGES, "index.html");
        const content = fs.readFileSync(PATH_TO_INDEX_PAGE);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(content);
        return;
    }

    if (req.method === "GET" && req.url === '/about') {
        const PATH_TO_ABOUT_PAGE = path.join(PATH_TO_PAGES, "about.html");
        const content = fs.readFileSync(PATH_TO_ABOUT_PAGE);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(content);
        return;
    }

    if (req.method === "POST") {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        const user = {
            name: "Alex",
            age: 20,
            method: req.method
        };
        res.end(JSON.stringify(user));
        return;
    }

    if (req.method === "PUT") {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end(`Ти хочеш оновити дані. Request: ${req.method}`);
        return;
    }

    // Обробка неіснуючих роутів (404)
    res.statusCode = 404;
    res.end("404 Not Found");
});

server.listen(PORT,()=>{
    console.log(`Server http://localhost:${PORT} has been started...`)
})