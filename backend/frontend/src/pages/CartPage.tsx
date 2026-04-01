import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import { useState } from 'react';
import './CartPage.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const [toastMessage, setToastMessage] = useState('');

  return (
    <>
      <h2 className="my-4">Your Cart</h2>
      {toastMessage && (
        <div
          className="toast show position-fixed bottom-0 end-0 p-3"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-body">{toastMessage}</div>
        </div>
      )}
      <div className="container">
        {cart.length === 0 ? (
          <div>
            <p>Your cart is empty</p>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/projects')}
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          <div>
            <div className="row">
              <div className="col-md-8">
                <ul className="list-group">
                  {cart.map((item: CartItem) => (
                    <li
                      key={item.bookId}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {item.title}: ${item.price}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          removeFromCart(item.bookId);
                          setToastMessage('Item removed from cart!');
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-4">
                <h3>
                  Total: $
                  {cart
                    .reduce((total, item) => total + item.price, 0)
                    .toFixed(2)}
                </h3>
                <div className="btn-group-vertical w-100">
                  <button
                    className="btn btn-primary mb-2"
                    onClick={() => navigate('/checkout')}
                  >
                    Checkout
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/projects')}
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>

            <div className="carousel-wrapper border rounded p-3 shadow-sm mt-4 bg-white position-relative">
              <div
                id="cart-carousel"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner text-center">
                  {cart.map((item, index) => (
                    <div
                      key={item.bookId}
                      className={`carousel-item ${index === 0 ? 'active' : ''}`}
                    >
                      <div
                        className="d-flex flex-column align-items-center justify-content-center"
                        style={{ height: '150px' }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          {/* Book icon */}
                          <i
                            className="bi bi-book"
                            style={{ fontSize: '2rem' }}
                          ></i>
                          <h5 className="m-0">{item.title}</h5>
                        </div>
                        <p className="mt-2">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom styled controls */}
                <button
                  className="carousel-control-prev custom-carousel-button"
                  type="button"
                  data-bs-target="#cart-carousel"
                  data-bs-slide="prev"
                >
                  <span className="custom-arrow">&#8592;</span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next custom-carousel-button"
                  type="button"
                  data-bs-target="#cart-carousel"
                  data-bs-slide="next"
                >
                  <span className="custom-arrow">&#8594;</span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bootstrap Carousel as a cool feature */}
    </>
  );
}

export default CartPage;
