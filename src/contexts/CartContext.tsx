"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface ProjectItem {
  id: string;
  title: string;
  price: number;
  category: string;
  subcategory: string;
  image: string;
  customization: string;
  quantity: number;
}

interface CartContextType {
  cartItems: ProjectItem[];
  addToCart: (item: Omit<ProjectItem, 'customization' | 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateCustomization: (id: string, customization: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<ProjectItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage and calculate totals whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setCartTotal(total);

    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  const addToCart = useCallback((item: Omit<ProjectItem, 'customization' | 'quantity'>) => {
    console.log('addToCart called with:', item);

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex > 0) { // Fix: Check for index >= 0
        console.log('Item already in cart, increasing quantity by 1');
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        console.log('Item not in cart, adding with quantity 1');
        // Create a unique ID by adding a timestamp
        const uniqueId = `${item.id}-${Date.now()}`;
        return [...prevItems, { ...item, id: uniqueId, customization: '', quantity: 1 }];
      }
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  // Update item customization
  const updateCustomization = useCallback((id: string, customization: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, customization } : item
      )
    );
  }, []);

  // Clear the cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateCustomization,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};