import { useEffect, useMemo, useState } from 'react';

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

interface UseCartReturn {
    cartItems: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
    itemCount: number;
    isLoading: boolean;
    isAuthenticated: boolean;
    addToCart: (product: {
        id: number;
        name: string;
        price: number;
        image: string;
        slug: string;
    }, quantity?: number, color?: string) => boolean;
    updateQuantity: (itemId: string, quantity: number) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    getCartData: () => any;
    updateTrigger: number;
}

const CART_STORAGE_KEY = 'toko_tas_berkah_cart';

export function useCart(): UseCartReturn {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    
    // Create unique instance ID for debugging
    const instanceId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

    // Force re-render function
    const forceUpdate = () => {
        console.log(`🔄 Force update triggered for instance ${instanceId}`);
        setUpdateTrigger(prev => prev + 1);
    };

    // Load cart from localStorage on mount
    useEffect(() => {
        loadCartFromStorage();
    }, []);

    // Save cart to localStorage whenever cartItems change
    useEffect(() => {
        console.log('💾 Cart items changed, saving to localStorage:', cartItems);
        saveCartToStorage(cartItems);
    }, [cartItems]);

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
        }
    };

    const saveCartToStorage = (items: CartItem[]) => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    };

    // Calculate totals with useMemo to ensure reactivity
    const subtotal = useMemo(() => 
        cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
        [cartItems]
    );
    const shipping = useMemo(() => 
        subtotal > 400000 ? 0 : 25000, 
        [subtotal]
    );
    const total = useMemo(() => 
        subtotal + shipping, 
        [subtotal, shipping]
    );
    const itemCount = useMemo(() => {
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        console.log(`🔢 [${instanceId}] Calculating itemCount:`, { cartItems, count, updateTrigger });
        return count;
    }, [cartItems, instanceId, updateTrigger]);

    const addToCart = (product: {
        id: number;
        name: string;
        price: number;
        image: string;
        slug: string;
    }, quantity: number = 1, color?: string) => {
        console.log(`🛒 [${instanceId}] Adding to cart:`, { product, quantity, color });
        setIsLoading(true);
        
        try {
            const cartId = `${product.id}-${color || 'default'}`;
            
            // Use functional update to ensure we get the latest state
            setCartItems(prevItems => {
                console.log(`📦 [${instanceId}] Previous items in functional update:`, prevItems);
                
                const existingItemIndex = prevItems.findIndex(item => item.id === cartId);
                
                let newItems: CartItem[];
                
                if (existingItemIndex >= 0) {
                    console.log(`✅ [${instanceId}] Item exists, updating quantity`);
                    // Update quantity if item already exists
                    newItems = prevItems.map((item, index) =>
                        index === existingItemIndex
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    console.log(`🆕 [${instanceId}] Adding new item`);
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
                    newItems = [...prevItems, newItem];
                }
                
                console.log(`🔄 [${instanceId}] Returning new items:`, newItems);
                
                // Schedule force update after state is set
                setTimeout(() => {
                    console.log(`⏰ [${instanceId}] Triggering force update...`);
                    forceUpdate();
                }, 100);
                
                return newItems;
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
        getCartData,
        updateTrigger // Add this for forcing re-renders
    };
}
