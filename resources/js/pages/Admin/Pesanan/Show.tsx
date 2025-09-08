import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Clock,
    CreditCard,
    Edit,
    MapPin,
    Package,
    Printer,
    Save,
    Truck,
    User,
    XCircle
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { toast } from 'sonner';

interface PesananItem {
  id: number;
  nama_produk: string;
  sku_produk: string;
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
  produk_id: number;
  gambar_produk: string | null;
}

interface Pesanan {
  id: number;
  nomor_pesanan: string;
  nama_customer: string;
  email_customer: string;
  telepon_customer: string;
  alamat_pengiriman: string;
  kota: string;
  provinsi: string;
  kode_pos: string;
  subtotal: number;
  ongkir: number;
  diskon: number;
  total_akhir: number;
  status_pesanan: string;
  status_pembayaran: string;
  metode_pembayaran: string;
  kurir: string;
  layanan_kurir: string;
  estimasi_pengiriman: string;
  nomor_resi: string;
  catatan: string;
  is_guest: boolean;
  user_id: number | null;
  tanggal_pesanan: string;
  tanggal_update: string;
  items: PesananItem[];
}

interface Props {
  pesanan: Pesanan;
}

export default function Show({ pesanan }: Props) {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingPayment, setIsEditingPayment] = useState(false);

  const { data: statusData, setData: setStatusData, patch: patchStatus, processing: processingStatus } = useForm({
    status_pesanan: pesanan.status_pesanan,
    catatan_admin: '',
    nomor_resi: pesanan.nomor_resi || '',
  });

  const { data: paymentData, setData: setPaymentData, patch: patchPayment, processing: processingPayment } = useForm({
    status_pembayaran: pesanan.status_pembayaran,
  });

  const handleBack = () => {
    router.get('/admin/pesanan');
  };

  const handleUpdateStatus = () => {
    patchStatus(`/admin/pesanan/${pesanan.id}/status`, {
      onSuccess: () => {
        toast.success('Status pesanan berhasil diperbarui');
        setIsEditingStatus(false);
      },
      onError: () => {
        toast.error('Terjadi kesalahan saat memperbarui status');
      },
    });
  };

  const handleUpdatePayment = () => {
    patchPayment(`/admin/pesanan/${pesanan.id}/payment-status`, {
      onSuccess: () => {
        toast.success('Status pembayaran berhasil diperbarui');
        setIsEditingPayment(false);
      },
      onError: () => {
        toast.error('Terjadi kesalahan saat memperbarui status pembayaran');
      },
    });
  };

  const handlePrintInvoice = () => {
    window.open(`/admin/pesanan/${pesanan.id}/invoice`, '_blank');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
      diproses: { label: 'Diproses', icon: Package, className: 'bg-blue-100 text-blue-800' },
      dikirim: { label: 'Dikirim', icon: Truck, className: 'bg-purple-100 text-purple-800' },
      selesai: { label: 'Selesai', icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      dibatalkan: { label: 'Dibatalkan', icon: XCircle, className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config?.icon || AlertCircle;

    return (
      <Badge className={config?.className || 'bg-gray-100 text-gray-800'}>
        <IconComponent className="w-4 h-4 mr-2" />
        {config?.label || status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Menunggu Pembayaran', className: 'bg-yellow-100 text-yellow-800' },
      berhasil: { label: 'Pembayaran Berhasil', className: 'bg-green-100 text-green-800' },
      gagal: { label: 'Pembayaran Gagal', className: 'bg-red-100 text-red-800' },
      expired: { label: 'Pembayaran Kadaluarsa', className: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <Badge className={config?.className || 'bg-gray-100 text-gray-800'}>
        <CreditCard className="w-4 h-4 mr-2" />
        {config?.label || status}
      </Badge>
    );
  };

  return (
    <AppLayout>
      <Head title={`Pesanan ${pesanan.nomor_pesanan}`} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pesanan {pesanan.nomor_pesanan}
              </h1>
              <p className="text-gray-600">Detail lengkap pesanan customer</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrintInvoice}>
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Item Pesanan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pesanan.items.map((item, index) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        {item.gambar_produk ? (
                          <img 
                            src={item.gambar_produk} 
                            alt={item.nama_produk}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.nama_produk}</h4>
                        <p className="text-sm text-gray-500">SKU: {item.sku_produk}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm">
                            <span className="font-medium">
                              Rp {(item.harga_satuan || 0).toLocaleString('id-ID')}
                            </span>
                            <span className="text-gray-500 ml-2">x {item.jumlah || 0}</span>
                          </div>
                          <div className="font-semibold">
                            Rp {(item.subtotal || 0).toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rp {(pesanan.subtotal || 0).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkir ({pesanan.kurir} - {pesanan.layanan_kurir}):</span>
                    <span>Rp {(pesanan.ongkir || 0).toLocaleString('id-ID')}</span>
                  </div>
                  {(pesanan.diskon || 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Diskon:</span>
                      <span>-Rp {(pesanan.diskon || 0).toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>Rp {(pesanan.total_akhir || 0).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informasi Customer</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nama</label>
                    <p className="text-lg">{pesanan.nama_customer}</p>
                    {pesanan.is_guest && (
                      <Badge variant="outline" className="mt-1">Guest Customer</Badge>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p>{pesanan.email_customer}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Telepon</label>
                    <p>{pesanan.telepon_customer}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Metode Pembayaran</label>
                    <p>{pesanan.metode_pembayaran}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Alamat Pengiriman</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>{pesanan.alamat_pengiriman}</p>
                  <p>{pesanan.kota}, {pesanan.provinsi} {pesanan.kode_pos}</p>
                </div>
                
                {pesanan.catatan && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-500">Catatan:</label>
                    <p className="text-sm bg-gray-50 p-2 rounded">{pesanan.catatan}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status Pesanan</label>
                  {isEditingStatus ? (
                    <div className="space-y-2">
                      <Select 
                        value={statusData.status_pesanan} 
                        onValueChange={(value) => setStatusData('status_pesanan', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="diproses">Diproses</SelectItem>
                          <SelectItem value="dikirim">Dikirim</SelectItem>
                          <SelectItem value="selesai">Selesai</SelectItem>
                          <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nomor_resi">Nomor Resi (Opsional)</Label>
                        <Input
                          id="nomor_resi"
                          value={statusData.nomor_resi}
                          onChange={(e) => setStatusData('nomor_resi', e.target.value)}
                          placeholder="Masukkan nomor resi"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="catatan_admin">Catatan Admin (Opsional)</Label>
                        <Textarea
                          id="catatan_admin"
                          value={statusData.catatan_admin}
                          onChange={(e) => setStatusData('catatan_admin', e.target.value)}
                          placeholder="Catatan untuk customer"
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleUpdateStatus} 
                          disabled={processingStatus}
                          size="sm"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Simpan
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditingStatus(false)}
                          size="sm"
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      {getStatusBadge(pesanan.status_pesanan)}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditingStatus(true)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status Pembayaran</label>
                  {isEditingPayment ? (
                    <div className="space-y-2">
                      <Select 
                        value={paymentData.status_pembayaran} 
                        onValueChange={(value) => setPaymentData('status_pembayaran', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="berhasil">Berhasil</SelectItem>
                          <SelectItem value="gagal">Gagal</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleUpdatePayment} 
                          disabled={processingPayment}
                          size="sm"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Simpan
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditingPayment(false)}
                          size="sm"
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      {getPaymentStatusBadge(pesanan.status_pembayaran)}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditingPayment(true)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {pesanan.nomor_resi && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nomor Resi</label>
                      <p className="font-mono text-sm bg-gray-50 p-2 rounded">
                        {pesanan.nomor_resi}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tanggal Pesanan</label>
                  <p>{pesanan.tanggal_pesanan}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Terakhir Update</label>
                  <p>{pesanan.tanggal_update}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Kurir</label>
                  <p>{pesanan.kurir} - {pesanan.layanan_kurir}</p>
                </div>
                
                {pesanan.estimasi_pengiriman && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Estimasi Pengiriman</label>
                    <p>{pesanan.estimasi_pengiriman}</p>
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
