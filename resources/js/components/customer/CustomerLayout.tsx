import { useCart } from '@/hooks/useCart';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronDown, LogOut, Menu, Package, Search, ShoppingBag, User, X } from 'lucide-react';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import CartSidebar from './CartSidebar';

interface CustomerLayoutProps extends PropsWithChildren {
    title?: string;
    description?: string;
}

export default function CustomerLayout({ 
    children, 
    title = 'Toko Tas Berkah',
    description = 'Koleksi tas berkualitas premium untuk gaya hidup Anda'
}: CustomerLayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const { auth } = usePage().props as any;
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    
    // Cart hook
    const { 
        cartItems, 
        subtotal, 
        shipping, 
        total, 
        itemCount, 
        isLoading,
        isAuthenticated,
        updateQuantity,
        removeFromCart,
        updateTrigger
    } = useCart();

    // Debug logging for cart changes
    useEffect(() => {
        console.log('🏪 CustomerLayout - Cart state changed:', { 
            itemCount, 
            cartItemsLength: cartItems.length,
            cartItems,
            updateTrigger
        });
    }, [itemCount, cartItems, updateTrigger]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
                        <Head title={title}>
                <meta name="description" content={description} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link 
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
                    rel="stylesheet" 
                />
            </Head>

            <div className="min-h-screen bg-white font-['Inter']">
                {/* Header */}
                <header className="border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-50">
                    <div className="mx-auto max-w-7xl">
                        {/* Top Bar */}
                        <div className="flex items-center justify-between px-4 py-4 lg:px-6">
                            {/* Mobile Menu Button */}
                            <button 
                                onClick={toggleMenu}
                                className="lg:hidden p-2 -ml-2"
                            >
                                {isMenuOpen ? (
                                    <X className="h-5 w-5 text-gray-900" />
                                ) : (
                                    <Menu className="h-5 w-5 text-gray-900" />
                                )}
                            </button>

                            {/* Logo */}
                            <Link 
                                href="/" 
                                className="flex items-center space-x-2 text-xl font-bold text-gray-900 lg:text-2xl"
                            >
                                <ShoppingBag className="h-6 w-6 lg:h-7 lg:w-7" />
                                <span>TAS BERKAH</span>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden lg:flex items-center space-x-8">
                                <Link 
                                    href="/" 
                                    className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                                >
                                    BERANDA
                                </Link>
                                <Link 
                                    href="/products" 
                                    className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                                >
                                    PRODUK
                                </Link>
                                <Link 
                                    href="/products?category=tote" 
                                    className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                                >
                                    TAS TOTE
                                </Link>
                                <Link 
                                    href="/products?category=sling" 
                                    className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                                >
                                    TAS SELEMPANG
                                </Link>
                                <Link 
                                    href="/products?category=backpack" 
                                    className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                                >
                                    TAS RANSEL
                                </Link>
                            </nav>

                            {/* Right Actions */}
                            <div className="flex items-center space-x-4">
                                {/* Search Button */}
                                <button 
                                    onClick={toggleSearch}
                                    className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                                >
                                    <Search className="h-5 w-5 text-gray-700" />
                                </button>

                                {/* User Account */}
                                {auth?.user ? (
                                    <div className="relative" ref={profileDropdownRef}>
                                        <button
                                            onClick={toggleProfileDropdown}
                                            className="flex items-center space-x-1 p-2 hover:bg-gray-50 rounded-full transition-colors"
                                        >
                                            <User className="h-5 w-5 text-gray-700" />
                                            <ChevronDown className="h-3 w-3 text-gray-500" />
                                        </button>

                                        {/* Profile Dropdown */}
                                        {isProfileDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                                <div className="py-1">
                                                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                                                        {auth.user.name}
                                                    </div>
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                    >
                                                        <User className="h-4 w-4 mr-2" />
                                                        Profile
                                                    </Link>
                                                    <Link
                                                        href="/orders"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                    >
                                                        <Package className="h-4 w-4 mr-2" />
                                                        Pesanan Saya
                                                    </Link>
                                                    <Link
                                                        href="/logout"
                                                        method="post"
                                                        as="button"
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-t"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                    >
                                                        <LogOut className="h-4 w-4 mr-2" />
                                                        Logout
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link 
                                        href="/track-order"
                                        className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                                    >
                                        CEK PESANAN
                                    </Link>
                                )}

                                {/* Shopping Cart */}
                                <div className="relative">
                                    <button 
                                        onClick={toggleCart}
                                        className="p-2 hover:bg-gray-50 rounded-full transition-colors relative group"
                                    >
                                        <ShoppingBag className="h-5 w-5 text-gray-700" />
                                        {itemCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                                {itemCount}
                                            </span>
                                        )}
                                        
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                {itemCount > 0 ? `${itemCount} barang dalam keranjang` : 'Keranjang kosong'}
                                                <div className="absolute top-full right-2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        {isMenuOpen && (
                            <div className="lg:hidden border-t border-gray-100 bg-white">
                                <nav className="px-4 py-4 space-y-3">
                                    <Link 
                                        href="/" 
                                        className="block text-base font-medium text-gray-900 py-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        BERANDA
                                    </Link>
                                    <Link 
                                        href="/products" 
                                        className="block text-base font-medium text-gray-900 py-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        SEMUA PRODUK
                                    </Link>
                                    <Link 
                                        href="/products?category=tote" 
                                        className="block text-base font-medium text-gray-900 py-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        TAS TOTE
                                    </Link>
                                    <Link 
                                        href="/products?category=sling" 
                                        className="block text-base font-medium text-gray-900 py-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        TAS SELEMPANG
                                    </Link>
                                    <Link 
                                        href="/products?category=backpack" 
                                        className="block text-base font-medium text-gray-900 py-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        TAS RANSEL
                                    </Link>
                                </nav>
                            </div>
                        )}

                        {/* Search Bar */}
                        {isSearchOpen && (
                            <div className="border-t border-gray-100 bg-white p-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari produk..."
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                        autoFocus
                                    />
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-gray-50 border-t border-gray-100">
                    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div className="md:col-span-2">
                                <div className="flex items-center space-x-2 mb-4">
                                    <ShoppingBag className="h-6 w-6" />
                                    <h3 className="text-lg font-bold text-gray-900">TAS BERKAH</h3>
                                </div>
                                <p className="text-gray-600 mb-4 max-w-md">
                                    Koleksi tas berkualitas premium untuk gaya hidup modern Anda. 
                                    Dibuat dengan material terbaik dan desain yang timeless.
                                </p>
                                <div className="text-sm text-gray-500">
                                    <p>Jl. Cicukang, Desa. Mekarrahayu</p>
                                    <p>Kec. Margaasih, Kab. Bandung</p>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-4">TAUTAN CEPAT</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li><Link href="/" className="hover:text-gray-900">Beranda</Link></li>
                                    <li><Link href="/products" className="hover:text-gray-900">Produk</Link></li>
                                    <li><Link href="/cart" className="hover:text-gray-900">Keranjang</Link></li>
                                    <li><Link href="/contact" className="hover:text-gray-900">Kontak</Link></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-4">KATEGORI</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li><Link href="/products?category=tote" className="hover:text-gray-900">Tas Tote</Link></li>
                                    <li><Link href="/products?category=sling" className="hover:text-gray-900">Tas Selempang</Link></li>
                                    <li><Link href="/products?category=backpack" className="hover:text-gray-900">Tas Ransel</Link></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
                            <p>&copy; 2025 Toko Tas Berkah. All rights reserved.</p>
                        </div>
                    </div>
                </footer>

                {/* Cart Sidebar */}
                <CartSidebar
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    cartItems={cartItems}
                    subtotal={subtotal}
                    shipping={shipping}
                    total={total}
                    isLoading={isLoading}
                    isAuthenticated={isAuthenticated}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromCart}
                />
            </div>
        </>
    );
}
