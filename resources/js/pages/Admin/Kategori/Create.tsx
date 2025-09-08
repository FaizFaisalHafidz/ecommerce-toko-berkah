import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

export default function Create() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { data, setData, post, processing, errors, clearErrors } = useForm({
    nama_kategori: '',
    deskripsi_kategori: '',
    gambar_kategori: null as File | null,
    aktif: true,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('gambar_kategori', file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setData('gambar_kategori', null);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post('/admin/kategori', {
      onSuccess: () => {
        toast.success('Kategori berhasil ditambahkan');
      },
      onError: (errors) => {
        toast.error('Terjadi kesalahan saat menambahkan kategori');
      },
    });
  };

  return (
    <AppLayout>
      <Head title="Tambah Kategori" />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/kategori">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tambah Kategori</h1>
              <p className="text-gray-600 mt-1">Buat kategori produk baru</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kategori</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nama Kategori */}
              <div className="space-y-2">
                <Label htmlFor="nama_kategori">
                  Nama Kategori <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nama_kategori"
                  type="text"
                  value={data.nama_kategori}
                  onChange={(e) => {
                    setData('nama_kategori', e.target.value);
                    clearErrors('nama_kategori');
                  }}
                  placeholder="Masukkan nama kategori"
                  className={errors.nama_kategori ? 'border-red-500' : ''}
                />
                {errors.nama_kategori && (
                  <p className="text-sm text-red-600">{errors.nama_kategori}</p>
                )}
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <Label htmlFor="deskripsi_kategori">Deskripsi</Label>
                <Textarea
                  id="deskripsi_kategori"
                  value={data.deskripsi_kategori}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setData('deskripsi_kategori', e.target.value);
                    clearErrors('deskripsi_kategori');
                  }}
                  placeholder="Masukkan deskripsi kategori (opsional)"
                  rows={4}
                  className={errors.deskripsi_kategori ? 'border-red-500' : ''}
                />
                {errors.deskripsi_kategori && (
                  <p className="text-sm text-red-600">{errors.deskripsi_kategori}</p>
                )}
              </div>

              {/* Gambar */}
              <div className="space-y-2">
                <Label htmlFor="gambar_kategori">Gambar Kategori</Label>
                <div className="space-y-4">
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Label
                          htmlFor="gambar_kategori"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Pilih Gambar
                        </Label>
                        <Input
                          id="gambar_kategori"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        PNG, JPG, GIF hingga 2MB
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {errors.gambar_kategori && (
                  <p className="text-sm text-red-600">{errors.gambar_kategori}</p>
                )}
              </div>

              {/* Status Aktif */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="aktif"
                    checked={data.aktif}
                    onCheckedChange={(checked: boolean) => setData('aktif', checked)}
                  />
                  <Label htmlFor="aktif">Kategori Aktif</Label>
                </div>
                <p className="text-sm text-gray-500">
                  Kategori yang aktif akan ditampilkan di halaman depan
                </p>
              </div>

              {/* Tombol Submit */}
              <div className="flex items-center space-x-4 pt-4">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Menyimpan...' : 'Simpan Kategori'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/kategori">
                    Batal
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
