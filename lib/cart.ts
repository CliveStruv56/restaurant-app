
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  notes?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  pickupTime?: string;
  notes?: string;
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function addToCart(cart: Cart, item: Omit<CartItem, 'quantity'>, quantity: number = 1): Cart {
  const existingItemIndex = cart.items.findIndex(cartItem => cartItem.id === item.id);
  
  if (existingItemIndex >= 0) {
    const updatedItems = [...cart.items];
    updatedItems[existingItemIndex].quantity += quantity;
    return {
      items: updatedItems,
      total: calculateCartTotal(updatedItems)
    };
  }
  
  const newItems = [...cart.items, { ...item, quantity }];
  return {
    items: newItems,
    total: calculateCartTotal(newItems)
  };
}

export function removeFromCart(cart: Cart, itemId: string): Cart {
  const updatedItems = cart.items.filter(item => item.id !== itemId);
  return {
    items: updatedItems,
    total: calculateCartTotal(updatedItems)
  };
}

export function updateCartItemQuantity(cart: Cart, itemId: string, quantity: number): Cart {
  if (quantity <= 0) {
    return removeFromCart(cart, itemId);
  }
  
  const updatedItems = cart.items.map(item =>
    item.id === itemId ? { ...item, quantity } : item
  );
  
  return {
    items: updatedItems,
    total: calculateCartTotal(updatedItems)
  };
}

export function updateCartPickupTime(cart: Cart, pickupTime: string): Cart {
  return {
    ...cart,
    pickupTime
  };
}

export function updateCartNotes(cart: Cart, notes: string): Cart {
  return {
    ...cart,
    notes
  };
}

export function clearCart(): Cart {
  return {
    items: [],
    total: 0,
    pickupTime: undefined,
    notes: undefined
  };
}
