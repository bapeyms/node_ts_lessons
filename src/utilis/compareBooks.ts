import { BookType } from "../types/BookType.js";

type compareBooksType = (b1:BookType, b2:BookType) => number

export const compareBooks:compareBooksType = (b1, b2) => {
    return b2.id-b1.id;
}