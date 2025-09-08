import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Mail, MapPin, Package, Phone, ShoppingBag, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';

interface Pesanan {
  id: number;
  tanggal_pesanan: string;
  total_pesanan: number;
  status_pesanan: string;
  jumlah_item: number;
}

interface Customer {
  id?: number;
  nama_customer: string;
  email_customer: string;
  telepon_customer: string;
  alamat_lengkap: string;
  kota: string;
  provinsi: string;
  kode_pos: string;
  is_registered: boolean;
  status_customer: string;
  total_pesanan: number;
  total_belanja: number;
  pesanan_terakhir: string;
  bergabung_sejak: string;
}

interface Props {
  customer: Customer;
  pesanan: Pesanan[];
  statistik: {
    total_pesanan: number;
    total_belanja: number;
    rata_rata_pesanan: number;
    pesanan_selesai: number;
  };
}

export default function Show({ customer, pesanan, statistik }: Props) {
  const handleBack = () => {
    router.get('/admin/pelanggan');
  };

  const handleEdit = () => {
    if (!customer.is_registered) {
      alert('Hanya data member yang dapat diedit');
      return;
    }
    router.get(`/admin/pelanggan/${encodeURIComponent(customer.email_customer)}/edit`);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'diproses': 'bg-blue-100 text-blue-800',
      'dikirim': 'bg-purple-100 text-purple-800',
      'selesai': 'bg-green-100 text-green-800',
      'dibatalkan': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AppLayout>
      <Head title={`Detail Pelanggan - ${customer.nama_customer}`} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail Pelanggan</h1>
              <p className="text-gray-600">Informasi lengkap pelanggan dan riwayat pesanan</p>
            </div>
          </div>
          
          {customer.is_registered && (
            <Button onClick={handleEdit}>
              Edit Data
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informasi Pelanggan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                  <p className="text-lg font-semibold">{customer.nama_customer}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{customer.email_customer}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{customer.telepon_customer}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div className="text-sm">
                    <p>{customer.alamat_lengkap}</p>
                    <p className="text-gray-500">{customer.kota}, {customer.provinsi} {customer.kode_pos}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {customer.is_registered ? `Bergabung ${customer.bergabung_sejak}` : `Terakhir order ${customer.pesanan_terakhir}`}
                  </span>
                </div>

                <div>
                  <Badge 
                    variant={customer.is_registered ? 'default' : 'secondary'}
                    className={customer.is_registered ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {customer.status_customer}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Statistik Pembelian</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{statistik.total_pesanan}</p>
                    <p className="text-sm text-blue-500">Total Pesanan</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      Rp {statistik.total_belanja.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-green-500">Total Belanja</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      Rp {statistik.rata_rata_pesanan.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-purple-500">Rata-rata Pesanan</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{statistik.pesanan_selesai}</p>
                    <p className="text-sm text-orange-500">Pesanan Selesai</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Riwayat Pesanan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pesanan.length > 0 ? (
                  <div className="space-y-4">
                    {pesanan.map((order, index) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">Pesanan #{order.id}</h4>
                            <p className="text-sm text-gray-500">{order.tanggal_pesanan}</p>
                          </div>
                          <Badge className={getStatusBadge(order.status_pesanan)}>
                            {order.status_pesanan.charAt(0).toUpperCase() + order.status_pesanan.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{order.jumlah_item} item</span>
                            <span>•</span>
                            <span className="font-semibold text-gray-900">
                              Rp {order.total_pesanan.toLocaleString('id-ID')}
                            </span>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.get(`/admin/pesanan/${order.id}`)}
                          >
                            Lihat Detail
                          </Button>
                        </div>
                        
                        {index < pesanan.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Belum ada riwayat pesanan</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
