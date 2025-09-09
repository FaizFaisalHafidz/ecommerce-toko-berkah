import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

interface Kategori {
  id: number;
  nama_kategori: string;
}

interface Props {
  kategoris: Kategori[];
}

export default function Create({ kategoris }: Props) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const { data, setData, post, processing, errors, clearErrors } = useForm({
    nama_produk: '',
    kategori_id: '',
    deskripsi_singkat: '',
    deskripsi_lengkap: '',
    sku: '',
    harga: '',
    harga_diskon: '',
    stok: '',
    minimal_stok: '5',
    berat: '',
    dimensi: '',
    material: '',
    warna: '',
    tag: [] as string[],
    produk_unggulan: false,
    produk_baru: true,
    aktif: true,
    gambar: [] as File[],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = [...data.gambar, ...files];
      setData('gambar', newFiles);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newFiles = data.gambar.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setData('gambar', newFiles);
    setImagePreviews(newPreviews);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setData('tag', newTags);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setData('tag', newTags);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Untuk file upload, gunakan post dengan forceFormData: true
    post('/admin/produk', {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Produk berhasil ditambahkan');
      },
      onError: (errors) => {
        console.log('Validation errors:', errors);
        toast.error('Terjadi kesalahan saat menambahkan produk');
      },
    });
  };

  return (
    <AppLayout>
      <Head title="Tambah Produk" />
      
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
              <h1 className="text-3xl font-bold text-gray-900">Tambah Produk</h1>
              <p className="text-gray-600 mt-1">Buat produk baru untuk toko Anda</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Produk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nama Produk */}
                <div className="space-y-2">
                  <Label htmlFor="nama_produk">
                    Nama Produk <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nama_produk"
                    type="text"
                    value={data.nama_produk}
                    onChange={(e) => {
                      setData('nama_produk', e.target.value);
                      clearErrors('nama_produk');
                    }}
                    placeholder="Masukkan nama produk"
                    className={errors.nama_produk ? 'border-red-500' : ''}
                  />
                  {errors.nama_produk && (
                    <p className="text-sm text-red-600">{errors.nama_produk}</p>
                  )}
                </div>

                {/* Kategori & SKU */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kategori_id">
                      Kategori <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="kategori_id"
                      value={data.kategori_id}
                      onChange={(e) => setData('kategori_id', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.kategori_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Pilih kategori</option>
                      {kategoris.map((kategori) => (
                        <option key={kategori.id} value={kategori.id.toString()}>
                          {kategori.nama_kategori}
                        </option>
                      ))}
                    </select>
                    {errors.kategori_id && (
                      <p className="text-sm text-red-600">{errors.kategori_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      type="text"
                      value={data.sku}
                      onChange={(e) => setData('sku', e.target.value)}
                      placeholder="Kosongkan untuk auto generate"
                    />
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="space-y-2">
                  <Label htmlFor="deskripsi_singkat">Deskripsi Singkat</Label>
                  <Textarea
                    id="deskripsi_singkat"
                    value={data.deskripsi_singkat}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setData('deskripsi_singkat', e.target.value);
                    }}
                    placeholder="Deskripsi singkat produk (maks 500 karakter)"
                    rows={3}
                    maxLength={500}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deskripsi_lengkap">Deskripsi Lengkap</Label>
                  <Textarea
                    id="deskripsi_lengkap"
                    value={data.deskripsi_lengkap}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setData('deskripsi_lengkap', e.target.value);
                    }}
                    placeholder="Deskripsi lengkap produk"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Harga & Stok</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="harga">
                      Harga <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="harga"
                      type="number"
                      min="0"
                      step="1000"
                      value={data.harga}
                      onChange={(e) => setData('harga', e.target.value)}
                      placeholder="0"
                      className={errors.harga ? 'border-red-500' : ''}
                    />
                    {errors.harga && (
                      <p className="text-sm text-red-600">{errors.harga}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="harga_diskon">Harga Diskon</Label>
                    <Input
                      id="harga_diskon"
                      type="number"
                      min="0"
                      step="1000"
                      value={data.harga_diskon}
                      onChange={(e) => setData('harga_diskon', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stok">
                      Stok <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stok"
                      type="number"
                      min="0"
                      value={data.stok}
                      onChange={(e) => setData('stok', e.target.value)}
                      placeholder="0"
                      className={errors.stok ? 'border-red-500' : ''}
                    />
                    {errors.stok && (
                      <p className="text-sm text-red-600">{errors.stok}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimal_stok">Minimal Stok</Label>
                    <Input
                      id="minimal_stok"
                      type="number"
                      min="0"
                      value={data.minimal_stok}
                      onChange={(e) => setData('minimal_stok', e.target.value)}
                      placeholder="5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Produk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="berat">Berat (gram)</Label>
                    <Input
                      id="berat"
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.berat}
                      onChange={(e) => setData('berat', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dimensi">Dimensi</Label>
                    <Input
                      id="dimensi"
                      type="text"
                      value={data.dimensi}
                      onChange={(e) => setData('dimensi', e.target.value)}
                      placeholder="P x L x T (cm)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      type="text"
                      value={data.material}
                      onChange={(e) => setData('material', e.target.value)}
                      placeholder="Contoh: Kulit asli, Canvas, dll"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warna">Warna</Label>
                    <Input
                      id="warna"
                      type="text"
                      value={data.warna}
                      onChange={(e) => setData('warna', e.target.value)}
                      placeholder="Contoh: Hitam, Coklat, dll"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tag Produk</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                      <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Masukkan tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status Produk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="aktif">Produk Aktif</Label>
                  <Switch
                    id="aktif"
                    checked={data.aktif}
                    onCheckedChange={(checked: boolean) => setData('aktif', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="produk_unggulan">Produk Unggulan</Label>
                  <Switch
                    id="produk_unggulan"
                    checked={data.produk_unggulan}
                    onCheckedChange={(checked: boolean) => setData('produk_unggulan', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="produk_baru">Produk Baru</Label>
                  <Switch
                    id="produk_baru"
                    checked={data.produk_baru}
                    onCheckedChange={(checked: boolean) => setData('produk_baru', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Gambar Produk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">
                            Utama
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <Label
                    htmlFor="gambar"
                    className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Pilih Gambar
                  </Label>
                  <Input
                    id="gambar"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF hingga 2MB. Gambar pertama akan menjadi gambar utama.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button type="submit" disabled={processing} className="w-full">
                    {processing ? 'Menyimpan...' : 'Simpan Produk'}
                  </Button>
                  <Button type="button" variant="outline" asChild className="w-full">
                    <Link href="/admin/produk">
                      Batal
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
