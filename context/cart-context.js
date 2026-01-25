'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(undefined);

const CART_STORAGE_KEY = 'reddragon_cart';
const TAX_RATE = 0.05; // 5% GST

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setItems(parsed);
                }
            }
        } catch (e) {
            console.error('Failed to load cart:', e);
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
            } catch (e) {
                console.error('Failed to save cart:', e);
            }
        }
    }, [items, isLoaded]);

    // Add item to cart
    const addItem = useCallback((dish, quantity = 1, instructions = '') => {
        setItems(prev => {
            const existingIndex = prev.findIndex(item => item.dishId === dish.id);

            if (existingIndex >= 0) {
                // Update existing item
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity
                };
                return updated;
            }

            // Add new item
            return [...prev, {
                dishId: dish.id,
                name: dish.name,
                price: dish.price,
                image: dish.image,
                category: dish.category,
                quantity,
                instructions
            }];
        });
    }, []);

    // Remove item from cart
    const removeItem = useCallback((dishId) => {
        setItems(prev => prev.filter(item => item.dishId !== dishId));
    }, []);

    // Update item quantity
    const updateQuantity = useCallback((dishId, quantity) => {
        if (quantity <= 0) {
            removeItem(dishId);
            return;
        }

        setItems(prev => prev.map(item =>
            item.dishId === dishId ? { ...item, quantity } : item
        ));
    }, [removeItem]);

    // Update item instructions
    const updateInstructions = useCallback((dishId, instructions) => {
        setItems(prev => prev.map(item =>
            item.dishId === dishId ? { ...item, instructions } : item
        ));
    }, []);

    // Clear cart
    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    // Open/close cart drawer
    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

    // Calculate totals
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + tax;

    const value = {
        items,
        isOpen,
        isLoaded,
        itemCount,
        subtotal,
        tax,
        total,
        addItem,
        removeItem,
        updateQuantity,
        updateInstructions,
        clearCart,
        openCart,
        closeCart,
        toggleCart
    };

    return (
        <CartContext.Provider value={value}>
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

export default CartContext;
