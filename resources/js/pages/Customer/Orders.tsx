import CustomerLayout from '@/components/customer/CustomerLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, Eye, Package, Star, X, XCircle } from 'lucide-react';
import { useState } from 'react';

// Mock data untuk demo - nanti akan diganti dengan data dari API
const mockOrders = [
    {
        id: 'ORD-001',
        date: '2025-09-04',
        status: 'delivered',
        total: 450000,
        items: [
            {
                id: 1,
                name: 'Tas Kulit Premium Classic',
                price: 450000,
                quantity: 1,
                image: '/storage/produk/tas-kulit-premium-classic-1.jpg'
            }
        ]
    },
    {
        id: 'ORD-002',
        date: '2025-09-02',
        status: 'delivered',
        total: 350000,
        items: [
            {
                id: 2,
                name: 'Tas Laptop Professional',
                price: 350000,
                quantity: 1,
                image: '/storage/produk/tas-laptop-professional-1.jpg'
            }
        ]
    },
    {
        id: 'ORD-003',
        date: '2025-08-30',
        status: 'shipped',
        total: 250000,
        items: [
            {
                id: 3,
                name: 'Tas Selempang Urban',
                price: 250000,
                quantity: 1,
                image: '/storage/produk/tas-selempang-urban-1.jpg'
            }
        ]
    }
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'text-yellow-600 bg-yellow-100';
        case 'processing':
            return 'text-blue-600 bg-blue-100';
        case 'shipped':
            return 'text-purple-600 bg-purple-100';
        case 'delivered':
            return 'text-green-600 bg-green-100';
        case 'cancelled':
            return 'text-red-600 bg-red-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'pending':
            return <Clock className="w-4 h-4" />;
        case 'processing':
            return <Package className="w-4 h-4" />;
        case 'shipped':
            return <Package className="w-4 h-4" />;
        case 'delivered':
            return <CheckCircle className="w-4 h-4" />;
        case 'cancelled':
            return <XCircle className="w-4 h-4" />;
        default:
            return <Clock className="w-4 h-4" />;
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Menunggu Pembayaran';
        case 'processing':
            return 'Diproses';
        case 'shipped':
            return 'Dikirim';
        case 'delivered':
            return 'Selesai';
        case 'cancelled':
            return 'Dibatalkan';
        default:
            return status;
    }
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

export default function Orders() {
    const { auth } = usePage().props;
    
    // State untuk modal ulasan
    const [reviewModal, setReviewModal] = useState({
        isOpen: false,
        orderId: '',
        productId: 0,
        productName: '',
        productImage: ''
    });
    
    // State untuk form ulasan
    const [reviewForm, setReviewForm] = useState({
        rating: 0,
        ulasan: '',
        isSubmitting: false
    });

    // Fungsi untuk membuka modal ulasan
    const openReviewModal = (orderId: string, productId: number, productName: string, productImage: string) => {
        setReviewModal({
            isOpen: true,
            orderId,
            productId,
            productName,
            productImage
        });
        setReviewForm({
            rating: 0,
            ulasan: '',
            isSubmitting: false
        });
    };

    // Fungsi untuk menutup modal ulasan
    const closeReviewModal = () => {
        setReviewModal({
            isOpen: false,
            orderId: '',
            productId: 0,
            productName: '',
            productImage: ''
        });
    };

    // Fungsi untuk submit ulasan
    const submitReview = async () => {
        if (reviewForm.rating === 0) {
            alert('Silakan pilih rating terlebih dahulu');
            return;
        }
        
        if (reviewForm.ulasan.trim() === '') {
            alert('Silakan tulis ulasan Anda');
            return;
        }

        setReviewForm(prev => ({ ...prev, isSubmitting: true }));

        try {
            await router.post('/ulasan', {
                produk_id: reviewModal.productId,
                pesanan_id: reviewModal.orderId,
                rating: reviewForm.rating,
                ulasan: reviewForm.ulasan.trim()
            });

            alert('Ulasan berhasil dikirim!');
            closeReviewModal();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Gagal mengirim ulasan. Silakan coba lagi.');
        } finally {
            setReviewForm(prev => ({ ...prev, isSubmitting: false }));
        }
    };

    return (
        <CustomerLayout title="Pesanan Saya - Toko Tas Berkah">
            <Head title="Pesanan Saya" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Pesanan Saya</h1>
                        <p className="text-gray-600 mt-2">Kelola dan lacak pesanan Anda</p>
                    </div>

                    <div className="space-y-6">
                        {mockOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                {/* Order Header */}
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Pesanan {order.id}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(order.date)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span>{getStatusText(order.status)}</span>
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="px-6 py-4">
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-gray-900">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatPrice(item.price)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Footer */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            {order.status === 'delivered' && (
                                                <>
                                                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                                        Beli Lagi
                                                    </button>
                                                    {order.items.map((item) => (
                                                        <button
                                                            key={`review-${item.id}`}
                                                            onClick={() => openReviewModal(order.id, item.id, item.name, item.image)}
                                                            className="px-4 py-2 text-sm font-medium text-white bg-amber-600 border border-amber-600 rounded-md hover:bg-amber-700 transition-colors flex items-center"
                                                        >
                                                            <Star className="w-4 h-4 mr-1" />
                                                            Ulasan {item.name.substring(0, 15)}...
                                                        </button>
                                                    ))}
                                                </>
                                            )}
                                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                                Lihat Detail
                                            </button>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-600">Total: </span>
                                            <span className="font-medium text-gray-900">
                                                {formatPrice(order.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {mockOrders.length === 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Belum Ada Pesanan
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Anda belum memiliki pesanan apapun. Mari mulai berbelanja!
                            </p>
                            <a
                                href="/products"
                                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Mulai Berbelanja
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Ulasan */}
            {reviewModal.isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div 
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={closeReviewModal}
                        ></div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            {/* Header */}
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Beri Ulasan Produk
                                    </h3>
                                    <button
                                        onClick={closeReviewModal}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                    <img
                                        src={reviewModal.productImage}
                                        alt={reviewModal.productName}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            {reviewModal.productName}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Order ID: {reviewModal.orderId}
                                        </p>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rating
                                    </label>
                                    <div className="flex items-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                                className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
                                                    star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                            >
                                                <Star className="w-6 h-6 fill-current" />
                                            </button>
                                        ))}
                                        <span className="ml-2 text-sm text-gray-600">
                                            {reviewForm.rating > 0 ? `${reviewForm.rating} bintang` : 'Pilih rating'}
                                        </span>
                                    </div>
                                </div>

                                {/* Ulasan */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ulasan Anda
                                    </label>
                                    <textarea
                                        value={reviewForm.ulasan}
                                        onChange={(e) => setReviewForm(prev => ({ ...prev, ulasan: e.target.value }))}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                                        placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        {reviewForm.ulasan.length}/500 karakter
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={submitReview}
                                    disabled={reviewForm.isSubmitting || reviewForm.rating === 0}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {reviewForm.isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                                </button>
                                <button
                                    onClick={closeReviewModal}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
