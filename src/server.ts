import http from "node:http"
import fs from "node:fs"
import path from "node:path"

import {books} from "./data/books.js"
import {showBooks} from "./utilis/showBooks.js"

const PORT:number = 4200
 
const server = http.createServer((req,res) => {
    const PATH_TO_PAGES = path.join("src", "pages");

    if(req.method==="GET" &&  req.url==='/books')
    {
        let books_content:string = ""
        books.forEach((book,index)=>{
            if(index==0)
                books_content+=`<html><head><link rel="stylesheet" href="book.css"></head><body><div class="container">`
            books_content+=showBooks(book)
        });
        books_content+=`</div></body></html>`
         res.setHeader("Content-Type", "text/html; charset=utf-8")
        res.write(books_content)
        res.end()
    }


    else if(req.method==="GET" && path.extname(req.url as string)==='.css')
    {
        console.log("gdjf")
        const PATH_TO_CSS = path.join("src","styles",req.url as string)
        const content = fs.readFileSync(PATH_TO_CSS)
        res.setHeader("Content-Type", "text/css; charset=utf-8")
       
        res.write(content)
        res.end()
    }

    else if(req.method === "POST"){
        res.setHeader("Content-Type", "application/json; charset=utf-8")
        const user = {
            name: "Alex",
            age: 20
        }
        res.write(JSON.stringify(user));
        res.write(`Request: ${req.method}`);
    }
     else if(req.method === "PUT"){
        res.write(`Ти хочеш оновити дані. Request: ${req.method}`)
    }
   
    res.end()
})
server.listen(PORT,()=>{
    console.log(`Server http://localhost:${PORT} has been started...`)
})