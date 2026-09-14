import { ResponseType } from "../types/ResponseType.js";

export const createResponse = <T> (items: T[], filteredItems: T[] | null, search: boolean): ResponseType<T> => {

    if (items.length === 0) {
        return {
            data: null,
            error: "List is empty",
            status: 404
        };
    }

    if (search && filteredItems === null) {
        return {
            data: null,
            error: "Not found",
            status: 404
        };
    }

    return {
        data: search ? filteredItems : items,
        error: null,
        status: 200
    };
};