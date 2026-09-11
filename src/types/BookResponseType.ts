import { BookType } from "./BookType.js"

export  type BookResponseType = {
    data:null|BookType|Array<BookType>,
    error:null|string,
    status:number
}