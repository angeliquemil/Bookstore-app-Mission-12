import type { Book } from '../types/Book'

export const BOOKS_API_BASE =
    import.meta.env.VITE_API_BASE_URL ?? 'https://bookstore-app-backend-hrdsdxbdg8bfarh0.francecentral-01.azurewebsites.net'

export interface BooksPageResponse {
    books: Book[]
    totalNumBooks: number
}

export async function fetchBooksPage(params: URLSearchParams): Promise<BooksPageResponse> {
    const response = await fetch(`${BOOKS_API_BASE}?${params.toString()}`)
    if (!response.ok) {
        throw new Error('Failed to fetch books from API')
    }
    return response.json()
}

export async function fetchCategories(): Promise<string[]> {
    const response = await fetch(`${BOOKS_API_BASE}/categories`)
    if (!response.ok) {
        throw new Error('Failed to fetch categories')
    }
    return response.json()
}

export async function fetchAllBooks(): Promise<Book[]> {
    const response = await fetch(`${BOOKS_API_BASE}/all`)
    if (!response.ok) {
        throw new Error('Failed to load books')
    }
    return response.json()
}

export type NewBookPayload = Omit<Book, 'bookId'>

export async function createBook(book: NewBookPayload): Promise<Book> {
    const response = await fetch(BOOKS_API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    })
    if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `Create failed (${response.status})`)
    }
    return response.json()
}

export async function updateBook(book: Book): Promise<Book> {
    const response = await fetch(`${BOOKS_API_BASE}/${book.bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    })
    if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `Update failed (${response.status})`)
    }
    return response.json()
}

export async function deleteBook(bookId: number): Promise<void> {
    const response = await fetch(`${BOOKS_API_BASE}/${bookId}`, { method: 'DELETE' })
    if (response.status === 204) {
        return
    }
    if (!response.ok) {
        throw new Error(`Delete failed (${response.status})`)
    }
}
