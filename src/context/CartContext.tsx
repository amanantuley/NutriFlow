
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
  lineId: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  customization?: string;
};

export type AddToCartInput = Omit<CartItem, 'lineId'>;

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: AddToCartInput) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isHydrated: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'nutriflow-cart-v1';

const normalizeCustomization = (customization?: string) => customization?.trim() ?? '';

const buildLineId = (item: Pick<CartItem, 'id' | 'restaurantId' | 'customization'>) => {
  const note = normalizeCustomization(item.customization).toLowerCase();
  return `${item.restaurantId}::${item.id}::${note}`;
};

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<CartItem>;
  return (
    typeof candidate.lineId === 'string' &&
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.price === 'number' &&
    typeof candidate.quantity === 'number' &&
    typeof candidate.restaurantId === 'string' &&
    typeof candidate.restaurantName === 'string'
  );
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!storedCart) {
        setIsHydrated(true);
        return;
      }

      const parsed = JSON.parse(storedCart) as unknown;
      if (!Array.isArray(parsed)) {
        setIsHydrated(true);
        return;
      }

      const sanitized = parsed.filter(isCartItem);
      setCart(sanitized);
    } catch {
      setCart([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, isHydrated]);

  const addToCart = (item: AddToCartInput) => {
    const normalizedCustomization = normalizeCustomization(item.customization);
    const lineId = buildLineId({
      id: item.id,
      restaurantId: item.restaurantId,
      customization: normalizedCustomization,
    });

    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.lineId === lineId);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.lineId === lineId
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }

      return [
        ...prev,
        {
          ...item,
          customization: normalizedCustomization,
          lineId,
        },
      ];
    });
  };

  const removeFromCart = (lineId: string) => {
    setCart((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(lineId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.lineId === lineId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
