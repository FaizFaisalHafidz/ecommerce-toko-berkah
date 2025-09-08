import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    BarChart3,
    DollarSign,
    Download,
    Package,
    RefreshCw,
    ShoppingCart,
    Star,
    TrendingUp,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { toast } from 'sonner';

interface Props {
  defaultDateRange: {
    start: string;
    end: string;
  };
}

interface SalesData {
  summary: {
    total_penjualan: number;
    total_pesanan: number;
    rata_rata_pesanan: number;
    total_item_terjual: number;
  };
  chart_data: Array<{
    periode: string;
    label: string;
    total_pesanan: number;
    total_penjualan: number;
  }>;
  top_products: Array<{
    produk_id: number;
    nama_produk: string;
    total_kuantitas: number;
    total_penjualan: number;
    total_transaksi: number;
  }>;
  payment_methods: Array<{
    metode_pembayaran: string;
    total_transaksi: number;
    total_nilai: number;
  }>;
  period: {
    start: string;
    end: string;
    group_by: string;
  };
}

interface StockData {
  stok_menipis: Array<{
    id: number;
    nama_produk: string;
    sku: string;
    kategori: string;
    stok: number;
    minimal_stok: number;
    status_stok: string;
    gambar: string | null;
  }>;
  produk_terlaris: Array<{
    produk_id: number;
    nama_produk: string;
    total_terjual: number;
  }>;
  summary: {
    total_produk: number;
    stok_habis: number;
    stok_menipis: number;
    total_nilai_stok: number;
  };
}

interface CustomerData {
  summary: {
    total_customers: number;
    new_customers: number;
    repeat_customers: number;
  };
  top_customers: Array<{
    nama_customer: string;
    email_customer: string;
    total_pesanan: number;
    total_belanja: number;
  }>;
  acquisition_data: Array<{
    bulan: string;
    customers_baru: number;
  }>;
}

