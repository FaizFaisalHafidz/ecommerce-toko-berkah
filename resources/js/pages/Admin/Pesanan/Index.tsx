import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    Download,
    Edit,
    Eye,
    Filter,
    Mail,
    Package,
    Phone,
    Search,
    Trash2,
    Truck,
    User,
    XCircle
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { toast } from 'sonner';

interface Pesanan {
  id: number;
  nomor_pesanan: string;
  nama_customer: string;
  email_customer: string;
  telepon_customer: string;
  total_akhir: number;
  status_pesanan: string;
  status_pembayaran: string;
  metode_pembayaran: string;
  jumlah_item: number;
  tanggal_pesanan: string;
  is_guest: boolean;
  kurir: string;
  layanan_kurir: string;
  nomor_resi: string;
}

interface Statistik {
  total_pesanan: number;
  pesanan_pending: number;
  pesanan_diproses: number;
  pesanan_dikirim: number;
  pesanan_selesai: number;
  pesanan_dibatalkan: number;
  total_penjualan: number;
  pembayaran_pending: number;
  pembayaran_berhasil: number;
}

interface Props {
  pesanan: {
    data: Pesanan[];
    links: any;
    meta: any;
  };
  statistik: Statistik;
  filters: {
    status?: string;
    payment_status?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
  };
}

export default function Index({ pesanan, statistik, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(filters.payment_status || 'all');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');

  const applyFilters = () => {
    router.get('/admin/pesanan', {
      search: searchTerm,
      status: statusFilter,
      payment_status: paymentStatusFilter,
      date_from: dateFrom,
      date_to: dateTo,
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    router.get('/admin/pesanan');
  };

  const handleView = (pesanan: Pesanan) => {
    router.get(`/admin/pesanan/${pesanan.id}`);
  };

  const handleDelete = (pesanan: Pesanan) => {
    if (pesanan.status_pesanan !== 'dibatalkan') {
      toast.error('Hanya pesanan yang dibatalkan yang dapat dihapus');
      return;
    }

    if (confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      router.delete(`/admin/pesanan/${pesanan.id}`, {
        onSuccess: () => {
          toast.success('Pesanan berhasil dihapus');
        },
        onError: () => {
          toast.error('Terjadi kesalahan saat menghapus pesanan');
        },
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
      diproses: { label: 'Diproses', variant: 'default' as const, icon: Package, className: 'bg-blue-100 text-blue-800' },
      dikirim: { label: 'Dikirim', variant: 'default' as const, icon: Truck, className: 'bg-purple-100 text-purple-800' },
      selesai: { label: 'Selesai', variant: 'default' as const, icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      dibatalkan: { label: 'Dibatalkan', variant: 'destructive' as const, icon: XCircle, className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config?.icon || AlertCircle;

    return (
      <Badge className={config?.className || 'bg-gray-100 text-gray-800'}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config?.label || status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
      berhasil: { label: 'Berhasil', className: 'bg-green-100 text-green-800' },
      gagal: { label: 'Gagal', className: 'bg-red-100 text-red-800' },
      expired: { label: 'Kadaluarsa', className: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <Badge className={config?.className || 'bg-gray-100 text-gray-800'}>
        <CreditCard className="w-3 h-3 mr-1" />
        {config?.label || status}
      </Badge>
    );
  };

  const columns: ColumnDef<Pesanan>[] = [
    {
      accessorKey: 'nomor_pesanan',
      header: 'No. Pesanan',
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {row.getValue('nomor_pesanan')}
        </div>
      ),
    },
    {
      accessorKey: 'nama_customer',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{row.getValue('nama_customer')}</span>
            {row.original.is_guest && (
              <Badge variant="outline" className="text-xs">Guest</Badge>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Mail className="w-3 h-3" />
            <span>{row.original.email_customer}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Phone className="w-3 h-3" />
            <span>{row.original.telepon_customer}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'total_akhir',
      header: 'Total',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-semibold text-lg">
            Rp {(row.getValue<number>('total_akhir') || 0).toLocaleString('id-ID')}
          </div>
          <div className="text-sm text-gray-500">
            {row.original.jumlah_item || 0} item
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status_pesanan',
      header: 'Status Pesanan',
      cell: ({ row }) => getStatusBadge(row.getValue('status_pesanan')),
    },
    {
      accessorKey: 'status_pembayaran',
      header: 'Pembayaran',
      cell: ({ row }) => (
        <div className="space-y-1">
          {getPaymentStatusBadge(row.getValue('status_pembayaran'))}
          <div className="text-xs text-gray-500">
            {row.original.metode_pembayaran}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'tanggal_pesanan',
      header: 'Tanggal',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{row.getValue('tanggal_pesanan')}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Buka menu</span>
              <Edit className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(row.original)}>
              <Eye className="mr-2 h-4 w-4" />
              Lihat Detail
            </DropdownMenuItem>
            {row.original.status_pesanan === 'dibatalkan' && (
              <DropdownMenuItem 
                onClick={() => handleDelete(row.original)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AppLayout>
      <Head title="Kelola Pesanan" />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Pesanan</h1>
            <p className="text-gray-600">Kelola semua pesanan dan status pengiriman</p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => router.get('/admin/pesanan/export')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{statistik.total_pesanan}</p>
                  <p className="text-sm text-gray-600">Total Pesanan</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{statistik.pesanan_pending}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{statistik.pesanan_dikirim}</p>
                  <p className="text-sm text-gray-600">Dikirim</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{statistik.pesanan_selesai}</p>
                  <p className="text-sm text-gray-600">Selesai</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    Rp {(statistik.total_penjualan || 0).toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-600">Total Penjualan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter & Pencarian</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pencarian</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="No. pesanan, nama, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status Pesanan</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="diproses">Diproses</SelectItem>
                    <SelectItem value="dikirim">Dikirim</SelectItem>
                    <SelectItem value="selesai">Selesai</SelectItem>
                    <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status Pembayaran</label>
                <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="berhasil">Berhasil</SelectItem>
                    <SelectItem value="gagal">Gagal</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Dari Tanggal</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sampai Tanggal</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={applyFilters}>
                <Search className="h-4 w-4 mr-2" />
                Terapkan Filter
              </Button>
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            <DataTable 
              columns={columns} 
              data={pesanan.data}
              searchKey="nomor_pesanan"
            />
          </CardContent>
        </Card>

        {/* Pagination will be handled by DataTable if needed */}
      </div>
    </AppLayout>
  );
}
