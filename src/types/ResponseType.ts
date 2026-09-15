export type ResponseType<T> = {
    data: null | T | Array<T>,
    error: null | string,
    status: number
}