export default function Index({ defaultDateRange }: Props) {
  const [activeTab, setActiveTab] = useState('penjualan');
  const [dateRange, setDateRange] = useState({
    start: defaultDateRange.start,
    end: defaultDateRange.end,
  });
  const [groupBy, setGroupBy] = useState('day');
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/admin/laporan/penjualan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          start_date: dateRange.start,
          end_date: dateRange.end,
          group_by: groupBy,
        }),
      });
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      toast.error('Gagal mengambil data penjualan');
    } finally {
      setLoading(false);
    }
  };

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/admin/laporan/stok');
      const data = await response.json();
      setStockData(data);
    } catch (error) {
      toast.error('Gagal mengambil data stok');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/admin/laporan/customer');
      const data = await response.json();
      setCustomerData(data);
    } catch (error) {
      toast.error('Gagal mengambil data customer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'penjualan') {
      fetchSalesData();
    } else if (activeTab === 'stok') {
      fetchStockData();
    } else if (activeTab === 'customer') {
      fetchCustomerData();
    }
  }, [activeTab, dateRange, groupBy]);

  const handleRefresh = () => {
    if (activeTab === 'penjualan') {
      fetchSalesData();
    } else if (activeTab === 'stok') {
      fetchStockData();
    } else if (activeTab === 'customer') {
      fetchCustomerData();
    }
  };

  const handleExport = () => {
    toast.info('Fitur export akan segera tersedia');
  };

  return (
    <AppLayout>
      <Head title="Laporan" />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
            <p className="text-gray-600">Analisis dan laporan bisnis komprehensif</p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="penjualan" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Penjualan</span>
            </TabsTrigger>
            <TabsTrigger value="stok" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Stok</span>
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Customer</span>
            </TabsTrigger>
          </TabsList>

          {/* Sales Report */}
          <TabsContent value="penjualan" className="space-y-6">
            {/* Date Range Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Periode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Dari Tanggal</Label>
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sampai Tanggal</Label>
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Grup By</Label>
                    <Select value={groupBy} onValueChange={setGroupBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Harian</SelectItem>
                        <SelectItem value="week">Mingguan</SelectItem>
                        <SelectItem value="month">Bulanan</SelectItem>
                        <SelectItem value="year">Tahunan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={fetchSalesData} disabled={loading} className="w-full">
                      {loading ? 'Loading...' : 'Terapkan'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {salesData && (
              <>
                {/* Sales Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">
                            Rp {(salesData.summary.total_penjualan || 0).toLocaleString('id-ID')}
                          </p>
                          <p className="text-sm text-gray-600">Total Penjualan</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">{salesData.summary.total_pesanan || 0}</p>
                          <p className="text-sm text-gray-600">Total Pesanan</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-8 w-8 text-purple-500" />
                        <div>
                          <p className="text-2xl font-bold">
                            Rp {Math.round(salesData.summary.rata_rata_pesanan || 0).toLocaleString('id-ID')}
                          </p>
                          <p className="text-sm text-gray-600">Rata-rata Pesanan</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Package className="h-8 w-8 text-orange-500" />
                        <div>
                          <p className="text-2xl font-bold">{salesData.summary.total_item_terjual || 0}</p>
                          <p className="text-sm text-gray-600">Item Terjual</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Produk Terlaris</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {salesData.top_products.map((product, index) => (
                          <div key={product.produk_id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium">{product.nama_produk}</p>
                                <p className="text-sm text-gray-500">{product.total_transaksi} transaksi</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{product.total_kuantitas} pcs</p>
                              <p className="text-sm text-gray-500">
                                Rp {(product.total_penjualan || 0).toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Methods */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Metode Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {salesData.payment_methods.map((method) => (
                          <div key={method.metode_pembayaran} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">{method.metode_pembayaran}</p>
                              <p className="text-sm text-gray-500">{method.total_transaksi} transaksi</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">
                                Rp {(method.total_nilai || 0).toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Stock Report */}
          <TabsContent value="stok" className="space-y-6">
            {stockData && (
              <>
                {/* Stock Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Package className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">{stockData.summary.total_produk}</p>
                          <p className="text-sm text-gray-600">Total Produk</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="text-2xl font-bold">{stockData.summary.stok_habis}</p>
                          <p className="text-sm text-gray-600">Stok Habis</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="text-2xl font-bold">{stockData.summary.stok_menipis}</p>
                          <p className="text-sm text-gray-600">Stok Menipis</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">
                            Rp {(stockData.summary.total_nilai_stok || 0).toLocaleString('id-ID')}
                          </p>
                          <p className="text-sm text-gray-600">Nilai Stok</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Stock Alerts & Best Sellers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <span>Stok Menipis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stockData.stok_menipis.slice(0, 5).map((product) => (
                          <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                              {product.gambar ? (
                                <img 
                                  src={product.gambar} 
                                  alt={product.nama_produk}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{product.nama_produk}</p>
                              <p className="text-sm text-gray-500">{product.kategori}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={product.status_stok === 'habis' ? 'destructive' : 'secondary'}>
                                  {product.status_stok === 'habis' ? 'Habis' : 'Menipis'}
                                </Badge>
                                <span className="text-sm">Stok: {product.stok}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span>Produk Terlaris (30 Hari)</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stockData.produk_terlaris.map((product, index) => (
                          <div key={product.produk_id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-yellow-600">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium">{product.nama_produk}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{product.total_terjual} pcs</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Customer Report */}
          <TabsContent value="customer" className="space-y-6">
            {customerData && (
              <>
                {/* Customer Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Users className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">{customerData.summary.total_customers}</p>
                          <p className="text-sm text-gray-600">Total Customer</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">{customerData.summary.new_customers}</p>
                          <p className="text-sm text-gray-600">Customer Baru (30 Hari)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Star className="h-8 w-8 text-purple-500" />
                        <div>
                          <p className="text-2xl font-bold">{customerData.summary.repeat_customers}</p>
                          <p className="text-sm text-gray-600">Repeat Customer</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Customers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Customer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {customerData.top_customers.map((customer, index) => (
                        <div key={customer.email_customer} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-purple-600">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{customer.nama_customer}</p>
                              <p className="text-sm text-gray-500">{customer.email_customer}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              Rp {(customer.total_belanja || 0).toLocaleString('id-ID')}
                            </p>
                            <p className="text-sm text-gray-500">{customer.total_pesanan} pesanan</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
