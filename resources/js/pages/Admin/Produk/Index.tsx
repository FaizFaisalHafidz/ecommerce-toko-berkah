import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, Eye, MoreHorizontal, Package2, Pencil, Plus, Star, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';

interface Produk {
  id: number;
  nama_produk: string;
  kategori: string;
  harga: number;
  harga_diskon?: number;
  stok: number;
  minimal_stok: number;
  aktif: boolean;
  produk_unggulan: boolean;
  gambar_utama: string | null;
  images: Array<{
    url: string;
    alt: string;
    primary: boolean;
  }>;
  jumlah_ulasan: number;
  jumlah_terjual: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  produk: Produk[];
}

export default function Index({ produk }: Props) {
  const [deleteProduk, setDeleteProduk] = useState<Produk | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = () => {
    if (!deleteProduk) return;

    router.delete(`/admin/produk/${deleteProduk.id}`, {
      onSuccess: () => {
        toast.success('Produk berhasil dihapus');
        setDeleteProduk(null);
      },
      onError: (errors) => {
        toast.error(errors.message || 'Terjadi kesalahan saat menghapus produk');
      },
    });
  };

  const handleToggleStatus = (produk: Produk) => {
    router.patch(`/admin/produk/${produk.id}/toggle-status`, {}, {
      onSuccess: () => {
        toast.success(`Status produk berhasil ${produk.aktif ? 'dinonaktifkan' : 'diaktifkan'}`);
      },
      onError: () => {
        toast.error('Terjadi kesalahan saat mengubah status produk');
      },
    });
  };

  const handleToggleFeatured = (produk: Produk) => {
    router.patch(`/admin/produk/${produk.id}/toggle-featured`, {}, {
      onSuccess: () => {
        toast.success(`Produk berhasil ${produk.produk_unggulan ? 'dihapus dari' : 'ditambahkan ke'} produk unggulan`);
      },
      onError: () => {
        toast.error('Terjadi kesalahan saat mengubah status unggulan');
      },
    });
  };

  const getStockStatus = (stok: number, minimalStok: number) => {
    if (stok === 0) {
      return { label: 'Habis', variant: 'destructive' as const, icon: AlertTriangle };
    } else if (stok <= minimalStok) {
      return { label: 'Menipis', variant: 'secondary' as const, icon: Package2 };
    } else {
      return { label: 'Tersedia', variant: 'default' as const, icon: Package2 };
    }
  };

  const columns: ColumnDef<Produk>[] = [
    {
      accessorKey: 'gambar_utama',
      header: 'Gambar',
      cell: ({ row }) => {
        const gambar = row.getValue('gambar_utama') as string | null;
        return (
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
            {gambar ? (
              <img 
                src={gambar} 
                alt={row.getValue('nama_produk')} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'nama_produk',
      header: 'Produk',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{row.getValue('nama_produk')}</div>
          <div className="text-sm text-gray-500">{row.original.kategori}</div>
          <div className="flex items-center space-x-1">
            {row.original.produk_unggulan && (
              <Badge variant="outline" className="text-xs">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Unggulan
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'harga',
      header: 'Harga',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900">
            {formatCurrency(row.original.harga_diskon || row.original.harga)}
          </div>
          {row.original.harga_diskon && (
            <div className="text-sm text-gray-500 line-through">
              {formatCurrency(row.original.harga)}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'stok',
      header: 'Stok',
      cell: ({ row }) => {
        const status = getStockStatus(row.original.stok, row.original.minimal_stok);
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900">{row.original.stok} unit</div>
            <Badge variant={status.variant} className="text-xs">
              <status.icon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'jumlah_terjual',
      header: 'Terjual',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium text-gray-900">{row.getValue('jumlah_terjual')}</div>
          <div className="text-xs text-gray-500">unit</div>
        </div>
      ),
    },
    {
      accessorKey: 'aktif',
      header: 'Status',
      cell: ({ row }) => {
        const aktif = row.getValue('aktif') as boolean;
        return (
          <Badge variant={aktif ? 'default' : 'secondary'}>
            {aktif ? 'Aktif' : 'Nonaktif'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Tanggal Dibuat',
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {row.getValue('created_at')}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        const produk = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Buka menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/admin/produk/${produk.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/produk/${produk.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleToggleStatus(produk)}>
                {produk.aktif ? (
                  <>
                    <ToggleLeft className="mr-2 h-4 w-4" />
                    Nonaktifkan
                  </>
                ) : (
                  <>
                    <ToggleRight className="mr-2 h-4 w-4" />
                    Aktifkan
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleFeatured(produk)}>
                {produk.produk_unggulan ? (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    Hapus dari Unggulan
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    Jadikan Unggulan
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteProduk(produk)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <AppLayout>
      <Head title="Produk" />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Produk</h1>
            <p className="text-gray-600 mt-1">Kelola produk toko Anda</p>
          </div>
          <Button asChild>
            <Link href="/admin/produk/create">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Produk</p>
                <p className="text-2xl font-bold text-gray-900">{produk.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ToggleRight className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Produk Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {produk.filter(p => p.aktif).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Produk Unggulan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {produk.filter(p => p.produk_unggulan).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Stok Habis</p>
                <p className="text-2xl font-bold text-gray-900">
                  {produk.filter(p => p.stok === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <DataTable
              columns={columns}
              data={produk}
              searchKey="nama_produk"
              searchPlaceholder="Cari produk..."
            />
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteProduk} onOpenChange={() => setDeleteProduk(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus produk &quot;{deleteProduk?.nama_produk}&quot;? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
