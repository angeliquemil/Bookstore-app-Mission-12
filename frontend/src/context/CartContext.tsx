// CartContext.tsx
// Provides global cart state and functions to manipulate the cart
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Represents an item in the cart
export interface CartItem {
  bookID: number;
  title: string;
  price: number;
  quantity: number;
}
// Defines the context type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: { bookID: number; title: string; price: number }) => void;
  removeFromCart: (bookID: number) => void;
  updateQuantity: (bookID: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

const SESSION_KEY = 'bookstore_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(book: { bookID: number; title: string; price: number }) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.bookID === book.bookID);
      if (existing) {
        return prev.map((item) =>
          item.bookID === book.bookID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  }
  //Removing from the cart by filtering out the item with the specified bookID
  function removeFromCart(bookID: number) {
    setCartItems((prev) => prev.filter((item) => item.bookID !== bookID));
  }
  //Updating the quantity of a cart item. If the quantity is less than 1, it removes the item from the cart
  function updateQuantity(bookID: number, quantity: number) {
    if (quantity < 1) {
      removeFromCart(bookID);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.bookID === bookID ? { ...item, quantity } : item
      )
    );
  }
  //Clears the cart by setting the cartItems state to an empty array
  function clearCart() {
    setCartItems([]);
  }

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  //Provides the cart context to its children components, allowing them to access and manipulate the cart state
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}