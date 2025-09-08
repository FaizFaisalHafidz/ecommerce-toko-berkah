import CustomerLayout from '@/components/customer/CustomerLayout';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, Eye, Package, XCircle } from 'lucide-react';

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
        status: 'processing',
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
    const { auth } = usePage().props as any;

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
                                        <div className="flex space-x-2">
                                            {order.status === 'delivered' && (
                                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                                    Beli Lagi
                                                </button>
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
        </CustomerLayout>
    );
}
