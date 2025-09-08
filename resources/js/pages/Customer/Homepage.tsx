import CategoryCard from '@/components/customer/CategoryCard';
import CustomerLayout from '@/components/customer/CustomerLayout';
import HeroSection from '@/components/customer/HeroSection';
import ProductCard from '@/components/customer/ProductCard';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface HomepageProps {
    featuredProducts: Array<{
        id: number;
        name: string;
        price: number;
        image: string;
        category: string;
    }>;
    categories: Array<{
        name: string;
        count: number;
        image: string;
    }>;
}

export default function Homepage({ featuredProducts, categories }: HomepageProps) {
    return (
        <CustomerLayout title="Toko Tas Berkah - Koleksi Tas Premium">
            {/* Hero Section */}
            <HeroSection />

            {/* Categories Section */}
            <section className="py-16 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 lg:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-light text-gray-900 mb-4 lg:text-4xl">
                            Belanja Berdasarkan Kategori
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Temukan koleksi tas yang sesuai dengan gaya dan kebutuhan Anda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category, index) => (
                            <CategoryCard
                                key={index}
                                category={{
                                    ...category,
                                    image: category.image || `https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`
                                }}
                                href={`/products?category=${category.name.toLowerCase().replace(' ', '-')}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 bg-gray-50 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 lg:px-6">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-light text-gray-900 mb-4 lg:text-4xl">
                                Produk Unggulan
                            </h2>
                            <p className="text-gray-600">
                                Pilihan terbaik dari koleksi kami
                            </p>
                        </div>
                        
                        <Link
                            href="/products"
                            className="hidden lg:inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors group"
                        >
                            Lihat Semua Produk
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {featuredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={{
                                    ...product,
                                    inStock: true,
                                    isNew: Math.random() > 0.7, // Random new badge for demo
                                    rating: 4.5,
                                    reviews: Math.floor(Math.random() * 50) + 5,
                                    image: product.image || `https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`
                                }}
                            />
                        ))}
                    </div>

                    {/* Mobile View All Button */}
                    <div className="text-center mt-12 lg:hidden">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 text-sm font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors group"
                        >
                            Lihat Semua Produk
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-gray-900 text-white lg:py-24">
                <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
                    <h2 className="text-3xl font-light mb-4 lg:text-4xl">
                        Tetap Terhubung
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Dapatkan informasi terbaru tentang koleksi baru, promo eksklusif, 
                        dan tips fashion langsung ke email Anda.
                    </p>
                    
                    <form className="flex flex-col gap-4 max-w-md mx-auto sm:flex-row">
                        <input
                            type="email"
                            placeholder="Masukkan email Anda"
                            className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-white text-gray-900 px-8 py-3 text-sm font-medium uppercase tracking-wide hover:bg-gray-100 transition-colors"
                        >
                            Berlangganan
                        </button>
                    </form>
                    
                    <p className="text-xs text-gray-400 mt-4">
                        Dengan berlangganan, Anda setuju dengan Syarat Layanan dan Kebijakan Privasi kami.
                    </p>
                </div>
            </section>
        </CustomerLayout>
    );
}
