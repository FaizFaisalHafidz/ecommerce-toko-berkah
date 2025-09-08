import CustomerLayout from '@/components/customer/CustomerLayout';
import ProductCard from '@/components/customer/ProductCard';
import { router } from '@inertiajs/react';
import { Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface CatalogProps {
    products: {
        data: Array<{
            id: number;
            name: string;
            price: string;
            originalPrice?: number;
            discount?: number;
            image: string;
            images: string[];
            category: string;
            rating: string;
            reviews: number;
            inStock: boolean;
            isNew: boolean;
            slug: string;
        }>;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    categories: Array<{
        id: number;
        name: string;
        count: number;
        slug: string;
    }>;
    filters: {
        category?: string;
        price_min?: number;
        price_max?: number;
        search?: string;
    };
}

export default function Catalog({ products, categories, filters }: CatalogProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('featured');

    const handleFilterChange = (key: string, value: string | number | null) => {
        const newFilters = { ...filters };
        
        if (value === null || value === '') {
            delete newFilters[key as keyof typeof filters];
        } else {
            (newFilters as any)[key] = value;
        }

        router.get('/products', newFilters, {
            preserveState: true,
            replace: true
        });
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        // Here you would typically make a request with the new sort parameter
        // For now, we'll just update the state
    };

    const clearFilters = () => {
        router.get('/products', {}, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <CustomerLayout title="Produk - Toko Tas Berkah">
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-light text-gray-900 lg:text-3xl">
                            Semua Produk
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {products.data.length} produk ditemukan
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        >
                            <option value="featured">Unggulan</option>
                            <option value="price-low">Harga: Rendah ke Tinggi</option>
                            <option value="price-high">Harga: Tinggi ke Rendah</option>
                            <option value="newest">Terbaru</option>
                            <option value="rating">Rating Terbaik</option>
                        </select>

                        {/* View Mode Buttons */}
                        <div className="hidden sm:flex border border-gray-200 rounded">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 ${
                                    viewMode === 'grid'
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 ${
                                    viewMode === 'list'
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 border border-gray-200 rounded px-3 py-2 text-sm hover:border-gray-300 lg:hidden"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <aside className={`
                        ${showFilters ? 'block' : 'hidden'} 
                        lg:block w-full lg:w-64 space-y-6
                        ${showFilters ? 'fixed inset-0 z-50 bg-white p-4 overflow-y-auto' : ''}
                        lg:relative lg:inset-auto lg:z-auto lg:bg-transparent lg:p-0
                    `}>
                        {/* Mobile Filter Header */}
                        <div className="flex items-center justify-between lg:hidden">
                            <h2 className="text-lg font-medium text-gray-900">Filter</h2>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-2"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Categories Filter */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Kategori</h3>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={!filters.category}
                                        onChange={() => handleFilterChange('category', null)}
                                        className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Semua Kategori</span>
                                </label>
                                {categories.map((category) => (
                                    <label key={category.id} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={filters.category === category.slug}
                                            onChange={() => handleFilterChange('category', category.slug)}
                                            className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            {category.name} ({category.count})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Rentang Harga</h3>
                            <div className="space-y-3">
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Harga minimum"
                                        value={filters.price_min || ''}
                                        onChange={(e) => handleFilterChange('price_min', e.target.value ? parseInt(e.target.value) : null)}
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Harga maksimum"
                                        value={filters.price_max || ''}
                                        onChange={(e) => handleFilterChange('price_max', e.target.value ? parseInt(e.target.value) : null)}
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {(filters.category || filters.price_min || filters.price_max) && (
                            <button
                                onClick={clearFilters}
                                className="w-full text-sm text-gray-600 hover:text-gray-900 underline"
                            >
                                Hapus Semua Filter
                            </button>
                        )}
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {products.data.length > 0 ? (
                            <div className={
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                                    : 'space-y-6'
                            }>
                                {products.data.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        className={viewMode === 'list' ? 'flex gap-4' : ''}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Filter className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Tidak ada produk ditemukan
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Coba sesuaikan pencarian atau kriteria filter Anda
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm font-medium text-gray-900 hover:text-gray-600 underline"
                                >
                                    Hapus filter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
