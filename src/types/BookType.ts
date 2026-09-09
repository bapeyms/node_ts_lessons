export type BookType = {
    id: number,
    // | string - буде два варіанта типів даних, якщо додати |
    title: string,
    price: number,
    isActive?: boolean 
    // дозволяє ?: створювати об'єкти без поля, де є цей оператор
};
