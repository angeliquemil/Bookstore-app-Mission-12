import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import BookList from './components/BookList'
import CartPage from './pages/CartPage'
import AdminBooksPage from './pages/AdminBooksPage'
import './App.css'

function AppShell() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Bookstore
          </Link>
          <div className="ms-auto d-flex align-items-center gap-3">
            <Link className="nav-link" to="/adminbooks">
              Admin
            </Link>
            <Link className="nav-link" to="/cart">
              Cart
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/adminbooks" element={<AdminBooksPage />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
