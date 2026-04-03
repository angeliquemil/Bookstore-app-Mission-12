import { useEffect, useState } from 'react'
import type { Book } from '../types/Book'
import { useCart } from '../context/CartContext'
import { loadBrowseState, saveBrowseState, type SortOrder } from '../utils/browseStorage'
import { fetchBooksPage } from "../api/booksApi"

interface BookListProps {
  selectedCategories: string[];
}

function BookList({ selectedCategories }: BookListProps) {
  const saved = loadBrowseState()
  const { addToCart } = useCart()

  const [books, setBooks] = useState<Book[]>([])
  const [pageSize, setPageSize] = useState<number>(() => saved?.pageSize ?? 5)
  const [pageNum, setPageNum] = useState<number>(() => saved?.pageNum ?? 1)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => saved?.sortOrder ?? 'asc')

  useEffect(() => {
    saveBrowseState({ category: selectedCategories.join(','), pageNum, pageSize, sortOrder })
  }, [selectedCategories, pageNum, pageSize, sortOrder])

  useEffect(() => {
    const loadBooks = async () => {
      const params = new URLSearchParams({
        pageSize: String(pageSize),
        pageNum: String(pageNum),
        sortOrder,
      })
      if (selectedCategories.length > 0) {
        params.set('category', selectedCategories[0])
      }

      const data = await fetchBooksPage(params)
      setBooks(data.books)
      setTotalItems(data.totalNumBooks)
    }

    loadBooks().catch((error) => {
      console.error(error)
      setBooks([])
      setTotalItems(0)
    })
  }, [pageSize, pageNum, sortOrder, selectedCategories])

  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / pageSize))
  }, [totalItems, pageSize])

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(totalItems / pageSize) || 1)
    setPageNum((current) => (current > maxPage ? maxPage : current))
  }, [totalItems, pageSize])

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="mb-0">Online Bookstore</h1>
          <p className="text-muted mb-0">Browse, filter, and add books to your cart.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-12">
          <div className="row g-3 mb-3 align-items-end">
            <div className="col-sm-6 col-md-4">
              <label htmlFor="pageSize" className="form-label">
                Books per page
              </label>
              <select
                id="pageSize"
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPageNum(1)
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="col-sm-6 col-md-4">
              <label htmlFor="sortOrder" className="form-label">
                Sort by title
              </label>
              <select
                id="sortOrder"
                className="form-select"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as SortOrder)
                  setPageNum(1)
                }}
              >
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
            </div>
          </div>

          <p className="text-muted">
            Total books{selectedCategories.length > 0 ? ' in selected categories' : ''}: {totalItems}
          </p>

          <div className="row g-3">
            {books.map((book) => (
              <div className="col-12 col-md-6" key={book.bookId}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h2 className="card-title h5">{book.title}</h2>
                    <p className="card-text mb-1 small">
                      <strong>Author:</strong> {book.author}
                    </p>
                    <p className="card-text mb-1 small">
                      <strong>Publisher:</strong> {book.publisher}
                    </p>
                    <p className="card-text mb-1 small">
                      <strong>ISBN:</strong> {book.isbn}
                    </p>
                    <p className="card-text mb-1 small">
                      <strong>Classification:</strong> {book.classification}
                    </p>
                    <p className="card-text mb-1 small">
                      <strong>Category:</strong> {book.category}
                    </p>
                    <p className="card-text mb-1 small">
                      <strong>Pages:</strong> {book.pageCount}
                    </p>
                    <p className="card-text mb-3">
                      <strong>Price:</strong> ${Number(book.price).toFixed(2)}
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary mt-auto"
                      onClick={() => addToCart({ ...book, bookId: Number(book.bookId), price: Number(book.price) })}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row mt-4">
            <div className="col">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setPageNum((current) => current - 1)}
                  disabled={pageNum === 1}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    type="button"
                    className={`btn ${pageNum === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setPageNum(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setPageNum((current) => current + 1)}
                  disabled={pageNum === totalPages || totalPages === 0}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookList
