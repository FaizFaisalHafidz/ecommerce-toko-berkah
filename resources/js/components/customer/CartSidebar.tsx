import { Link, router } from '@inertiajs/react';
import { Loader2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';

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

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
    isLoading?: boolean;
    isAuthenticated: boolean;
    onUpdateQuantity: (itemId: string, quantity: number) => void;
    onRemoveItem: (itemId: string) => void;
}

export default function CartSidebar({
    isOpen,
    onClose,
    cartItems,
    subtotal,
    shipping,
    total,
    isLoading = false,
    isAuthenticated,
    onUpdateQuantity,
    onRemoveItem
}: CartSidebarProps) {
    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(numPrice);
    };

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        onUpdateQuantity(itemId, newQuantity);
    };

    const handleRemoveItem = (itemId: string) => {
        onRemoveItem(itemId);
    };

    const handleCheckout = () => {
        // Validate cart items before checkout
        if (!cartItems || cartItems.length === 0) {
            alert('Keranjang Anda kosong. Silakan tambahkan produk terlebih dahulu.');
            return;
        }

        // Send cart data to checkout page via POST
        router.post('/checkout/view', {
            cart: JSON.stringify({
                items: cartItems,
                subtotal,
                shipping,
                total
            })
        });
        onClose();
    };

    return (
        <>
            {/* Overlay - overlay yang lebih halus */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm z-[55] transition-all duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 right-0 h-full w-full max-w-md bg-white z-[60] transform transition-transform duration-300 ease-in-out shadow-2xl
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-gray-700" />
                            <h2 className="text-lg font-semibold text-gray-900">
                                Keranjang Belanja ({cartItems.length})
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Cart Content */}
                    <div className="flex-1 overflow-y-auto">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Keranjang Kosong
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Belanja sekarang dan temukan koleksi tas terbaik kami.
                                </p>
                                <Link
                                    href="/products"
                                    className="block w-full bg-gray-900 text-white text-center py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors max-w-xs"
                                    onClick={onClose}
                                >
                                    Mulai Belanja
                                </Link>
                            </div>
                        ) : (
                            <div className="p-4 space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                                        {/* Product Image */}
                                        <Link href={`/products/${item.productId}`} className="flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-md bg-gray-100"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/images/products/tote-elegant-brown.jpg';
                                                }}
                                            />
                                        </Link>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link 
                                                href={`/products/${item.productId}`}
                                                className="block text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-2"
                                            >
                                                {item.name}
                                            </Link>
                                            
                                            <p className="text-sm text-gray-600 mt-1">
                                                {formatPrice(item.price)}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-gray-200 rounded">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="p-1 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                        disabled={item.quantity <= 1 || isLoading}
                                                    >
                                                        <Minus className="h-3 w-3 text-gray-500" />
                                                    </button>
                                                    <span className="px-2 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                        disabled={isLoading}
                                                    >
                                                        <Plus className="h-3 w-3 text-gray-500" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="p-1 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>

                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                                Subtotal: {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer with totals and checkout */}
                    {cartItems.length > 0 && (
                        <div className="border-t border-gray-200 p-4 space-y-4">
                            {/* Totals */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Ongkos Kirim</span>
                                    <span>{formatPrice(shipping)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2">
                                    <div className="flex justify-between text-base font-semibold text-gray-900">
                                        <span>Total</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <Link
                                    href="/cart"
                                    onClick={onClose}
                                    className="block w-full text-center border border-gray-300 text-gray-700 px-4 py-3 text-sm font-medium uppercase tracking-wide hover:border-gray-400 transition-colors"
                                >
                                    Lihat Keranjang
                                </Link>
                                <button
                                    onClick={handleCheckout}
                                    className="block w-full text-center bg-gray-900 text-white px-4 py-3 text-sm font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
