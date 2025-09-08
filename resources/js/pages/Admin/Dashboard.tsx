import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Clock, DollarSign, Eye, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';

interface DashboardStats {
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    totalRevenue: number;
}

interface RecentOrder {
    id: number;
    nomor_pesanan: string;
    status_pesanan: string;
    total_akhir: number;
    created_at: string;
    nama_customer?: string;
}

interface Props extends SharedData {
    stats: DashboardStats;
    recentOrders: RecentOrder[];
}

export default function Dashboard({ stats, recentOrders }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateString));
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'pending': { label: 'Pending', variant: 'secondary' as const },
            'diproses': { label: 'Diproses', variant: 'default' as const },
            'dikirim': { label: 'Dikirim', variant: 'outline' as const },
            'selesai': { label: 'Selesai', variant: 'default' as const },
            'dibatalkan': { label: 'Dibatalkan', variant: 'destructive' as const },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
        
        return (
            <Badge variant={config.variant} className="text-xs">
                {config.label}
            </Badge>
        );
    };

    const statsCards = [
        {
            title: 'Total Pesanan',
            value: stats.totalOrders.toLocaleString('id-ID'),
            icon: ShoppingCart,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Total Produk',
            value: stats.totalProducts.toLocaleString('id-ID'),
            icon: Package,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50',
            change: '+8%',
            changeType: 'positive'
        },
        {
            title: 'Total Pengguna',
            value: stats.totalUsers.toLocaleString('id-ID'),
            icon: Users,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50',
            change: '+23%',
            changeType: 'positive'
        },
        {
            title: 'Total Pendapatan',
            value: formatCurrency(stats.totalRevenue),
            icon: DollarSign,
            iconColor: 'text-orange-600',
            bgColor: 'bg-orange-50',
            change: '+15%',
            changeType: 'positive'
        },
    ];

    return (
        <AppLayout>
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-1">Selamat datang kembali! Berikut ringkasan toko Anda hari ini.</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm">
                            <Clock className="mr-2 h-4 w-4" />
                            Hari ini
                        </Button>
                        <Button asChild>
                            <Link href="/admin/laporan">
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Lihat Laporan
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsCards.map((card, index) => (
                        <Card key={index} className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                        <div className="flex items-center text-sm">
                                            <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                                            <span className="text-green-600 font-medium">{card.change}</span>
                                            <span className="text-gray-500 ml-1">dari bulan lalu</span>
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-full ${card.bgColor}`}>
                                        <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Orders */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-semibold text-gray-900">Pesanan Terbaru</CardTitle>
                                <p className="text-sm text-gray-600 mt-1">Pantau pesanan yang masuk hari ini</p>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin/pesanan">
                                    Lihat Semua
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {recentOrders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">No. Pesanan</th>
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Pelanggan</th>
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Total</th>
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Tanggal</th>
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <span className="font-medium text-gray-900">{order.nomor_pesanan}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-gray-700">{order.nama_customer || 'Guest Customer'}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {getStatusBadge(order.status_pesanan)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="font-semibold text-gray-900">{formatCurrency(order.total_akhir)}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-gray-600 text-sm">{formatDate(order.created_at)}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/admin/pesanan/${order.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <ShoppingCart className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada pesanan</h3>
                                <p className="text-gray-600 max-w-sm mx-auto">
                                    Pesanan baru akan muncul di sini. Pastikan toko Anda sudah siap menerima pesanan.
                                </p>
                                <Button className="mt-4" asChild>
                                    <Link href="/admin/produk">
                                        Kelola Produk
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
