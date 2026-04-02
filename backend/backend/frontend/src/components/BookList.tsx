import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import './Booklist.css';
import AddToCartPopup from './AddToCartPopup';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [numBooks, setNumBooks] = useState<number>(0);
  const [numPages, setNumPages] = useState<number>(0);
  const [sortByName, setSortByName] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((c) => `bookTypes=${encodeURIComponent(c)}`)
        .join('&');

      const response = await fetch(
        `https://localhost:5000/api/Book?cardsPerPage=${pageSize}&pageNum=${pageNum}&sortByName=${sortByName}${selectedCategories.length ? `&${categoryParams}` : ''}`
      );
      const data = await response.json();
      setBooks(data.books);
      setNumBooks(data.numBooks);
      setNumPages(Math.ceil(numBooks / pageSize));

      console.log(`Response: ${response}`);
      console.log(`Data: ${data}`);
    };

    fetchBooks();
  }, [pageSize, pageNum, numBooks, sortByName, selectedCategories]);

  return (
    <>
      <div>
        <div className="checkbox-container">
          <input
            type="checkbox"
            className="form-check-input"
            id="sortByName"
            checked={sortByName}
            onChange={() => setSortByName(!sortByName)}
          />
          <label htmlFor="sortByName">Sort Alphabetically</label>
        </div>

        <div className="row g-3">
          {books.map((b) => (
            <div className="col-12" key={b.bookId}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">{b.title}</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Author:</strong> {b.author}
                    </li>
                    <li className="list-group-item">
                      <strong>Publisher:</strong> {b.publisher}
                    </li>
                    <li className="list-group-item">
                      <strong>ISBN:</strong> {b.isbn}
                    </li>
                    <li className="list-group-item">
                      <strong>Classification:</strong> {b.classification}
                    </li>
                    <li className="list-group-item">
                      <strong>Category:</strong> {b.category}
                    </li>
                    <li className="list-group-item">
                      <strong>Pages:</strong> {b.pageCount}
                    </li>
                    <li className="list-group-item">
                      <strong>Price:</strong> ${b.price}
                    </li>
                  </ul>

                  <br />
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setSelectedBook(b);
                      console.log(
                        `Selected book set to ${b.bookId}: ${b.title}`
                      );
                    }}
                  >
                    Add to Cart
                  </button>
                  {selectedBook && (
                    <AddToCartPopup
                      onClose={() => setSelectedBook(null)}
                      title={selectedBook.title}
                      bookId={selectedBook.bookId}
                      price={selectedBook.price}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPageNum(pageNum - 1)}
              >
                Previous
              </button>
            </li>
            {[...Array(numPages)].map((_, index) => (
              <li
                key={index + 1}
                className={`page-item ${pageNum === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPageNum(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${pageNum === numPages ? 'disabled' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => setPageNum(pageNum + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-3 text-center">
          <label className="form-label me-2">Results per Page:</label>
          <select
            className="form-select d-inline-block w-auto"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageNum(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default BookList;
