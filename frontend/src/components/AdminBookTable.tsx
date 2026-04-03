import type { Book } from '../types/Book'

interface AdminBookTableProps {
    books: Book[]
    loading: boolean
    onEdit: (book: Book) => void
    onDelete: (book: Book) => void
    busy?: boolean
}

export default function AdminBookTable({
    books,
    loading,
    onEdit,
    onDelete,
    busy,
}: AdminBookTableProps) {
    if (loading) {
        return <p className="text-muted">Loading books…</p>
    }

    if (books.length === 0) {
        return <p className="text-muted">No books found. Add one using the form above.</p>
    }

    return (
        <div className="table-responsive shadow-sm rounded">
            <table className="table table-striped align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Title</th>
                        <th scope="col">Author</th>
                        <th scope="col">Category</th>
                        <th scope="col">Pages</th>
                        <th scope="col">Price</th>
                        <th scope="col" className="text-end">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.bookId}>
                            <td>{book.bookId}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.category}</td>
                            <td>{book.pageCount}</td>
                            <td>${Number(book.price).toFixed(2)}</td>
                            <td className="text-end">
                                <div className="d-inline-flex gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => onEdit(book)}
                                        disabled={busy}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => onDelete(book)}
                                        disabled={busy}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
