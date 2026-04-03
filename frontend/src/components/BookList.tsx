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
    </>
  );
}

export default BookList;