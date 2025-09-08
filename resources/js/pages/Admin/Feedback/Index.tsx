import { Head, router } from '@inertiajs/react';
import {
    BarChart3,
    Check,
    CheckCircle,
    Clock,
    Eye,
    MessageSquare,
    MoreHorizontal,
    Search,
    Star,
    Trash2,
    X,
    XCircle
} from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { toast } from 'sonner';

interface Ulasan {
  id: number;
  produk_id: number;
  nama_customer: string;
  email_customer: string;
  rating: number;
  komentar: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  produk: {
    id: number;
    nama_produk: string;
    slug: string;
  };
}

interface Product {
  id: number;
  nama_produk: string;
}

interface Statistics {
  total_ulasan: number;
  ulasan_pending: number;
  ulasan_approved: number;
  rata_rata_rating: number;
}

interface Props {
  ulasans: {
    data: Ulasan[];
    links: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  statistics: Statistics;
  ratingDistribution: Record<string, number>;
  recentReviews: Ulasan[];
  products: Product[];
  filters: {
    rating?: string;
    status?: string;
    produk_id?: string;
    search?: string;
  };
}

export default function Index({ 
  ulasans, 
  statistics, 
  ratingDistribution, 
  recentReviews, 
  products, 
  filters 
}: Props) {
  const [selectedUlasans, setSelectedUlasans] = useState<number[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    
    router.get('/admin/feedback', {
      ...filters,
      search: search || undefined,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleFilter = (key: string, value: string) => {
    router.get('/admin/feedback', {
      ...filters,
      [key]: value || undefined,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await router.patch(`/admin/feedback/${id}/status`, { status });
      toast.success('Status ulasan berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui status');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
      try {
        await router.delete(`/admin/feedback/${id}`);
        toast.success('Ulasan berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus ulasan');
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUlasans.length === 0) {
      toast.error('Pilih ulasan terlebih dahulu');
      return;
    }

    if (confirm(`Apakah Anda yakin ingin ${action} ${selectedUlasans.length} ulasan?`)) {
      try {
        await router.post('/admin/feedback/bulk-action', {
          action,
          ids: selectedUlasans,
        });
        setSelectedUlasans([]);
        toast.success('Aksi berhasil dilakukan');
      } catch (error) {
        toast.error('Gagal melakukan aksi');
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedUlasans.length === ulasans.data.length) {
      setSelectedUlasans([]);
    } else {
      setSelectedUlasans(ulasans.data.map(u => u.id));
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AppLayout>
      <Head title="Feedback" />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feedback & Ulasan</h1>
            <p className="text-gray-600">Kelola ulasan dan feedback customer</p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{statistics.total_ulasan}</p>
                  <p className="text-sm text-gray-600">Total Ulasan</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{statistics.ulasan_pending}</p>
                  <p className="text-sm text-gray-600">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{statistics.ulasan_approved}</p>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{statistics.rata_rata_rating}</p>
                  <p className="text-sm text-gray-600">Rata-rata Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    name="search"
                    placeholder="Cari customer, produk, atau komentar..."
                    className="pl-10"
                    defaultValue={filters.search || ''}
                  />
                </div>
              </form>

              {/* Filter Rating */}
              <select
                value={filters.rating || ''}
                onChange={(e) => handleFilter('rating', e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Rating</option>
                <option value="5">5 Bintang</option>
                <option value="4">4 Bintang</option>
                <option value="3">3 Bintang</option>
                <option value="2">2 Bintang</option>
                <option value="1">1 Bintang</option>
              </select>

              {/* Filter Status */}
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilter('status', e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Filter Produk */}
              <select
                value={filters.produk_id || ''}
                onChange={(e) => handleFilter('produk_id', e.target.value)}
                className="w-52 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Produk</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id.toString()}>
                    {product.nama_produk}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedUlasans.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedUlasans.length} ulasan dipilih
                </span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('approve')}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('reject')}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkAction('delete')}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Ulasan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Header with select all */}
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Checkbox
                  checked={selectedUlasans.length === ulasans.data.length}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm text-gray-600">Pilih semua</span>
              </div>

              {ulasans.data.map((ulasan) => (
                <div key={ulasan.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <Checkbox
                    checked={selectedUlasans.includes(ulasan.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedUlasans([...selectedUlasans, ulasan.id]);
                      } else {
                        setSelectedUlasans(selectedUlasans.filter(id => id !== ulasan.id));
                      }
                    }}
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{ulasan.nama_customer}</h3>
                          {getStatusBadge(ulasan.status)}
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">{renderStars(ulasan.rating)}</div>
                          <span className="text-sm text-gray-500">
                            untuk {ulasan.produk.nama_produk}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-2">{ulasan.komentar}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{ulasan.email_customer}</span>
                          <span>{new Date(ulasan.created_at).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.get(`/admin/feedback/${ulasan.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Detail
                          </DropdownMenuItem>
                          
                          {ulasan.status !== 'approved' && (
                            <DropdownMenuItem onClick={() => handleStatusUpdate(ulasan.id, 'approved')}>
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          
                          {ulasan.status !== 'rejected' && (
                            <DropdownMenuItem onClick={() => handleStatusUpdate(ulasan.id, 'rejected')}>
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem 
                            onClick={() => handleDelete(ulasan.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}

              {ulasans.data.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada ulasan ditemukan
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {ulasans.last_page > 1 && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {ulasans.links.map((link, index) => (
                <Button
                  key={index}
                  variant={link.active ? "default" : "outline"}
                  size="sm"
                  disabled={!link.url}
                  onClick={() => link.url && router.get(link.url)}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
