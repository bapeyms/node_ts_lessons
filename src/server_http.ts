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
// (req, res) => {} - ф-ція, що буде виконуватися кожного разу, коли клієнт робитиме http-запит
const server = http.createServer((req,res) => { 
    // візьми req.url, а якщо його немає - візьми /
    // ?? - оператор нульового злиття. повертає праве значння лише якщо ліве значення дорівнює null/underfined. у іншому випадку він повертає ліве значення
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`)
    console.log(url);
    
    // створення шляху з правильними розділювачами
    const PATH_TO_PAGES = path.join("src", "pages");

    // extname повертає розширення файлу
    if (req.method === "GET" && path.extname(req.url as string) === '.css') {
        // basename витягує останню частину шляху, зазвичай назву файлу
        // тобто буде проігнорована папка styles (для коректного відображення css)
        const cssFileName = path.basename(req.url as string);
        const PATH_TO_CSS = path.join("src", "styles", cssFileName);

        if (fs.existsSync(PATH_TO_CSS)) {
            const content = fs.readFileSync(PATH_TO_CSS);
            res.setHeader("Content-Type", "text/css; charset=utf-8");
            res.end(content);
        } 
        else {
            res.statusCode = 404;
            res.end("CSS not found");
        }
        return;
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

    // обробка сторінки з книжками
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
    // POST дані приходять частинами(сегментами), приблизно по 1500 байт
    // TCP протокол автоматично розбиває дані на сегменти, а приймаюча сторона потім збирає їх назад до купи
    // цей механізм допомагає уникати затримок та переповнення RAM
    // це здійснюється за допомогою потоків (Node.js Streams), які починають обробляти дані після першого ж отриманого сегменту 
    // це ще називають байтовим буфером (byte buffer)
    // chunk (фрагмент/шматок) містить один мережевий пакет переданих даних
    else if(req.method==="POST" && req.url==="/books") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            const data = new URLSearchParams(body);

            const title = data.get("title"); 
            const price = data.get("price"); 
            const isActive = data.get("isActive");

            const newBook: BookType = { 
                id: books.length + 1, 
                title: title ?? "", 
                price: Number(price), 
                isActive: isActive === "true" 
            };
            books.push(newBook);
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(` <html> 
                        <head><link rel="stylesheet" href="/styles/book.css"> </head>
                            <body> 
                                <div class="container"> 
                                    <h1>Книгу успішно додано!</h1> 
                                    ${showBooks(newBook)}  
                                    <a href="/books">Повернутися до книг</a>
                                </div>
                            </body>
                        </html> `);
            });
        return;
    }
    else if (req.method === "GET" && req.url === "/add-book") { 
        const htmlResponse = `<html> 
                                <head> 
                                    <link rel="stylesheet" href="/styles/book.css">
                                </head>
                                <body> 
                                    <div class="container">
                                        <div class="book-card"> 
                                            <h1 class="book-title"> Add a new book </h1>
                                            <form action="/books" method="POST"> 
                                            <label> Book title: </label>
                                            <input type="text" name="title" required > 
                                            <label> Price: </label> 
                                            <input type="number" name="price" required >   
                                            <label> Active: </label> 
                                            <select name="isActive"> 
                                                <option value="true">Yes</option> 
                                                <option value="false">No</option> 
                                            </select>  
                                            <button type="submit" class="book-button"> Add book </button>   
                                             </form>
                                        </div> 
                                    </div>
                                </body>
                        </html> `; 
        res.setHeader("Content-Type", "text/html; charset=utf-8"); 
        res.end(htmlResponse); 
        return; 
    }
    
    if (req.method === "GET") {
        const pageName = req.url === "/" ? "index.html" : `${req.url}.html`;
        const PATH_TO_PAGE = path.join(PATH_TO_PAGES, pageName);
        
        if (fs.existsSync(PATH_TO_PAGE)) {
            const content = fs.readFileSync(PATH_TO_PAGE);
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(content);
            return;
        } 
    }
    

    // if (req.method === "POST") {
    //     res.setHeader("Content-Type", "application/json; charset=utf-8");
    //     const user = {
    //         name: "Alex",
    //         age: 20,
    //         method: req.method
    //     };
    //     res.end(JSON.stringify(user));
    //     return;
    // }

    // if (req.method === "PUT") {
    //     res.setHeader("Content-Type", "text/plain; charset=utf-8");
    //     res.end(`Ти хочеш оновити дані. Request: ${req.method}`);
    //     return;
    // }

    res.statusCode = 404;
    res.end("404 Not Found");
});

server.listen(process.env.PORT,() => {
    console.log(`Server has been started on port ${process.env.PORT}`)
    console.log(`Server name: ${process.env.SERVER_NAME}`);
})