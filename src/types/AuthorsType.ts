export type AuthorsType = {
    id: number,
    firstName: string,
    lastName: string
}

export type AuthorCreateType = Omit<AuthorsType, "id">