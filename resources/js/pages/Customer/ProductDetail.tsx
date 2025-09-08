import CustomerLayout from '@/components/customer/CustomerLayout';
import ProductCard from '@/components/customer/ProductCard';
import { useCart } from '@/hooks/useCart';
import { Award, Heart, RotateCcw, Shield, ShoppingCart, Star, Truck } from 'lucide-react';
import { useState } from 'react';

interface ProductDetailProps {
    product: {
        id: number;
        name: string;
        description: string;
        shortDescription: string;
        price: number;
        originalPrice?: number;
        discount?: number;
        sku: string;
        category: string;
        rating: number;
        reviewCount: number;
        stock: number;
        weight: number;
        dimensions: string;
        material: string;
        colors: string[];
        tags: string[];
        isNew: boolean;
        isFeatured: boolean;
        images: Array<{
            url: string;
            alt: string;
            primary: boolean;
        }>;
        reviews: Array<{
            id: number;
            user: string;
            rating: number;
            comment: string;
            date: string;
        }>;
    };
    relatedProducts: Array<{
        id: number;
        name: string;
        price: number;
        image: string;
        rating: number;
        reviews: number;
        slug: string;
    }>;
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    
    const { addToCart, isLoading, isAuthenticated } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleAddToCart = () => {
        const primaryImage = product.images.find(img => img.primary)?.url || product.images[0]?.url || '/images/placeholder.jpg';
        
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: primaryImage,
            slug: product.sku // Use SKU as slug since slug doesn't exist
        }, quantity, selectedColor);
        
        // Show success message (since addToCart is now synchronous)
        console.log('Product added to cart successfully');
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        // TODO: Implement wishlist API call
    };

    return (
        <CustomerLayout title={`${product.name} - Toko Tas Berkah`}>
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm">
                    <ol className="flex items-center space-x-2">
                        <li><a href="/" className="text-gray-500 hover:text-gray-900">Beranda</a></li>
                        <li><span className="text-gray-400">/</span></li>
                        <li><a href="/products" className="text-gray-500 hover:text-gray-900">Produk</a></li>
                        <li><span className="text-gray-400">/</span></li>
                        <li><span className="text-gray-900">{product.name}</span></li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square overflow-hidden bg-gray-100 rounded-lg">
                            <img
                                src={product.images[selectedImage]?.url}
                                alt={product.images[selectedImage]?.alt}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>

                        {/* Thumbnail Images */}
                        {product.images.length > 1 && (
                            <div className="flex space-x-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative aspect-square w-20 overflow-hidden rounded-lg border-2 ${
                                            selectedImage === index
                                                ? 'border-gray-900'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.alt}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Product Title & Badges */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                {product.isNew && (
                                    <span className="bg-black text-white px-2 py-1 text-xs font-medium">BARU</span>
                                )}
                                {product.isFeatured && (
                                    <span className="bg-yellow-500 text-black px-2 py-1 text-xs font-medium">UNGGULAN</span>
                                )}
                                {product.discount && product.discount > 0 && (
                                    <span className="bg-red-600 text-white px-2 py-1 text-xs font-medium">
                                        -{product.discount}%
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl font-light text-gray-900 lg:text-3xl">
                                {product.name}
                            </h1>
                            <p className="text-sm text-gray-500 uppercase tracking-wide mt-1">
                                {product.category}
                            </p>
                        </div>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                            i < Math.floor(product.rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-200'
                                        }`}
                                    />
                                ))}
                                <span className="text-sm font-medium ml-2">{product.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">({product.reviewCount} ulasan)</span>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-light text-gray-900">
                                    {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-lg text-gray-500 line-through">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">
                                SKU: {product.sku} | Stok: {product.stock} tersedia
                            </p>
                        </div>

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 1 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-900">Warna</h3>
                                <div className="flex gap-2">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-3 py-2 text-sm border rounded ${
                                                selectedColor === color
                                                    ? 'border-gray-900 bg-gray-900 text-white'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-900">Jumlah</h3>
                            <div className="flex items-center border border-gray-300 rounded w-fit">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-2 hover:bg-gray-50"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="px-3 py-2 hover:bg-gray-50"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={isLoading || product.stock === 0}
                                className="flex-1 bg-gray-900 text-white px-8 py-3 font-medium uppercase tracking-wide hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                {isLoading ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                            </button>
                            <button
                                onClick={toggleWishlist}
                                className="px-4 py-3 border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                            <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-gray-400" />
                                <span className="text-xs text-gray-600">Gratis Ongkir</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-gray-400" />
                                <span className="text-xs text-gray-600">Garansi 1 Tahun</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RotateCcw className="h-4 w-4 text-gray-400" />
                                <span className="text-xs text-gray-600">30 Hari Return</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-gray-400" />
                                <span className="text-xs text-gray-600">100% Original</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="border-t pt-16">
                    <div className="space-y-8">
                        {/* Description */}
                        <div>
                            <h2 className="text-xl font-light text-gray-900 mb-4">Deskripsi Produk</h2>
                            <div className="prose max-w-none text-gray-600">
                                <p>{product.description}</p>
                                
                                {/* Specifications */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Spesifikasi</h3>
                                        <dl className="space-y-2">
                                            <div className="flex justify-between">
                                                <dt className="text-sm text-gray-600">Material</dt>
                                                <dd className="text-sm text-gray-900">{product.material}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm text-gray-600">Dimensi</dt>
                                                <dd className="text-sm text-gray-900">{product.dimensions}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm text-gray-600">Berat</dt>
                                                <dd className="text-sm text-gray-900">{product.weight}g</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        {product.reviews && product.reviews.length > 0 && (
                            <div>
                                <h2 className="text-xl font-light text-gray-900 mb-4">Ulasan Pelanggan</h2>
                                <div className="space-y-6">
                                    {product.reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-200 pb-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-900">{review.user}</h4>
                                                <span className="text-sm text-gray-500">{review.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3 w-3 ${
                                                            i < review.rating
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-200'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-gray-600">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="border-t pt-16 mt-16">
                        <h2 className="text-2xl font-light text-gray-900 mb-8">Produk Terkait</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={{
                                        ...product,
                                        category: '',
                                        inStock: true,
                                        isNew: false
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
