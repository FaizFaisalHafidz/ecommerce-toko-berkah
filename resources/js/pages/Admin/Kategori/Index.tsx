import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Pencil, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
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

interface Kategori {
  id: number;
  nama_kategori: string;
  deskripsi: string;
  gambar: string | null;
  aktif: boolean;
  produk_count: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  kategoris: Kategori[];
}

export default function Index({ kategoris }: Props) {
  const [deleteKategori, setDeleteKategori] = useState<Kategori | null>(null);

  const handleDelete = () => {
    if (!deleteKategori) return;

    router.delete(`/admin/kategori/${deleteKategori.id}`, {
      onSuccess: () => {
        toast.success('Kategori berhasil dihapus');
        setDeleteKategori(null);
      },
      onError: (errors) => {
        toast.error(errors.message || 'Terjadi kesalahan saat menghapus kategori');
      },
    });
  };

  const handleToggleStatus = (kategori: Kategori) => {
    router.patch(`/admin/kategori/${kategori.id}/toggle-status`, {}, {
      onSuccess: () => {
        toast.success(`Status kategori berhasil ${kategori.aktif ? 'dinonaktifkan' : 'diaktifkan'}`);
      },
      onError: () => {
        toast.error('Terjadi kesalahan saat mengubah status kategori');
      },
    });
  };

  const columns: ColumnDef<Kategori>[] = [
    {
      accessorKey: 'gambar',
      header: 'Gambar',
      cell: ({ row }) => {
        const gambar = row.getValue('gambar') as string | null;
        return (
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
            {gambar ? (
              <img 
                src={gambar} 
                alt={row.getValue('nama_kategori')} 
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
      accessorKey: 'nama_kategori',
      header: 'Nama Kategori',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('nama_kategori')}</div>
          <div className="text-sm text-gray-500 truncate max-w-[200px]">
            {row.original.deskripsi || 'Tidak ada deskripsi'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'produk_count',
      header: 'Jumlah Produk',
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue('produk_count')} produk
        </Badge>
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
        const kategori = row.original;

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
                <Link href={`/admin/kategori/${kategori.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/kategori/${kategori.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleToggleStatus(kategori)}>
                {kategori.aktif ? (
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteKategori(kategori)}
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
      <Head title="Kategori" />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kategori</h1>
            <p className="text-gray-600 mt-1">Kelola kategori produk Anda</p>
          </div>
          <Button asChild>
            <Link href="/admin/kategori/create">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kategori
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <DataTable
              columns={columns}
              data={kategoris}
              searchKey="nama_kategori"
              searchPlaceholder="Cari kategori..."
            />
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteKategori} onOpenChange={() => setDeleteKategori(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kategori &quot;{deleteKategori?.nama_kategori}&quot;? 
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
