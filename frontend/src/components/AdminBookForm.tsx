import type { FormEvent } from 'react'
import type { Book } from '../types/Book'

export type AdminBookFormMode = 'add' | 'edit'

interface AdminBookFormProps {
    mode: AdminBookFormMode
    draft: Book
    onDraftChange: (next: Book) => void
    onSubmit: () => void
    onCancelEdit?: () => void
    disabled?: boolean
}

export default function AdminBookForm({
    mode,
    draft,
    onDraftChange,
    onSubmit,
    onCancelEdit,
    disabled,
}: AdminBookFormProps) {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        onSubmit()
    }

    const setField = (field: keyof Book, value: string | number) => {
        onDraftChange({ ...draft, [field]: value })
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h2 className="h5 card-title">
                    {mode === 'add' ? 'Add a new book' : 'Edit book'}
                </h2>
                <form onSubmit={handleSubmit} className="row g-3">
                    {mode === 'edit' && (
                        <div className="col-12 col-md-2">
                            <label className="form-label" htmlFor="admin-bookId">
                                Book ID
                            </label>
                            <input
                                id="admin-bookId"
                                className="form-control"
                                type="number"
                                value={draft.bookId}
                                readOnly
                                disabled
                            />
                        </div>
                    )}

                    <div className="col-12 col-md-6">
                        <label className="form-label" htmlFor="admin-title">
                            Title
                        </label>
                        <input
                            id="admin-title"
                            className="form-control"
                            value={draft.title}
                            onChange={(e) => setField('title', e.target.value)}
                            disabled={disabled}
                            required
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <label className="form-label" htmlFor="admin-author">
                            Author
                        </label>
                        <input
                            id="admin-author"
                            className="form-control"
                            value={draft.author}
                            onChange={(e) => setField('author', e.target.value)}
                            disabled={disabled}
                            required
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label" htmlFor="admin-publisher">
                            Publisher
                        </label>
                        <input
                            id="admin-publisher"
                            className="form-control"
                            value={draft.publisher}
                            onChange={(e) => setField('publisher', e.target.value)}
                            disabled={disabled}
                            required
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label" htmlFor="admin-isbn">
                            ISBN
                        </label>
                        <input
                            id="admin-isbn"
                            className="form-control"
                            value={draft.isbn}
                            onChange={(e) => setField('isbn', e.target.value)}
                            disabled={disabled}
                            required
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label" htmlFor="admin-classification">
                            Classification
                        </label>
                        <input
                            id="admin-classification"
                            className="form-control"
                            value={draft.classification}
                            onChange={(e) => setField('classification', e.target.value)}
                            disabled={disabled}
                            required
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label" htmlFor="admin-category">
                            Category
                        </label>
                        <input
                            id="admin-category"
                            className="form-control"
                            value={draft.category}
                            onChange={(e) => setField('category', e.target.value)}
                            disabled={disabled}
                            required
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <label className="form-label" htmlFor="admin-pageCount">
                            Page count
                        </label>
                        <input
                            id="admin-pageCount"
                            className="form-control"
                            type="number"
                            min={1}
                            step={1}
                            value={draft.pageCount}
                            onChange={(e) => setField('pageCount', Number(e.target.value))}
                            disabled={disabled}
                            required
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <label className="form-label" htmlFor="admin-price">
                            Price
                        </label>
                        <input
                            id="admin-price"
                            className="form-control"
                            type="number"
                            min={0}
                            step={0.01}
                            value={draft.price}
                            onChange={(e) => setField('price', Number(e.target.value))}
                            disabled={disabled}
                            required
                        />
                    </div>

                    <div className="col-12 d-flex flex-wrap gap-2">
                        <button type="submit" className="btn btn-primary" disabled={disabled}>
                            {mode === 'add' ? 'Add book' : 'Save changes'}
                        </button>
                        {mode === 'edit' && onCancelEdit && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onCancelEdit}
                                disabled={disabled}
                            >
                                Cancel edit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}
