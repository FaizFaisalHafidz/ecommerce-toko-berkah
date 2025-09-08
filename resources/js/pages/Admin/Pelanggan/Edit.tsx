import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, User } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { toast } from 'sonner';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
}

interface Props {
  customer: Customer;
}

export default function Edit({ customer }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: customer.name || '',
    email: customer.email || '',
    phone: customer.phone || '',
    address: customer.address || '',
    city: customer.city || '',
    province: customer.province || '',
    postal_code: customer.postal_code || '',
  });

  const handleBack = () => {
    router.get(`/admin/pelanggan/${encodeURIComponent(customer.email)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    put(`/admin/pelanggan/${customer.id}`, {
      onSuccess: () => {
        toast.success('Data pelanggan berhasil diperbarui');
        router.get(`/admin/pelanggan/${encodeURIComponent(customer.email)}`);
      },
      onError: () => {
        toast.error('Terjadi kesalahan saat memperbarui data');
      },
    });
  };

  return (
    <AppLayout>
      <Head title={`Edit Pelanggan - ${customer.name}`} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Pelanggan</h1>
            <p className="text-gray-600">Perbarui informasi pelanggan member</p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informasi Pelanggan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className={errors.name ? 'border-red-500' : ''}
                      placeholder="Masukkan nama lengkap"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                      placeholder="Masukkan email"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <Input
                    id="phone"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    className={errors.phone ? 'border-red-500' : ''}
                    placeholder="Masukkan nomor telepon"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap *</Label>
                  <Textarea
                    id="address"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    className={errors.address ? 'border-red-500' : ''}
                    placeholder="Masukkan alamat lengkap"
                    rows={3}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota *</Label>
                    <Input
                      id="city"
                      value={data.city}
                      onChange={(e) => setData('city', e.target.value)}
                      className={errors.city ? 'border-red-500' : ''}
                      placeholder="Masukkan kota"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="province">Provinsi *</Label>
                    <Input
                      id="province"
                      value={data.province}
                      onChange={(e) => setData('province', e.target.value)}
                      className={errors.province ? 'border-red-500' : ''}
                      placeholder="Masukkan provinsi"
                    />
                    {errors.province && (
                      <p className="text-sm text-red-500">{errors.province}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Kode Pos</Label>
                    <Input
                      id="postal_code"
                      value={data.postal_code}
                      onChange={(e) => setData('postal_code', e.target.value)}
                      className={errors.postal_code ? 'border-red-500' : ''}
                      placeholder="Kode pos"
                    />
                    {errors.postal_code && (
                      <p className="text-sm text-red-500">{errors.postal_code}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <Button type="submit" disabled={processing}>
                    <Save className="h-4 w-4 mr-2" />
                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleBack}
                    disabled={processing}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
