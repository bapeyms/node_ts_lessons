import type { BookType } from "../types/BookType.js";

export const books: Array<BookType> = [
    {
        id: 1,
        title: "Pride and Prejudice",
        price: 250,
        isActive: true,
        authorIds: [1]
    },
    {
        id: 2,
        title: "The Great Gatsby",
        price: 320,
        isActive: false,
        authorIds: [2]
    },
    {
        id: 3,
        title: "The Catcher in the Rye",
        price: 400,
        isActive: true,
        authorIds: [3]
    },
    {
        id: 4,
        title: "Harry Potter and the Philosopher's Stone",
        price: 450,
        isActive: false,
        authorIds: [4]
    },
    {
        id: 5,
        title: "The Little Prince",
        price: 280,
        isActive: false,
        authorIds: [5]
    },
    {
        id: 6,
        title: "TEST",
        price: 6767,
        isActive: false,
        authorIds: [6, 7]
    },
    {
        id: 7,
        title: "Test test Testik",
        price: 228,
        isActive: true,
        authorIds: [7, 8]
    },
    {
        id: 8,
        title: "MyTest",
        price: 228,
        isActive: true,
        authorIds: [1, 6, 8]
    }
];