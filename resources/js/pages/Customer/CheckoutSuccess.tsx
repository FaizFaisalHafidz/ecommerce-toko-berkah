import CustomerLayout from '@/components/customer/CustomerLayout';
import { useCart } from '@/hooks/useCart';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Receipt } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CheckoutSuccessProps {
    orderNumber: string;
    orderId?: number;
    redirectUrl: string;
}

export default function CheckoutSuccess({ orderNumber, orderId, redirectUrl }: CheckoutSuccessProps) {
    const [countdown, setCountdown] = useState(5);
    const { clearCart } = useCart();

    // Clear cart on component mount (order completed successfully)
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Redirect to tracking page
                    window.location.href = redirectUrl;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [redirectUrl]);

    const handleTrackNow = () => {
        window.location.href = redirectUrl;
    };

    return (
        <CustomerLayout>
            <Head title="Pesanan Berhasil - Toko Tas Berkah" />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
                {/* Elegant Background Pattern */}
                <div className="absolute inset-0 bg-opacity-5 bg-gradient-to-r from-gray-600 to-gray-700"></div>
                
                <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
                    <div className="max-w-lg mx-auto">
                        {/* Main Card */}
                        <div className="bg-white/95 backdrop-blur-sm p-10 rounded-none shadow-2xl border border-gray-200">
                            {/* Luxury Header */}
                            <div className="text-center border-b border-gray-200 pb-8 mb-8">
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur-lg opacity-30"></div>
                                        <CheckCircle className="relative h-20 w-20 text-gray-600" />
                                    </div>
                                </div>
                                
                                <h1 className="text-3xl font-light text-gray-900 mb-3 tracking-wider">
                                    PESANAN BERHASIL DIBUAT
                                </h1>
                                <p className="text-sm text-gray-600 font-medium tracking-widest mb-4">
                                    TERIMA KASIH ATAS KEPERCAYAAN ANDA
                                </p>
                                
                                <p className="text-gray-600 leading-relaxed">
                                    Terima kasih atas pesanan Anda. Kami akan memproses pesanan dengan penuh perhatian dan kehati-hatian.
                                </p>
                            </div>
                            
                            {/* Order Details - Luxury Style */}
                            <div className="mb-8">
                                <div className="flex items-center justify-center space-x-3 mb-4">
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                                    <Receipt className="h-5 w-5 text-gray-600" />
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                                </div>
                                
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Nomor Pesanan</p>
                                    <p className="text-2xl font-light text-gray-900 tracking-wider font-serif">
                                        {orderNumber}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Elegant Process Steps */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start space-x-4 group">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-xs font-medium text-white">1</span>
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            Konfirmasi pesanan dikirim ke alamat email Anda
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-4 group">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-xs font-medium text-white">2</span>
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            Pesanan akan diproses dalam 1-2 hari kerja
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-4 group">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-xs font-medium text-white">3</span>
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            Nomor resi pengiriman akan diberikan setelah produk dikirim
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Elegant Countdown */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border border-gray-200 mb-8">
                                <div className="text-center">
                                    <p className="text-xs text-gray-700 uppercase tracking-widest mb-3">
                                        Pengalihan Otomatis
                                    </p>
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                        <p className="text-3xl font-light text-gray-600 font-serif">
                                            {countdown}
                                        </p>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">detik</p>
                                </div>
                            </div>
                            
                            {/* Luxury Action Buttons */}
                            <div className="space-y-4">
                                <button 
                                    onClick={handleTrackNow}
                                    className="w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-4 px-6 hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 transition-all duration-300 text-sm tracking-widest font-medium shadow-xl"
                                >
                                    LACAK PESANAN SEKARANG
                                </button>
                                
                                <Link 
                                    href="/" 
                                    className="w-full border border-gray-300 text-gray-700 py-4 px-6 hover:bg-gray-50 transition-all duration-300 inline-block text-center text-sm tracking-widest font-medium"
                                >
                                    KEMBALI BERBELANJA
                                </Link>
                            </div>
                        </div>
                        
                        {/* Elegant Footer */}
                        <div className="mt-10 text-center">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">Layanan Pelanggan</p>
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                            </div>
                            <div className="flex justify-center space-x-8">
                                <a 
                                    href="mailto:support@tokotasberkah.com" 
                                    className="text-sm text-gray-600 hover:text-gray-700 transition-colors tracking-wide"
                                >
                                    Email
                                </a>
                                <a 
                                    href="tel:+62123456789" 
                                    className="text-sm text-gray-600 hover:text-gray-700 transition-colors tracking-wide"
                                >
                                    Telepon
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
