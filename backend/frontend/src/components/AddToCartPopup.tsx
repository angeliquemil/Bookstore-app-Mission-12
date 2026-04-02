import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

// Define the type for the onClose prop
interface AddToCartPopupProps {
  onClose: () => void;
  title: string;
  bookId: string;
  price: string;
}

function AddToCartPopup({
  onClose,
  title,
  bookId,
  price,
}: AddToCartPopupProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId),
      title: title || 'No project found',
      price: Number(price),
    };
    addToCart(newItem);
    onClose(); // Close modal after adding to cart
  };

  console.log(`Cart popup book is ${bookId}: ${title}`);

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-secondary bg-opacity-25 d-flex justify-content-center align-items-center"
      style={{ zIndex: 1000 }}
    >
      <div className="bg-white p-4 rounded text-center">
        <h2>Add {title}</h2>
        <div>
          <p>${price}</p>
          <button className="btn btn-primary" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
        <button className="btn btn-secondary mt-3" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default AddToCartPopup;
