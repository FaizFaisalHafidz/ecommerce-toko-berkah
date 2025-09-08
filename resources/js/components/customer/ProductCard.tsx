import { Link } from '@inertiajs/react';
import { Heart, Star } from 'lucide-react';
import React, { useState } from 'react';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        price: string | number;
        originalPrice?: number;
        discount?: number;
        image: string;
        category: string;
        rating?: number | string;
        reviews?: number;
        inStock?: boolean;
        isNew?: boolean;
        slug?: string;
    };
    className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageError, setImageError] = useState(false);

    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(numPrice);
    };

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className={`group relative bg-white ${className}`}>
            <Link href={`/products/${product.slug || product.id}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                    {!imageError ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                            <span className="text-gray-400 text-sm">Tidak ada gambar</span>
                        </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.isNew && (
                            <span className="bg-black text-white px-2 py-1 text-xs font-medium">
                                BARU
                            </span>
                        )}
                        {product.discount && product.discount > 0 && (
                            <span className="bg-red-600 text-white px-2 py-1 text-xs font-medium">
                                -{product.discount}%
                            </span>
                        )}
                        {!product.inStock && (
                            <span className="bg-gray-500 text-white px-2 py-1 text-xs font-medium">
                                HABIS
                            </span>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={toggleWishlist}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                    >
                        <Heart 
                            className={`h-4 w-4 ${
                                isWishlisted 
                                    ? 'fill-red-500 text-red-500' 
                                    : 'text-gray-600 hover:text-red-500'
                            }`} 
                        />
                    </button>

                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded">
                            Lihat Detail
                        </span>
                    </div>
                </div>

                {/* Product Info */}
                <div className="pt-4 space-y-2">
                    {/* Category */}
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {product.category}
                    </p>

                    {/* Product Name */}
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors">
                        {product.name}
                    </h3>

                    {/* Rating & Reviews */}
                    {product.rating && (
                        <div className="flex items-center gap-1">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => {
                                    const rating = typeof product.rating === 'string' ? parseFloat(product.rating) : (product.rating || 0);
                                    return (
                                        <Star
                                            key={i}
                                            className={`h-3 w-3 ${
                                                i < Math.floor(rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-200'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                            <span className="text-xs text-gray-500">
                                ({product.reviews})
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                            {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > (typeof product.price === 'string' ? parseFloat(product.price) : product.price) && (
                            <span className="text-xs text-gray-500 line-through">
                                {formatPrice(product.originalPrice)}
                            </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    {!product.inStock && (
                        <p className="text-xs text-red-600 font-medium">
                            Stok Habis
                        </p>
                    )}
                </div>
            </Link>
        </div>
    );
}
