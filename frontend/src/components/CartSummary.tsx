import { useCart } from '../context/CartContext';

interface CartProps {
  onContinueShopping: () => void;
}

function Cart({ onContinueShopping }: CartProps) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <>
        <div className="hero-banner">
          <div className="container">
            <h1>Shopping Cart</h1>
            <p className="lead">Review your selected books before checking out.</p>
          </div>
        </div>
        <div className="container py-4">
          <div className="content-card text-center py-5">
            <p className="fs-1 mb-2">🛒</p>
            <h4 className="mb-3">Your cart is empty</h4>
            <p className="text-muted mb-4">Add some books from our collection to get started.</p>
            <button className="btn btn-primary" onClick={onContinueShopping}>
              &larr; Browse Books
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Hero banner */}
      <div className="hero-banner">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p className="lead">Review your selected books before checking out.</p>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">

          {/* Cart items */}
          <div className="col-lg-8">
            <div className="content-card">
              <h5 className="fw-bold mb-3 border-bottom pb-2">Your Items</h5>
              <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Title</th>
                      <th style={{ width: '150px' }}>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.bookID}>
                        <td>{item.title}</td>
                        <td>
                          <div className="input-group input-group-sm">
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                updateQuantity(item.bookID, item.quantity - 1)
                              }
                            >
                              −
                            </button>
                            <input
                              type="number"
                              className="form-control text-center"
                              value={item.quantity}
                              min={1}
                              onChange={(e) =>
                                updateQuantity(item.bookID, Number(e.target.value))
                              }
                            />
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                updateQuantity(item.bookID, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>${item.price.toFixed(2)}</td>
                        <td className="fw-semibold">${(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeFromCart(item.bookID)}
                            title="Remove"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <button className="btn btn-outline-secondary" onClick={onContinueShopping}>
                  &larr; Continue Shopping
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-header text-white fw-bold" style={{ backgroundColor: '#1a1a2e' }}>
                Order Summary
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush mb-3">
                  {cartItems.map((item) => (
                    <li
                      key={item.bookID}
                      className="list-group-item d-flex justify-content-between px-0"
                    >
                      <span className="text-truncate me-2" style={{ maxWidth: '180px' }}>
                        {item.title} &times;{item.quantity}
                      </span>
                      <span className="fw-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-2">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="card-footer d-grid gap-2 bg-white border-top-0">
                <button className="btn btn-success btn-lg">Checkout</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Cart;