import { useEffect, useState } from 'react';

interface CartItem {
    id: string; // Unique ID untuk localStorage
    productId: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    color?: string;
    slug: string;
}

const CART_STORAGE_KEY = 'toko_tas_berkah_cart';

export function useCart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        loadCartFromStorage();
    }, []);

    // Save cart to localStorage whenever cartItems change (but only after initialization)
    useEffect(() => {
        if (isInitialized) {
            saveCartToStorage(cartItems);
        }
    }, [cartItems, isInitialized]);

    const loadCartFromStorage = () => {
        try {
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                setCartItems(parsedCart);
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            setCartItems([]);
        } finally {
            setIsInitialized(true);
        }
    };

    const saveCartToStorage = (items: CartItem[]) => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    };

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 400000 ? 0 : 25000; // Free shipping over 400k
    const total = subtotal + shipping;
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const addToCart = (product: {
        id: number;
        name: string;
        price: number;
        image: string;
        slug: string;
    }, quantity: number = 1, color?: string) => {
        setIsLoading(true);
        
        try {
            const cartId = `${product.id}-${color || 'default'}`;
            
            setCartItems(prevItems => {
                const existingItem = prevItems.find(item => item.id === cartId);
                
                if (existingItem) {
                    // Update quantity if item already exists
                    return prevItems.map(item =>
                        item.id === cartId
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    // Add new item
                    const newItem: CartItem = {
                        id: cartId,
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: quantity,
                        color: color,
                        slug: product.slug
                    };
                    return [...prevItems, newItem];
                }
            });
            
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const removeFromCart = (itemId: string) => {
        setCartItems(prevItems => 
            prevItems.filter(item => item.id !== itemId)
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem(CART_STORAGE_KEY);
    };

    const getCartData = () => {
        return {
            items: cartItems,
            subtotal,
            shipping,
            total,
            itemCount
        };
    };

    return {
        cartItems,
        subtotal,
        shipping,
        total,
        itemCount,
        isLoading,
        isAuthenticated: true, // Always true since no login required
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartData
    };
}
