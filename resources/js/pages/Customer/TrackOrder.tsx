import CustomerLayout from '@/components/customer/CustomerLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Order {
    id: string;
    nama_penerima: string;
    alamat_lengkap: string;
    kota: string;
    provinsi: string;
    kode_pos: string;
    no_telepon: string;
    email: string;
    metode_pembayaran: string;
    status_pesanan?: string;
    status_pembayaran?: string;
    total_harga: number | string;
    ongkos_kirim: number | string;
    created_at: string;
    detailPesanan: Array<{
        id: number;
        produk: {
            id: number;
            nama: string;
            harga: number;
            gambarProduk: Array<{ url: string; }>;
        };
        jumlah: number;
        harga_saat_beli: number | string;
        ulasan?: {
            id: number;
            rating: number;
            isi_ulasan: string;
            nama_customer: string;
            disetujui: boolean;
            created_at: string;
        } | null;
    }>;
}

export default function TrackOrder() {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // State untuk review forms - setiap produk punya form sendiri
    const [reviewForms, setReviewForms] = useState<{[key: number]: { rating: number; ulasan: string; isSubmitting: boolean; showForm: boolean }}>({});

    // Function untuk menampilkan form review untuk produk tertentu
    const toggleReviewForm = (productId: number) => {
        setReviewForms(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                showForm: !prev[productId]?.showForm,
                rating: prev[productId]?.rating || 0,
                ulasan: prev[productId]?.ulasan || '',
                isSubmitting: prev[productId]?.isSubmitting || false
            }
        }));
    };

    // Function untuk mengubah rating
    const updateRating = (productId: number, rating: number) => {
        setReviewForms(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                rating,
                showForm: prev[productId]?.showForm || false,
                ulasan: prev[productId]?.ulasan || '',
                isSubmitting: prev[productId]?.isSubmitting || false
            }
        }));
    };

    // Function untuk mengubah ulasan
    const updateUlasan = (productId: number, ulasan: string) => {
        setReviewForms(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                ulasan,
                showForm: prev[productId]?.showForm || false,
                rating: prev[productId]?.rating || 0,
                isSubmitting: prev[productId]?.isSubmitting || false
            }
        }));
    };

    // Function untuk submit review
    const submitReview = async (productId: number) => {
        const reviewData = reviewForms[productId];
        
        if (!reviewData) {
            alert('Data review tidak ditemukan');
            return;
        }

        if (reviewData.rating === 0) {
            alert('Rating harus dipilih');
            return;
        }

        if (reviewData.ulasan.trim() === '') {
            alert('Ulasan harus diisi');
            return;
        }

        // Set loading state
        setReviewForms(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                isSubmitting: true
            }
        }));

        try {
            const response = await axios.post('/api/ulasan', {
                pesanan_id: orderId, // Gunakan orderId yang diinput user (nomor_pesanan)
                produk_id: productId,
                rating: reviewData.rating,
                ulasan: reviewData.ulasan.trim()
            });

            if (response.data.success) {
                alert('Ulasan berhasil disimpan!');
                // Reset form dan sembunyikan
                setReviewForms(prev => ({
                    ...prev,
                    [productId]: {
                        rating: 0,
                        ulasan: '',
                        isSubmitting: false,
                        showForm: false
                    }
                }));
                // Refresh data order untuk mendapatkan ulasan terbaru
                searchOrder();
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan ulasan');
        } finally {
            // Reset loading state
            setReviewForms(prev => ({
                ...prev,
                [productId]: {
                    ...prev[productId],
                    isSubmitting: false
                }
            }));
        }
    };    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderIdFromUrl = urlParams.get('order_id');
        
        if (orderIdFromUrl) {
            setOrderId(orderIdFromUrl);
            // Auto track the order
            searchOrder();
        }
    }, []);

    const searchOrder = async () => {
        if (!orderId.trim()) {
            setError('ID pesanan harus diisi');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const response = await axios.get(`/api/track-order/${orderId.trim()}`);
            
            if (response.data.success) {
                setOrder(response.data.data);
                // Reset review forms
                setReviewForms({});
            } else {
                setError('Pesanan tidak ditemukan');
                setOrder(null);
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                setError('Pesanan tidak ditemukan');
            } else {
                setError('Terjadi kesalahan saat mencari pesanan');
            }
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const handleTrackOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        await searchOrder();
    };    const getStatusColor = (status: string | undefined | null) => {
        if (!status) return 'text-gray-600 bg-gray-50 border-gray-200';
        
        switch (status.toLowerCase()) {
            case 'pending':
            case 'menunggu_pembayaran':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'paid':
            case 'dibayar':
            case 'confirmed':
            case 'dikonfirmasi':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'shipped':
            case 'dikirim':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'delivered':
            case 'selesai':
                return 'text-green-700 bg-green-100 border-green-300';
            case 'cancelled':
            case 'dibatalkan':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'belum_dibayar':
                return 'text-orange-600 bg-orange-50 border-orange-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const formatStatus = (status: string | undefined | null) => {
        if (!status) return 'Tidak diketahui';
        
        const statusMap: { [key: string]: string } = {
            'menunggu_pembayaran': 'Menunggu Pembayaran',
            'belum_dibayar': 'Belum Dibayar',
            'dibayar': 'Sudah Dibayar',
            'dikonfirmasi': 'Dikonfirmasi',
            'diproses': 'Diproses',
            'dikirim': 'Dikirim',
            'selesai': 'Selesai',
            'dibatalkan': 'Dibatalkan',
            'pending': 'Pending',
            'paid': 'Dibayar',
            'confirmed': 'Dikonfirmasi',
            'shipped': 'Dikirim',
            'delivered': 'Selesai',
            'cancelled': 'Dibatalkan'
        };
        
        return statusMap[status.toLowerCase()] || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatCurrency = (amount: number | string) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(numAmount);
    };

    const toNumber = (value: number | string): number => {
        return typeof value === 'string' ? parseFloat(value) : value;
    };

    return (
        <CustomerLayout>
            <Head title="Lacak Pesanan - Toko Tas Berkah" />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
                {/* Elegant Background Pattern */}
                <div className="absolute inset-0 bg-opacity-5 bg-gradient-to-r from-gray-600 to-gray-700"></div>
                
                <div className="relative z-10 min-h-screen pt-20 px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Luxury Header */}
                        <div className="text-center mb-16">
                            <div className="flex items-center justify-center mb-6">
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                                <div className="px-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-xl">T</span>
                                    </div>
                                </div>
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                            </div>
                            
                            <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-wider">
                                LACAK PESANAN ANDA
                            </h1>
                            <p className="text-sm text-gray-600 font-medium tracking-widest mb-6">
                                PANTAU STATUS PENGIRIMAN
                            </p>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                Masukkan nomor pesanan Anda untuk melihat status terkini dari pesanan dan pengiriman
                            </p>
                        </div>

                        {/* Elegant Search Form */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-none shadow-2xl p-10 mb-12 border border-gray-200">
                            <form onSubmit={handleTrackOrder} className="space-y-8">
                                <div>
                                    <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-4 tracking-wider uppercase">
                                        Nomor Pesanan
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="orderId"
                                            value={orderId}
                                            onChange={(e) => setOrderId(e.target.value)}
                                            placeholder="Contoh: ORD-2024-001"
                                            className="w-full px-6 py-4 border border-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 text-lg tracking-wide bg-white/80"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-6 bg-red-50 border border-red-200 relative">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-600"></div>
                                        <p className="text-red-600 text-sm tracking-wide">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-4 px-8 hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-widest shadow-xl"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            MENCARI PESANAN...
                                        </span>
                                    ) : (
                                        'CARI PESANAN'
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Luxury Order Details */}
                        {order && (
                            <div className="bg-white/95 backdrop-blur-sm rounded-none shadow-2xl overflow-hidden border border-gray-200">
                                {/* Elegant Order Header */}
                                <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-8">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-3xl font-light mb-3 tracking-wider">Pesanan #{order.id}</h2>
                                            <p className="text-gray-200 tracking-wide">
                                                {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <div className={`inline-block px-4 py-2 rounded-none text-sm font-medium border shadow-lg ${getStatusColor(order.status_pesanan)}`}>
                                                {formatStatus(order.status_pesanan)}
                                            </div>
                                            <div className={`block px-4 py-2 rounded-none text-sm font-medium border shadow-lg ${getStatusColor(order.status_pembayaran)}`}>
                                                Pembayaran: {formatStatus(order.status_pembayaran)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10">
                                    {/* Elegant Customer Information */}
                                    <div className="grid md:grid-cols-2 gap-10 mb-12">
                                        <div>
                                            <div className="flex items-center space-x-3 mb-6">
                                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                                                <h3 className="text-lg font-light text-gray-900 tracking-wider uppercase">Penerima</h3>
                                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                                            </div>
                                            <div className="space-y-3 text-sm leading-relaxed">
                                                <p><span className="font-medium text-gray-600">Nama:</span> <span className="text-gray-700">{order.nama_penerima}</span></p>
                                                <p><span className="font-medium text-gray-600">Telepon:</span> <span className="text-gray-700">{order.no_telepon}</span></p>
                                                <p><span className="font-medium text-gray-600">Email:</span> <span className="text-gray-700">{order.email}</span></p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-3 mb-6">
                                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                                                <h3 className="text-lg font-light text-gray-900 tracking-wider uppercase">Pengiriman</h3>
                                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                                            </div>
                                            <div className="text-sm leading-relaxed text-gray-700">
                                                <p>{order.alamat_lengkap}</p>
                                                <p>{order.kota}, {order.provinsi} {order.kode_pos}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Luxury Order Items */}
                                    <div className="mb-12">
                                        <div className="flex items-center space-x-3 mb-8">
                                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                                            <h3 className="text-lg font-light text-gray-900 tracking-wider uppercase">Produk Dipesan</h3>
                                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                                        </div>
                                        <div className="space-y-6">
                                            {order.detailPesanan.map((item) => (
                                                <div key={item.id} className="border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm">
                                                    {/* Product Info */}
                                                    <div className="flex items-center space-x-6 p-6">
                                                        <img
                                                            src={item.produk.gambarProduk[0]?.url || '/placeholder.jpg'}
                                                            alt={item.produk.nama}
                                                            className="w-20 h-20 object-cover shadow-lg"
                                                        />
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900 mb-2 tracking-wide">{item.produk.nama}</h4>
                                                            <p className="text-sm text-gray-600">
                                                                {formatCurrency(item.harga_saat_beli)} × {item.jumlah}
                                                            </p>
                                                            
                                                            {/* Review Actions */}
                                                            {order.status_pesanan === 'selesai' && (
                                                                <div className="mt-2">
                                                                    {item.ulasan ? (
                                                                        // Jika sudah ada ulasan, tampilkan info
                                                                        <div className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-800 bg-green-100 border border-green-200 rounded-md">
                                                                            <Star className="w-3 h-3 mr-1 text-green-600" />
                                                                            Ulasan telah diberikan
                                                                        </div>
                                                                    ) : (
                                                                        // Jika belum ada ulasan, tampilkan tombol
                                                                        <button
                                                                            onClick={() => toggleReviewForm(item.produk.id)}
                                                                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-amber-600 border border-amber-600 rounded-md hover:bg-amber-700 transition-colors"
                                                                        >
                                                                            <Star className="w-3 h-3 mr-1" />
                                                                            {reviewForms[item.produk.id]?.showForm ? 'Tutup Ulasan' : 'Beri Ulasan'}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium text-gray-900 text-lg">
                                                                {formatCurrency(toNumber(item.harga_saat_beli) * item.jumlah)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Ulasan yang sudah ada - ditampilkan jika ada */}
                                                    {item.ulasan && (
                                                        <div className="border-t border-gray-200 bg-green-50 p-6">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <h5 className="text-md font-medium text-gray-900">Ulasan Anda</h5>
                                                                    <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                                                        item.ulasan.disetujui 
                                                                            ? 'text-green-800 bg-green-100 border border-green-200' 
                                                                            : 'text-yellow-800 bg-yellow-100 border border-yellow-200'
                                                                    }`}>
                                                                        {item.ulasan.disetujui ? 'Disetujui' : 'Menunggu Persetujuan'}
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Rating yang diberikan */}
                                                                <div className="flex items-center space-x-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Star 
                                                                            key={star}
                                                                            className={`w-4 h-4 ${
                                                                                star <= item.ulasan!.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                                            }`}
                                                                        />
                                                                    ))}
                                                                    <span className="ml-2 text-sm text-gray-600">
                                                                        {item.ulasan.rating} dari 5 bintang
                                                                    </span>
                                                                </div>

                                                                {/* Isi ulasan */}
                                                                <div className="bg-white p-4 rounded-md border border-gray-200">
                                                                    <p className="text-gray-700 text-sm leading-relaxed">
                                                                        {item.ulasan.isi_ulasan}
                                                                    </p>
                                                                </div>

                                                                <div className="text-xs text-gray-500">
                                                                    Dikirim pada {item.ulasan.created_at}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Review Form - Inline (hanya tampil jika belum ada ulasan) */}
                                                    {order.status_pesanan === 'selesai' && !item.ulasan && reviewForms[item.produk.id]?.showForm && (
                                                        <div className="border-t border-gray-200 bg-white p-6">
                                                            <div className="space-y-4">
                                                                <h5 className="text-md font-medium text-gray-900">Ulasan untuk {item.produk.nama}</h5>
                                                                
                                                                {/* Rating */}
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        Rating
                                                                    </label>
                                                                    <div className="flex items-center space-x-1">
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <button
                                                                                key={star}
                                                                                onClick={() => updateRating(item.produk.id, star)}
                                                                                className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
                                                                                    star <= (reviewForms[item.produk.id]?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                                                                                }`}
                                                                            >
                                                                                <Star className="w-5 h-5 fill-current" />
                                                                            </button>
                                                                        ))}
                                                                        <span className="ml-2 text-sm text-gray-600">
                                                                            {(reviewForms[item.produk.id]?.rating || 0) > 0 ? `${reviewForms[item.produk.id]?.rating} bintang` : 'Pilih rating'}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Ulasan */}
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        Ulasan Anda
                                                                    </label>
                                                                    <textarea
                                                                        value={reviewForms[item.produk.id]?.ulasan || ''}
                                                                        onChange={(e) => updateUlasan(item.produk.id, e.target.value)}
                                                                        rows={3}
                                                                        maxLength={500}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                                                                        placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                                                                    />
                                                                    <p className="mt-1 text-sm text-gray-500">
                                                                        {(reviewForms[item.produk.id]?.ulasan || '').length}/500 karakter
                                                                    </p>
                                                                </div>

                                                                {/* Tombol */}
                                                                <div className="flex space-x-3">
                                                                    <button
                                                                        onClick={() => submitReview(item.produk.id)}
                                                                        disabled={reviewForms[item.produk.id]?.isSubmitting || (reviewForms[item.produk.id]?.rating || 0) === 0}
                                                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-amber-600 border border-transparent rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        {reviewForms[item.produk.id]?.isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => toggleReviewForm(item.produk.id)}
                                                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                                                    >
                                                                        Batal
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Elegant Order Summary */}
                                    <div className="border-t border-gray-200 pt-8">
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border border-gray-200">
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 tracking-wide">Subtotal:</span>
                                                    <span className="text-gray-900">{formatCurrency(toNumber(order.total_harga) - toNumber(order.ongkos_kirim))}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 tracking-wide">Ongkos Kirim:</span>
                                                    <span className="text-gray-900">{formatCurrency(order.ongkos_kirim)}</span>
                                                </div>
                                                <div className="flex justify-between text-xl font-light text-gray-900 pt-4 border-t border-gray-300">
                                                    <span className="tracking-wider">Total:</span>
                                                    <span className="font-serif">{formatCurrency(order.total_harga)}</span>
                                                </div>
                                            </div>
                                            <div className="mt-6 pt-6 border-t border-gray-300">
                                                <p className="text-sm text-gray-600 tracking-wide">
                                                    <span className="font-medium text-gray-600">Metode Pembayaran:</span> {order.metode_pembayaran}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
