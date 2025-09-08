import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Check,
    CheckCircle,
    Clock,
    Mail,
    MessageSquare,
    Package,
    Star,
    Trash2,
    X,
    XCircle
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { toast } from 'sonner';

interface Feedback {
  id: number;
  produk_id: number;
  nama_customer: string;
  email_customer: string;
  rating: number;
  komentar: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  produk: {
    id: number;
    nama_produk: string;
    slug: string;
    harga: number;
    gambar_utama: string | null;
  };
}

interface Props {
  feedback: Feedback;
}

export default function Show({ feedback }: Props) {
  const handleStatusUpdate = async (status: string) => {
    try {
      await router.patch(`/admin/feedback/${feedback.id}/status`, { status });
      toast.success('Status ulasan berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui status');
    }
  };

  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
      try {
        await router.delete(`/admin/feedback/${feedback.id}`);
        toast.success('Ulasan berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus ulasan');
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="flex items-center">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AppLayout>
      <Head title={`Detail Feedback - ${feedback.nama_customer}`} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/feedback">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail Feedback</h1>
              <p className="text-gray-600">#{feedback.id}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            {feedback.status !== 'approved' && (
              <Button onClick={() => handleStatusUpdate('approved')}>
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
            )}
            {feedback.status !== 'rejected' && (
              <Button variant="outline" onClick={() => handleStatusUpdate('rejected')}>
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            )}
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Review Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Review Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Ulasan Customer</span>
                  </CardTitle>
                  {getStatusBadge(feedback.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-blue-600">
                      {feedback.nama_customer.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feedback.nama_customer}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      <span>{feedback.email_customer}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Rating</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex">{renderStars(feedback.rating)}</div>
                    <span className="text-lg font-semibold">{feedback.rating}/5</span>
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Komentar</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{feedback.komentar}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Dibuat: {new Date(feedback.created_at).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Diupdate: {new Date(feedback.updated_at).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Produk</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Product Image */}
                  <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    {feedback.produk.gambar_utama ? (
                      <img
                        src={feedback.produk.gambar_utama}
                        alt={feedback.produk.nama_produk}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">
                      {feedback.produk.nama_produk}
                    </h3>
                    <p className="text-lg font-bold text-blue-600">
                      Rp {(feedback.produk.harga || 0).toLocaleString('id-ID')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link href={`/admin/produk/${feedback.produk.id}`}>
                      <Button variant="outline" className="w-full">
                        Lihat Produk
                      </Button>
                    </Link>
                    <Link href={`/products/${feedback.produk.slug}`} target="_blank">
                      <Button variant="outline" className="w-full">
                        Lihat di Website
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status History */}
            <Card>
              <CardHeader>
                <CardTitle>Status History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Ulasan dibuat</p>
                      <p className="text-xs text-gray-500">
                        {new Date(feedback.created_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  
                  {feedback.updated_at !== feedback.created_at && (
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        feedback.status === 'approved' ? 'bg-green-500' : 
                        feedback.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Status diubah ke {feedback.status}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(feedback.updated_at).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
