import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Edit, Eye, Package, ToggleLeft, ToggleRight } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

interface Produk {
  id: number;
  nama_produk: string;
  harga: number;
  gambar: string | null;
}

interface Kategori {
  id: number;
  nama_kategori: string;
  slug_kategori: string;
  deskripsi_kategori: string;
  gambar_kategori: string | null;
  aktif: boolean;
  produk: Produk[];
  created_at: string;
  updated_at: string;
}

interface Props {
  kategori: Kategori;
}

export default function Show({ kategori }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AppLayout>
      <Head title={`Detail Kategori - ${kategori.nama_kategori}`} />
      
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/kategori">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{kategori.nama_kategori}</h1>
              <p className="text-gray-600 mt-1">Detail informasi kategori</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild>
              <Link href={`/admin/kategori/${kategori.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Kategori
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informasi Kategori */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detail Kategori */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Informasi Kategori</span>
                  <Badge variant={kategori.aktif ? 'default' : 'secondary'}>
                    {kategori.aktif ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nama Kategori</Label>
                    <p className="text-gray-900 font-medium">{kategori.nama_kategori}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Slug URL</Label>
                    <p className="text-gray-900 font-mono text-sm">{kategori.slug_kategori}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Dibuat Pada</Label>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      {kategori.created_at}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Terakhir Diupdate</Label>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      {kategori.updated_at}
                    </p>
                  </div>
                </div>
                
                {kategori.deskripsi_kategori && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Deskripsi</Label>
                    <p className="text-gray-700 leading-relaxed mt-1">{kategori.deskripsi_kategori}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Produk dalam Kategori */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Produk dalam Kategori ({kategori.produk.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {kategori.produk.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {kategori.produk.map((produk) => (
                      <div key={produk.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {produk.gambar ? (
                            <img 
                              src={produk.gambar} 
                              alt={produk.nama_produk}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{produk.nama_produk}</h4>
                          <p className="text-sm text-gray-600 font-semibold">{formatCurrency(produk.harga)}</p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/produk/${produk.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada produk</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Produk yang masuk kategori ini akan muncul di sini.
                    </p>
                    <Button className="mt-4" asChild>
                      <Link href="/admin/produk/create">
                        Tambah Produk
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Gambar Kategori */}
            <Card>
              <CardHeader>
                <CardTitle>Gambar Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {kategori.gambar_kategori ? (
                    <img 
                      src={kategori.gambar_kategori} 
                      alt={kategori.nama_kategori}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <Package className="mx-auto h-12 w-12 mb-2" />
                        <p className="text-sm">Tidak ada gambar</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistik */}
            <Card>
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Total Produk</span>
                  <Badge variant="secondary">{kategori.produk.length}</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Status</span>
                  <div className="flex items-center">
                    {kategori.aktif ? (
                      <>
                        <ToggleRight className="mr-1 h-4 w-4 text-green-600" />
                        <span className="text-green-600 text-sm font-medium">Aktif</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="mr-1 h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 text-sm font-medium">Nonaktif</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href={`/admin/kategori/${kategori.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Kategori
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/produk/create">
                    <Package className="mr-2 h-4 w-4" />
                    Tambah Produk
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  );
}
