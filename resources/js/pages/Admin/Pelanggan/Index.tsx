import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import {
    Edit,
    Eye,
    Filter,
    Search,
    ShoppingBag,
    Trash2,
    UserCheck,
    Users,
    UserX
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Define the customer interface
interface Customer {
  nama_customer: string;
  email_customer: string;
  telepon_customer: string;
  kota: string;
  provinsi: string;
  is_registered: boolean;
  user_id: number | null;
  total_pesanan: number;
  total_belanja: number;
  pesanan_terakhir: string;
  pesanan_pertama: string;
  status_customer: 'Member' | 'Guest';
}

interface Props {
  pelanggan: Customer[];
}

export default function Index({ pelanggan }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'member' | 'guest'>('all');

  const filteredCustomers = pelanggan.filter(customer => {
    const matchesSearch = 
      customer.nama_customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email_customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.telepon_customer.includes(searchTerm);
    
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'member' && customer.is_registered) ||
      (filterType === 'guest' && !customer.is_registered);

    return matchesSearch && matchesFilter;
  });

  const handleView = (customer: Customer) => {
    router.get(`/admin/pelanggan/${encodeURIComponent(customer.email_customer)}`);
  };

  const handleEdit = (customer: Customer) => {
    if (!customer.is_registered) {
      toast.error('Hanya data member yang dapat diedit');
      return;
    }
    router.get(`/admin/pelanggan/${encodeURIComponent(customer.email_customer)}/edit`);
  };

  const handleDelete = (customer: Customer) => {
    if (!customer.is_registered) {
      toast.error('Data guest customer tidak dapat dihapus');
      return;
    }
    
    if (confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      router.delete(`/admin/pelanggan/${encodeURIComponent(customer.email_customer)}`, {
        onSuccess: () => {
          toast.success('Pelanggan berhasil dihapus');
        },
        onError: () => {
          toast.error('Terjadi kesalahan saat menghapus pelanggan');
        },
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'nama_customer',
      header: 'Nama Customer',
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium">{row.getValue('nama_customer')}</p>
          <p className="text-sm text-gray-500">{row.original.email_customer}</p>
          <p className="text-xs text-gray-400">{row.original.telepon_customer}</p>
        </div>
      ),
    },
    {
      accessorKey: 'status_customer',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status_customer') as string;
        return (
          <Badge 
            variant={status === 'Member' ? 'default' : 'secondary'}
            className={status === 'Member' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
          >
            {status === 'Member' && <UserCheck className="w-3 h-3 mr-1" />}
            {status === 'Guest' && <UserX className="w-3 h-3 mr-1" />}
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'lokasi',
      header: 'Lokasi',
      cell: ({ row }) => (
        <div className="text-sm">
          <p>{row.original.kota}</p>
          <p className="text-gray-500">{row.original.provinsi}</p>
        </div>
      ),
    },
    {
      accessorKey: 'total_pesanan',
      header: 'Total Pesanan',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1">
            <ShoppingBag className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{row.getValue('total_pesanan')}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'total_belanja',
      header: 'Total Belanja',
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.getValue('total_belanja'))}
        </div>
      ),
    },
    {
      accessorKey: 'pesanan_terakhir',
      header: 'Pesanan Terakhir',
      cell: ({ row }) => (
        <div className="text-sm">
          <p>{row.getValue('pesanan_terakhir')}</p>
          <p className="text-gray-500 text-xs">
            Pertama: {row.original.pesanan_pertama}
          </p>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        const customer = row.original;
        
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleView(customer)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            {customer.is_registered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(customer)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            
            {customer.is_registered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(customer)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const totalCustomers = pelanggan.length;
  const memberCount = pelanggan.filter(c => c.is_registered).length;
  const guestCount = pelanggan.filter(c => !c.is_registered).length;
  const totalBelanja = pelanggan.reduce((sum, c) => sum + c.total_belanja, 0);

  return (
    <AppLayout>
      <Head title="Kelola Pelanggan" />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Pelanggan</h1>
            <p className="text-gray-600">Kelola data pelanggan yang melakukan pemesanan</p>
          </div>
        </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Pelanggan</p>
              <p className="text-2xl font-bold">{totalCustomers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Member</p>
              <p className="text-2xl font-bold">{memberCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <UserX className="h-8 w-8 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Guest</p>
              <p className="text-2xl font-bold">{guestCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Total Belanja</p>
              <p className="text-xl font-bold">{formatCurrency(totalBelanja)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari nama, email, atau telepon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filter: {filterType === 'all' ? 'Semua' : filterType === 'member' ? 'Member' : 'Guest'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType('all')}>
                Semua Pelanggan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('member')}>
                Member Saja
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('guest')}>
                Guest Saja
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p className="text-sm text-gray-600">
          Menampilkan {filteredCustomers.length} dari {totalCustomers} pelanggan
          {searchTerm && ` • Pencarian: "${searchTerm}"`}
          {filterType !== 'all' && ` • Filter: ${filterType === 'member' ? 'Member' : 'Guest'}`}
        </p>
      </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg border">
          <DataTable 
            columns={columns} 
            data={filteredCustomers}
            searchKey="nama_customer"
          />
        </div>
      </div>
    </AppLayout>
  );
}
