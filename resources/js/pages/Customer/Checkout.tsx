import CustomerLayout from '@/components/customer/CustomerLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ChevronDown, CreditCard, Lock, MapPin } from 'lucide-react';
import { useState } from 'react';

interface CheckoutProps {
    cartItems?: Array<{
        id: string;
        productId: number;
        name: string;
        price: number;
        image: string;
        quantity: number;
        color?: string;
        slug: string;
    }>;
    subtotal?: number;
    shipping?: number;
    total?: number;
    provinces: Array<{
        id: number;
        name: string;
    }>;
    cities: Array<{
        id: number;
        name: string;
        province_id: number;
    }>;
    shippingMethods: Array<{
        id: string;
        name: string;
        cost: number;
        estimate: string;
    }>;
    message?: string;
}

export default function Checkout({ 
    cartItems = [], 
    subtotal = 0, 
    shipping = 25000, 
    total = 25000,
    provinces = [], 
    cities = [], 
    shippingMethods = [],
    message 
}: CheckoutProps) {
    const { auth } = usePage().props as any;
    
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedShipping, setSelectedShipping] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        // Informasi Pengiriman
        nama_penerima: auth?.user?.nama_lengkap || '',
        telepon_penerima: auth?.user?.telepon || '',
        alamat: auth?.user?.alamat || '',
        kota_id: '',
        provinsi_id: '',
        kode_pos: auth?.user?.kode_pos || '',
        catatan_pengiriman: '',
        
        // Metode Pengiriman
        metode_pengiriman: '',
        
        // Metode Pembayaran
        metode_pembayaran: '',
        
        // Total
        subtotal: 0,
        biaya_pengiriman: 0,
        total_bayar: 0,
    });

    const filteredCities = cities.filter(city => 
        city.province_id.toString() === selectedProvince
    );

    const handleProvinceChange = (provinceId: string) => {
        setSelectedProvince(provinceId);
        setSelectedCity('');
        setData('provinsi_id', provinceId);
        setData('kota_id', '');
    };

    const handleCityChange = (cityId: string) => {
        setSelectedCity(cityId);
        setData('kota_id', cityId);
    };

    const handleShippingChange = (shippingId: string) => {
        setSelectedShipping(shippingId);
        const shippingMethod = shippingMethods.find(s => s.id === shippingId);
        if (shippingMethod) {
            setData('metode_pengiriman', shippingId);
            setData('biaya_pengiriman', shippingMethod.cost);
            setData('total_bayar', subtotal + shippingMethod.cost);
        }
    };

    const handlePaymentChange = (paymentMethod: string) => {
        setSelectedPayment(paymentMethod);
        setData('metode_pembayaran', paymentMethod);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Create complete data object with cart items
        const formData = {
            ...data,
            subtotal: subtotal,
            total_bayar: subtotal + data.biaya_pengiriman,
            cart_items: cartItems
        };
        
        console.log('Submitting checkout form with data:', formData);
        
        // Submit with complete data using router.post
        router.post('/checkout', formData, {
            onSuccess: () => {
                // Redirect akan ditangani oleh server
            },
            onError: (errors: any) => {
                console.error('Checkout errors:', errors);
            }
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (!cartItems.length || message) {
        return (
            <CustomerLayout>
                <Head title="Checkout - Toko Tas Berkah" />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-light text-gray-900 mb-4">
                            Keranjang Anda Kosong
                        </h2>
                        <p className="text-gray-600 mb-8">
                            {message || 'Silakan tambahkan produk ke keranjang terlebih dahulu'}
                        </p>
                        <a 
                            href="/" 
                            className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
                        >
                            BELANJA SEKARANG
                        </a>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <Head title="Checkout - Toko Tas Berkah" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="py-6">
                            <h1 className="text-3xl font-light text-gray-900">CHECKOUT</h1>
                            <nav className="flex mt-2" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-2 text-sm">
                                    <li>
                                        <a href="/" className="text-gray-500 hover:text-gray-700">
                                            Beranda
                                        </a>
                                    </li>
                                    <li className="text-gray-500">/</li>
                                    <li>
                                        <a href="/cart" className="text-gray-500 hover:text-gray-700">
                                            Keranjang
                                        </a>
                                    </li>
                                    <li className="text-gray-500">/</li>
                                    <li className="text-gray-900">Checkout</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Form Section */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Informasi Pengiriman */}
                                <div className="bg-white p-6 shadow-sm">
                                    <div className="flex items-center mb-6">
                                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                                        <h2 className="text-xl font-light text-gray-900">INFORMASI PENGIRIMAN</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nama Penerima *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.nama_penerima}
                                                onChange={(e) => setData('nama_penerima', e.target.value)}
                                                className="w-full border border-gray-300 px-4 py-3 focus:ring-black focus:border-black"
                                                required
                                            />
                                            {errors.nama_penerima && (
                                                <p className="text-red-500 text-sm mt-1">{errors.nama_penerima}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nomor Telepon *
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.telepon_penerima}
                                                onChange={(e) => setData('telepon_penerima', e.target.value)}
                                                className="w-full border border-gray-300 px-4 py-3 focus:ring-black focus:border-black"
                                                required
                                            />
                                            {errors.telepon_penerima && (
                                                <p className="text-red-500 text-sm mt-1">{errors.telepon_penerima}</p>
                                            )}
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Alamat Lengkap *
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={data.alamat}
                                                onChange={(e) => setData('alamat', e.target.value)}
                                                className="w-full border border-gray-300 px-4 py-3 focus:ring-black focus:border-black"
                                                required
                                            />
                                            {errors.alamat && (
                                                <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Provinsi *
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={selectedProvince}
                                                    onChange={(e) => handleProvinceChange(e.target.value)}
                                                    className="w-full border border-gray-300 px-4 py-3 focus:ring-black focus:border-black appearance-none"
                                                    required
                                                >
                                                    <option value="">Pilih Provinsi</option>
                                                    {provinces.map((province) => (
                                                        <option key={province.id} value={province.id.toString()}>
                                                            {province.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                            </div>
                                            {errors.provinsi_id && (
                                                <p className="text-red-500 text-sm mt-1">{errors.provinsi_id}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Kota/Kabupaten *
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={selectedCity}
                                                    onChange={(e) => handleCityChange(e.target.value)}
                                                    className="w-full border border-gray-300 px-4 py-3 focus:ring-black focus:border-black appearance-none"
                                                    required
                                                    disabled={!selectedProvince}
                                                >
                                                    <option value="">Pilih Kota</option>
                                                    {filteredCities.map((city) => (
                                                        <option key={city.id} value={city.id.toString()}>
                                                            {city.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                            </div>
                                            {errors.kota_id && (
                                                <p className="text-red-500 text-sm mt-1">{errors.kota_id}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Kode Pos *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.kode_pos}
                                                onChange={(e) => setData('kode_pos', e.target.value)}
                                                className="w-full border border-gray-300 px-4 py-3 focus:ring-black focus:border-black"
                                                required
                                            />
                                            {errors.kode_pos && (
                                                <p className="text-red-500 text-sm mt-1">{errors.kode_pos}</p>
                                            )}
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Catatan Pengiriman (Opsional)
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={data.catatan_pengiriman}
                                                onChange={(e) => setData('catatan_pengiriman', e.target.value)}
                                                className="w-full border border-gray-300 px-4 py-3 focus:ring-black focus:border-black"
                                                placeholder="Contoh: Rumah cat hijau, sebelah warung"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Metode Pengiriman */}
                                <div className="bg-white p-6 shadow-sm">
                                    <h2 className="text-xl font-light text-gray-900 mb-6">METODE PENGIRIMAN</h2>
                                    
                                    <div className="space-y-4">
                                        {shippingMethods.map((method) => (
                                            <label
                                                key={method.id}
                                                className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                                                    selectedShipping === method.id
                                                        ? 'border-black bg-gray-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="shipping"
                                                        value={method.id}
                                                        checked={selectedShipping === method.id}
                                                        onChange={(e) => handleShippingChange(e.target.value)}
                                                        className="sr-only"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{method.name}</p>
                                                        <p className="text-sm text-gray-600">Estimasi: {method.estimate}</p>
                                                    </div>
                                                </div>
                                                <span className="text-lg font-medium text-gray-900">
                                                    {formatPrice(method.cost)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    
                                    {errors.metode_pengiriman && (
                                        <p className="text-red-500 text-sm mt-2">{errors.metode_pengiriman}</p>
                                    )}
                                </div>

                                {/* Metode Pembayaran */}
                                <div className="bg-white p-6 shadow-sm">
                                    <div className="flex items-center mb-6">
                                        <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                                        <h2 className="text-xl font-light text-gray-900">METODE PEMBAYARAN</h2>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {[
                                            { id: 'transfer_bank', name: 'Transfer Bank', desc: 'BCA, Mandiri, BNI, BRI' },
                                            { id: 'e_wallet', name: 'E-Wallet', desc: 'GoPay, OVO, DANA, LinkAja' },
                                            { id: 'cod', name: 'Bayar di Tempat (COD)', desc: 'Bayar saat barang sampai' },
                                            { id: 'kartu_kredit', name: 'Kartu Kredit', desc: 'Visa, MasterCard, JCB' },
                                        ].map((payment) => (
                                            <label
                                                key={payment.id}
                                                className={`flex items-center p-4 border cursor-pointer transition-colors ${
                                                    selectedPayment === payment.id
                                                        ? 'border-black bg-gray-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value={payment.id}
                                                    checked={selectedPayment === payment.id}
                                                    onChange={(e) => handlePaymentChange(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{payment.name}</p>
                                                    <p className="text-sm text-gray-600">{payment.desc}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    
                                    {errors.metode_pembayaran && (
                                        <p className="text-red-500 text-sm mt-2">{errors.metode_pembayaran}</p>
                                    )}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white p-6 shadow-sm sticky top-8">
                                    <h2 className="text-xl font-light text-gray-900 mb-6">RINGKASAN PESANAN</h2>
                                    
                                    {/* Items */}
                                    <div className="space-y-4 mb-6">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-4">
                                                <img
                                                    src={item.image || '/images/placeholder.jpg'}
                                                    alt={item.name || 'Product'}
                                                    className="w-16 h-16 object-cover"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900 text-sm">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Qty: {item.quantity}
                                                        {item.color && ` • ${item.color}`}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Price Summary */}
                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Pengiriman</span>
                                            <span className="font-medium">
                                                {data.biaya_pengiriman > 0 ? formatPrice(data.biaya_pengiriman) : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-lg font-medium border-t pt-2">
                                            <span>Total</span>
                                            <span>{formatPrice(subtotal + data.biaya_pengiriman)}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Security Notice */}
                                    <div className="flex items-center space-x-2 mt-6 text-sm text-gray-600">
                                        <Lock className="h-4 w-4" />
                                        <span>Transaksi Anda aman dan terenkripsi</span>
                                    </div>
                                    
                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-black text-white py-4 mt-6 hover:bg-gray-800 disabled:bg-gray-400 transition-colors font-medium tracking-wider"
                                    >
                                        {processing ? 'MEMPROSES...' : 'BUAT PESANAN'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </CustomerLayout>
    );
}
