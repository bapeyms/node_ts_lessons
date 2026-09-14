export type BookType = {
    id: number,
    // | string - буде два варіанта типів даних, якщо додати |
    title: string,
    price: number,
    isActive?: boolean 
    // дозволяє ?: створювати об'єкти без поля, де є цей оператор
};

// Omit - це утиліта, яка створює новий тип, виключаючи з нього певні властивості
export type BookCreateType = Omit<BookType, "id">;

