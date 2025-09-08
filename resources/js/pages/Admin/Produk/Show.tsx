import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Edit, Eye, Package, ShoppingCart, Star, Users } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';

interface Gambar {
  id: number;
  url: string;
  alt: string;
  primary: boolean;
  urutan: number;
}

interface Produk {
  id: number;
  nama_produk: string;
  slug_produk: string;
  kategori: string;
  deskripsi_singkat: string;
  deskripsi_lengkap: string;
  sku: string;
  harga: number;
  harga_diskon: number | null;
  stok: number;
  minimal_stok: number;
  berat: number | null;
  dimensi: string | null;
  material: string | null;
  warna: string | null;
  tag: string[];
  produk_unggulan: boolean;
  produk_baru: boolean;
  aktif: boolean;
  rating_rata: number;
  jumlah_ulasan: number;
  jumlah_terjual: number;
  jumlah_dilihat: number;
  gambar: Gambar[];
  created_at: string;
  updated_at: string;
}

interface Props {
  produk: Produk;
}

export default function Show({ produk }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStockStatus = (stok: number, minimal_stok: number) => {
    if (stok === 0) return { label: 'Habis', variant: 'destructive' as const };
    if (stok <= minimal_stok) return { label: 'Stok Menipis', variant: 'secondary' as const };
    return { label: 'Tersedia', variant: 'default' as const };
  };

  const stockStatus = getStockStatus(produk.stok, produk.minimal_stok);

  return (
    <AppLayout>
      <Head title={`Detail Produk - ${produk.nama_produk}`} />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/produk">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{produk.nama_produk}</h1>
              <p className="text-gray-600 mt-1">Detail informasi produk</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/produk/${produk.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                {produk.gambar.length > 0 ? (
                  <>
                    <div className="aspect-square mb-4">
                      <img
                        src={produk.gambar[selectedImage]?.url}
                        alt={produk.gambar[selectedImage]?.alt}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                    </div>
                    {produk.gambar.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {produk.gambar.map((gambar, index) => (
                          <button
                            key={gambar.id}
                            onClick={() => setSelectedImage(index)}
                            className={`aspect-square border-2 rounded-lg overflow-hidden ${
                              selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                            }`}
                          >
                            <img
                              src={gambar.url}
                              alt={gambar.alt}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Tidak ada gambar</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Produk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={produk.aktif ? 'default' : 'secondary'}>
                    {produk.aktif ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                  <Badge variant={stockStatus.variant}>
                    {stockStatus.label}
                  </Badge>
                  {produk.produk_unggulan && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                      Unggulan
                    </Badge>
                  )}
                  {produk.produk_baru && (
                    <Badge variant="outline" className="border-green-500 text-green-700">
                      Baru
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">SKU:</span>
                    <p className="font-medium">{produk.sku}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Kategori:</span>
                    <p className="font-medium">{produk.kategori}</p>
                  </div>
                </div>

                {produk.deskripsi_singkat && (
                  <div>
                    <span className="text-gray-500 text-sm">Deskripsi Singkat:</span>
                    <p className="mt-1">{produk.deskripsi_singkat}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing & Stock */}
            <Card>
              <CardHeader>
                <CardTitle>Harga & Stok</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500 text-sm">Harga Normal:</span>
                    <p className="text-2xl font-bold">{formatRupiah(produk.harga)}</p>
                  </div>
                  {produk.harga_diskon && (
                    <div>
                      <span className="text-gray-500 text-sm">Harga Diskon:</span>
                      <p className="text-2xl font-bold text-green-600">{formatRupiah(produk.harga_diskon)}</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Stok Tersedia:</span>
                    <p className="font-medium">{produk.stok} unit</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Minimal Stok:</span>
                    <p className="font-medium">{produk.minimal_stok} unit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Produk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {produk.berat && (
                    <div>
                      <span className="text-gray-500">Berat:</span>
                      <p className="font-medium">{produk.berat} gram</p>
                    </div>
                  )}
                  {produk.dimensi && (
                    <div>
                      <span className="text-gray-500">Dimensi:</span>
                      <p className="font-medium">{produk.dimensi}</p>
                    </div>
                  )}
                  {produk.material && (
                    <div>
                      <span className="text-gray-500">Material:</span>
                      <p className="font-medium">{produk.material}</p>
                    </div>
                  )}
                  {produk.warna && (
                    <div>
                      <span className="text-gray-500">Warna:</span>
                      <p className="font-medium">{produk.warna}</p>
                    </div>
                  )}
                </div>

                {Array.isArray(produk.tag) && produk.tag.length > 0 && (
                  <div>
                    <span className="text-gray-500 text-sm">Tag:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {produk.tag.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats & Performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-2xl font-bold">{produk.rating_rata ? Number(produk.rating_rata).toFixed(1) : '0.0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Ulasan</p>
                  <p className="text-2xl font-bold">{produk.jumlah_ulasan}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Terjual</p>
                  <p className="text-2xl font-bold">{produk.jumlah_terjual}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Dilihat</p>
                  <p className="text-2xl font-bold">{produk.jumlah_dilihat}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {produk.deskripsi_lengkap && (
          <Card>
            <CardHeader>
              <CardTitle>Deskripsi Lengkap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{produk.deskripsi_lengkap}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Lainnya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <span className="text-gray-500">Dibuat:</span>
                  <span className="ml-2 font-medium">{produk.created_at}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <span className="text-gray-500">Diperbarui:</span>
                  <span className="ml-2 font-medium">{produk.updated_at}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
