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
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
// Defines the structure of a book object
interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}
// Defines the props expected by the BookList component, including functions for navigation and state management related to browsing and cart interactions
interface BookListProps {
  onGoToCart: () => void;
  savedPage: number;
  savedCategory: string;
  onBrowseStateChange: (page: number, category: string) => void;
}

function BookList({
  onGoToCart,
  savedPage,
  savedCategory,
  onBrowseStateChange,
}: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNum, setPageNum] = useState(savedPage);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [category, setCategory] = useState(savedCategory);
  const [categories, setCategories] = useState<string[]>([]);
  const { addToCart, cartCount, cartTotal, cartItems } = useCart();

  // Load categories once
  useEffect(() => {
    fetch('http://localhost:5123/api/categories')
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  // Load books whenever filters change
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
    const categoryParam = category ? `&category=${encodeURIComponent(category)}` : '';
    fetch(
      `http://localhost:5123/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}${categoryParam}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
        setTotalCount(data.totalCount);
      });
  }, [pageNum, pageSize, sortOrder, category]);

  // Notify parent of browse state changes for "Continue Shopping"
  useEffect(() => {
    onBrowseStateChange(pageNum, category);
  }, [pageNum, category]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = Math.ceil(totalCount / pageSize);

  function handlePageSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPageSize(Number(e.target.value));
    setPageNum(1);
  }

  function toggleSort() {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPageNum(1);
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setCategory(e.target.value);
    setPageNum(1);
  }

  function handleAddToCart(book: Book) {
    addToCart({ bookID: book.bookID, title: book.title, price: book.price });
  }

  return (
    <>
      {/* Hero banner */}
      <div className="hero-banner">
        <div className="container">
          <h1>Browse Our Collection</h1>
          <p className="lead">Thousands of titles across every genre — find your next great read.</p>
        </div>
      </div>

      <div className="container py-4">

        {/* Cart summary alert — shown when cart has items */}
        {cartCount > 0 && (
          <div className="alert alert-success d-flex justify-content-between align-items-center mb-4">
            <span>
              <strong>{cartCount}</strong> item{cartCount !== 1 ? 's' : ''} in
              your cart &mdash; Total: <strong>${cartTotal.toFixed(2)}</strong>
            </span>
            <button className="btn btn-sm btn-success" onClick={onGoToCart}>
              View Cart &rarr;
            </button>
          </div>
        )}

        <div className="content-card">
          {/* Filters row */}
          <div className="row g-3 mb-4 align-items-end">
            {/* Category filter */}
            <div className="col-12 col-md-4 col-lg-3">
              <label htmlFor="categorySelect" className="form-label fw-semibold">
                Filter by Category
              </label>
              <select
                id="categorySelect"
                className="form-select"
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Page size */}
            <div className="col-auto">
              <label htmlFor="pageSizeSelect" className="form-label fw-semibold">
                Results per page
              </label>
              <select
                id="pageSizeSelect"
                className="form-select form-select-sm w-auto"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>

            {/* Active category pill (Bootstrap feature #2) */}
            {category && (
              <div className="col-auto d-flex align-items-end">
                <span className="badge rounded-pill bg-primary fs-6 py-2 px-3">
                  {category}{' '}
                  <button
                    className="btn-close btn-close-white ms-1"
                    style={{ fontSize: '0.6rem' }}
                    aria-label="Clear filter"
                    onClick={() => {
                      setCategory('');
                      setPageNum(1);
                    }}
                  />
                </span>
              </div>
            )}
          </div>

          {/* Book table */}
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>
                    Title{' '}
                    <button
                      className="btn btn-sm btn-outline-light ms-2"
                      onClick={toggleSort}
                    >
                      {sortOrder === 'asc' ? '▲' : '▼'}
                    </button>
                  </th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>ISBN</th>
                  <th>Classification</th>
                  <th>Category</th>
                  <th>Pages</th>
                  <th>Price</th>
                  <th>Add to Cart</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.bookID}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.publisher}</td>
                    <td>{book.isbn}</td>
                    <td>{book.classification}</td>
                    <td>{book.category}</td>
                    <td>{book.pageCount}</td>
                    <td>${book.price.toFixed(2)}</td>
                    <td>
                      {(() => {
                        const qty = cartItems.find((i) => i.bookID === book.bookID)?.quantity ?? 0;
                        return (
                          <button
                            className={`btn btn-sm ${qty > 0 ? 'btn-success' : 'btn-outline-primary'}`}
                            onClick={() => handleAddToCart(book)}
                          >
                            {qty > 0 ? `✓ Added (${qty})` : '+ Add'}
                          </button>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="row align-items-center mt-3">
            <div className="col-auto">
              <span className="text-muted small">
                Page {pageNum} of {totalPages || 1} &nbsp;&mdash;&nbsp;
                {totalCount} book{totalCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="col-auto ms-auto d-flex gap-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setPageNum((p) => p - 1)}
                disabled={pageNum === 1}
              >
                &laquo; Prev
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setPageNum((p) => p + 1)}
                disabled={pageNum >= totalPages}
              >
                Next &raquo;
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default BookList
export default BookList;
