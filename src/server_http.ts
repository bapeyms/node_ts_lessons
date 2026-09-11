import http from "node:http" // модуль для створення сервера
import fs from "node:fs"
import path from "node:path"
import {URL} from "node:url" // клас для роботи з URL
import dorenv from "dotenv"

import {books} from "./data/books.js"
import {showBooks} from "./utilis/showBooks.js"
import { BookType } from "./types/BookType.js"
 
dorenv.config() // завантаження змінних середовища з .env файлу

// словник для визначення типу контенту для зображень
// Record<string, string> - тип даних, який описує об'єкт, де ключі є рядками, а значення також рядками
const PHOTO_TYPES: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml"
};

// createServer - створення серверу
// (req, res) => {} - ф-ція, що буде виконуватися кожного разу, коли клієнт роьитиме http-запит
const server = http.createServer((req,res) => { 
    // візьми req.url, а якщо його немає - візьми /
    // ?? - оператор нульового злиття. повертає праве значння лише якщо ліве значення дорівнює null/underfined. у іншому випадку він повертає ліве значення
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`)
    console.log(url);
    
    // створення шляху з правильними розділювачами
    const PATH_TO_PAGES = path.join("src", "pages");

    // якщо запрос GET та url -> books
    if (req.method === "GET" && req.url === '/books') {
        let books_content: string = 
        "<html><head><link rel=\"stylesheet\" href=\"book.css\"></head><body><div class=\"container\">";
        
        books.forEach((book) => {
            books_content += showBooks(book);
        });
        books_content += `</div></body></html>`;

        // відправка HTML
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(books_content);
        return; //зупиняє callback, тобто сервер не піде перевіряти наступні if
    }
    else if (req.method === "GET" && url.pathname === '/book') {
        const idParam = url.searchParams.get("id");

        if (idParam !== null) {
            const id: number = Number(idParam);
            const book: BookType | undefined = books.find(book => book.id === id);

            if (book !== undefined) {
                const htmlResponse = `
                    <html>
                        <head>
                            <link rel="stylesheet" href="book.css">
                        </head>
                        <body>
                            <div class="container">
                                ${showBooks(book)}
                            </div>
                        </body>
                    </html>
                `;
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                res.end(htmlResponse);
                return;
            } 
            else {
                res.statusCode = 404;
                res.end("Книгу не знайдено");
                return;
            }
        }
        res.statusCode = 400;
        res.end("Не вказано id книги");
        return;
    }
    else if(req.method==="POST" && req.url==="/books") {
        res.end("ok")
    }
    
    // відображення картинок
    if (req.method === "GET" && req.url?.startsWith("/images/")) {

        const imageName = req.url.substring("/images/".length); // вирізання частини /images/ для отримання чистої назви файлу
        // path.normalize - нормалізація шляху, щоб уникнути проблем з різними ОС
        const PATH_TO_IMAGE = path.normalize(path.join("src", "images", imageName));
        
        const ext = path.extname(PATH_TO_IMAGE).toLowerCase();
        const contentType = PHOTO_TYPES[ext] || "application/octet-stream"; // визначення типу контенту для зображення
        
        if (fs.existsSync(PATH_TO_IMAGE)) {
            const content = fs.readFileSync(PATH_TO_IMAGE);
            res.setHeader("Content-Type", contentType);
            res.end(content);
        } 
        else {
            res.statusCode = 404;
            res.end("Image not found");
        }
        return;
    }

    if (req.method === "GET" && path.extname(req.url as string) === '.css') {
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

    res.statusCode = 404;
    res.end("404 Not Found");
});

server.listen(process.env.PORT,()=>{
    console.log(`Server has been started on port ${process.env.PORT}`)
    console.log(`Server name: ${process.env.SERVER_NAME}`);
})