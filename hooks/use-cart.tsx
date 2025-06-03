
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Cart, CartItem, addToCart, removeFromCart, updateCartItemQuantity, clearCart, calculateCartTotal, updateCartPickupTime, updateCartNotes } from '@/lib/cart';

interface CartContextType {
  cart: Cart;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updatePickupTime: (pickupTime: string) => void;
  updateNotes: (notes: string) => void;
  clear: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, pickupTime: undefined, notes: undefined });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('restaurant-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart({
          items: parsedCart.items || [],
          total: calculateCartTotal(parsedCart.items || []),
          pickupTime: parsedCart.pickupTime || undefined,
          notes: parsedCart.notes || undefined
        });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('restaurant-cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCart(currentCart => addToCart(currentCart, item, quantity));
  };

  const removeItem = (itemId: string) => {
    setCart(currentCart => removeFromCart(currentCart, itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart(currentCart => updateCartItemQuantity(currentCart, itemId, quantity));
  };

  const updatePickupTime = (pickupTime: string) => {
    setCart(currentCart => updateCartPickupTime(currentCart, pickupTime));
  };

  const updateNotes = (notes: string) => {
    setCart(currentCart => updateCartNotes(currentCart, notes));
  };

  const clear = () => {
    setCart(clearCart());
  };

  const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addItem,
      removeItem,
      updateQuantity,
      updatePickupTime,
      updateNotes,
      clear,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
