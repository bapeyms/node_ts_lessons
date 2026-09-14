import { BookType } from "../types/BookType.js";
 
type showBookType = (book:BookType) => string;
type showBooksType = (book:Array<BookType>) => string;
type getBooksByTitleType = (title:string, books:BookType[]) =>BookType[]|null;


export const showBooks:showBookType = (book) => {
    return `<div class="book-card">
    <h2 class="book-title">${book.title}</h2>
    <p class="book-price">${book.price} грн</p>
    <span class="book-status active">${book.isActive?"В наявності":"Немає"}</span>
    <a href="/book?id=${book.id}" class="book-button">Купити</a>
    </div>`
}

export const getBooksByTitle:getBooksByTitleType = (title, books) => {
    // trim() - видаляє пробіли
    const books_filtered = books.filter(book => 
        book.title.toLowerCase().trim().includes(title.toLowerCase().trim()))
    if (books_filtered.length > 0) {
        return books_filtered;
    }
    else {
        return null;
    }
}