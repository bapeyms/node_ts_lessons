import { BookType } from "../types/BookType.js";
 
type showBookType = (book:BookType) => string;

export const showBooks:showBookType = (book) => {
    return `<div class="book-card">
    <h2 class="book-title">${book.title}</h2>
    <p class="book-price">${book.price} грн</p>
    <span class="book-status active">${book.isActive?"В наявності":"Немає"}</span>
    <a href="/book?id=${book.id}" class="book-button">Купити</a>
    </div>`
}
