import CustomerLayout from '@/components/customer/CustomerLayout';
import { Link } from '@inertiajs/react';
import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';

interface CartItem {
    id: number;
    product_id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    total: number;
}

interface CartProps {
    cartItems: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
}

export default function Cart({ cartItems, subtotal, shipping, total }: CartProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const updateQuantity = (itemId: number, newQuantity: number) => {
        // TODO: Implement cart update logic
        console.log(`Update item ${itemId} to quantity ${newQuantity}`);
    };

    const removeItem = (itemId: number) => {
        // TODO: Implement remove item logic
        console.log(`Remove item ${itemId}`);
    };

    return (
        <CustomerLayout title="Keranjang Belanja - Toko Tas Berkah">
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-12">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm">
                        <li>
                            <Link href="/" className="text-gray-500 hover:text-gray-700">
                                Beranda
                            </Link>
                        </li>
                        <li className="text-gray-400">/</li>
                        <li className="text-gray-900 font-medium">Keranjang Belanja</li>
                    </ol>
                </nav>

                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-2xl font-light text-gray-900 lg:text-3xl">
                        Keranjang Belanja
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {cartItems.length} {cartItems.length === 1 ? 'produk' : 'produk'} di keranjang Anda
                    </p>
                </div>

                {cartItems.length > 0 ? (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-8">
                            <div className="space-y-6">
                                {cartItems.map((item, index) => (
                                    <div key={item.id} className={`
                                        flex gap-4 p-4 border border-gray-200 rounded-lg
                                        ${index === cartItems.length - 1 ? '' : 'border-b border-gray-200'}
                                    `}>
                                        {/* Product Image */}
                                        <Link href={`/products/${item.product_id}`} className="flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-24 h-24 object-cover rounded-md bg-gray-100"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/images/products/tote-elegant-brown.jpg';
                                                }}
                                            />
                                        </Link>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link 
                                                href={`/products/${item.product_id}`}
                                                className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 mb-2"
                                            >
                                                {item.name}
                                            </Link>
                                            
                            <p className="text-gray-600 mb-4">
                                {formatPrice(item.price)} per produk
                            </p>                                            <div className="flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center border border-gray-300 rounded">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="px-3 py-2 hover:bg-gray-50 transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4 text-gray-500" />
                                                    </button>
                                                    <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 py-2 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4 text-gray-500" />
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="text-sm">Hapus</span>
                                                </button>
                                            </div>

                                            {/* Item Total */}
                                            <p className="text-lg font-semibold text-gray-900 mt-3">
                                                {formatPrice(item.total)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Continue Shopping */}
                            <div className="mt-8">
                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    ← Lanjut Belanja
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4 mt-8 lg:mt-0">
                            <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Ringkasan Pesanan
                                </h2>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} produk)</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Ongkos Kirim</span>
                                        <span>{formatPrice(shipping)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between text-lg font-semibold text-gray-900">
                                            <span>Total</span>
                                            <span>{formatPrice(total)}</span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full mt-6 bg-gray-900 text-white px-6 py-3 text-sm font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
                                >
                                    Lanjut ke Pembayaran
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                {/* Payment Methods */}
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-gray-500 mb-2">Kami menerima</p>
                                    <div className="flex justify-center gap-2">
                                        <div className="bg-white border border-gray-200 px-3 py-2 rounded text-xs font-medium">
                                            Transfer Bank
                                        </div>
                                        <div className="bg-white border border-gray-200 px-3 py-2 rounded text-xs font-medium">
                                            COD
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty Cart */
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <Trash2 className="h-10 w-10 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-light text-gray-900 mb-4">
                            Keranjang Anda kosong
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Sepertinya Anda belum menambahkan produk apapun ke keranjang. 
                            Mulai jelajahi produk kami untuk menemukan yang Anda suka.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 text-sm font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors"
                        >
                            Mulai Belanja
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
