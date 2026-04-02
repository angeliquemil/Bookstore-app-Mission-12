import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Book } from '../types/Book'
import {
    createBook,
    deleteBook,
    fetchAllBooks,
    updateBook,
    type NewBookPayload,
} from '../api/booksApi'
import AdminBookForm from '../components/AdminBookForm'
import AdminBookTable from '../components/AdminBookTable'

function emptyDraft(): Book {
    return {
        bookId: '',
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        classification: '',
        category: '',
        pageCount: '',
        price: '',
    }
}

function validateDraft(draft: Book): string | null {
    const t = (s: string) => s.trim()
    if (!t(draft.title)) return 'Title is required.'
    if (!t(draft.author)) return 'Author is required.'
    if (!t(draft.publisher)) return 'Publisher is required.'
    if (!t(draft.isbn)) return 'ISBN is required.'
    if (!t(draft.classification)) return 'Classification is required.'
    if (!t(draft.category)) return 'Category is required.'
    const pageCount = Number(draft.pageCount)
    if (!Number.isFinite(pageCount) || pageCount < 1) {
        return 'Page count must be at least 1.'
    }
    const price = Number(draft.price)
    if (!Number.isFinite(price) || price < 0) {
        return 'Price must be zero or greater.'
    }
    return null
}

export default function AdminBooksPage() {
    const [books, setBooks] = useState<Book[]>([])
    const [listLoading, setListLoading] = useState(true)
    const [actionBusy, setActionBusy] = useState(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'danger'; text: string } | null>(
        null,
    )

    const [mode, setMode] = useState<'add' | 'edit'>('add')
    const [draft, setDraft] = useState<Book>(() => emptyDraft())

    const loadBooks = useCallback(async () => {
        setListLoading(true)
        try {
            const data = await fetchAllBooks()
            setBooks(data)
        } catch (e) {
            console.error(e)
            setFeedback({ type: 'danger', text: 'Could not load books. Is the API running?' })
            setBooks([])
        } finally {
            setListLoading(false)
        }
    }, [])

    useEffect(() => {
        loadBooks().catch(() => undefined)
    }, [loadBooks])

    const handleAddOrUpdate = async () => {
        const err = validateDraft(draft)
        if (err) {
            setFeedback({ type: 'danger', text: err })
            return
        }

        setActionBusy(true)
        setFeedback(null)
        try {
            if (mode === 'add') {
                const payload: NewBookPayload = {
                    title: draft.title.trim(),
                    author: draft.author.trim(),
                    publisher: draft.publisher.trim(),
                    isbn: draft.isbn.trim(),
                    classification: draft.classification.trim(),
                    category: draft.category.trim(),
                    pageCount: draft.pageCount,
                    price: draft.price,
                }
                await createBook(payload)
                setFeedback({ type: 'success', text: 'Book added.' })
                setDraft(emptyDraft())
                setMode('add')
            } else {
                const updated: Book = {
                    ...draft,
                    title: draft.title.trim(),
                    author: draft.author.trim(),
                    publisher: draft.publisher.trim(),
                    isbn: draft.isbn.trim(),
                    classification: draft.classification.trim(),
                    category: draft.category.trim(),
                }
                await updateBook(updated)
                setFeedback({ type: 'success', text: 'Book updated.' })
                setDraft(emptyDraft())
                setMode('add')
            }
            await loadBooks()
        } catch (e) {
            console.error(e)
            setFeedback({
                type: 'danger',
                text: e instanceof Error ? e.message : 'Something went wrong.',
            })
        } finally {
            setActionBusy(false)
        }
    }

    const handleEdit = (book: Book) => {
        setMode('edit')
        setDraft({ ...book })
        setFeedback(null)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleCancelEdit = () => {
        setMode('add')
        setDraft(emptyDraft())
        setFeedback(null)
    }

    const handleDelete = async (book: Book) => {
        const ok = window.confirm(`Delete "${book.title}"? This cannot be undone.`)
        if (!ok) return

        setActionBusy(true)
        setFeedback(null)
        try {
            await deleteBook(Number(book.bookId))
            setFeedback({ type: 'success', text: 'Book deleted.' })
            if (mode === 'edit' && draft.bookId === book.bookId) {
                handleCancelEdit()
            }
            await loadBooks()
        } catch (e) {
            console.error(e)
            setFeedback({
                type: 'danger',
                text: e instanceof Error ? e.message : 'Delete failed.',
            })
        } finally {
            setActionBusy(false)
        }
    }

    return (
        <div className="container py-4">
            <div className="row mb-3">
                <div className="col">
                    <h1 className="h3 mb-0">Admin Book Management</h1>
                    <p className="text-muted mb-0">Add, edit, or remove books in the catalog.</p>
                </div>
                <div className="col-auto d-flex align-items-center gap-2">
                    <Link className="btn btn-outline-secondary btn-sm" to="/">
                        Back to store
                    </Link>
                </div>
            </div>

            {feedback && (
                <div
                    className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-danger'}`}
                    role="status"
                >
                    {feedback.text}
                </div>
            )}

            <AdminBookForm
                mode={mode}
                draft={draft}
                onDraftChange={setDraft}
                onSubmit={handleAddOrUpdate}
                onCancelEdit={mode === 'edit' ? handleCancelEdit : undefined}
                disabled={actionBusy || listLoading}
            />

            <h2 className="h5 mb-3">All books</h2>
            <AdminBookTable
                books={books}
                loading={listLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                busy={actionBusy}
            />
        </div>
    )
}
