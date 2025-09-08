<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UlasanProduk;
use App\Models\Produk;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        $query = UlasanProduk::with(['produk', 'user'])
            ->orderBy('created_at', 'desc');

        // Filter berdasarkan rating
        if ($request->has('rating') && $request->rating !== '') {
            $query->where('rating', $request->rating);
        }

        // Filter berdasarkan status approval
        if ($request->has('status') && $request->status !== '') {
            if ($request->status === 'approved') {
                $query->where('disetujui', true);
            } elseif ($request->status === 'pending') {
                $query->where('disetujui', false)->whereNull('alasan_penolakan');
            } elseif ($request->status === 'rejected') {
                $query->where('disetujui', false)->whereNotNull('alasan_penolakan');
            }
        }

        // Filter berdasarkan produk
        if ($request->has('produk_id') && $request->produk_id !== '') {
            $query->where('produk_id', $request->produk_id);
        }

        // Search
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('judul_ulasan', 'like', '%' . $search . '%')
                  ->orWhere('isi_ulasan', 'like', '%' . $search . '%')
                  ->orWhereHas('user', function($q) use ($search) {
                      $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                  })
                  ->orWhereHas('produk', function($q) use ($search) {
                      $q->where('nama_produk', 'like', '%' . $search . '%');
                  });
            });
        }

        $ulasans = $query->paginate(10)->withQueryString();

        // Transform data untuk frontend
        $ulasans->getCollection()->transform(function ($ulasan) {
            return [
                'id' => $ulasan->id,
                'produk_id' => $ulasan->produk_id,
                'nama_customer' => $ulasan->user ? $ulasan->user->name : 'Guest',
                'email_customer' => $ulasan->user ? $ulasan->user->email : '-',
                'rating' => $ulasan->rating,
                'komentar' => $ulasan->isi_ulasan,
                'judul_ulasan' => $ulasan->judul_ulasan,
                'status' => $this->getStatus($ulasan),
                'created_at' => $ulasan->created_at,
                'produk' => [
                    'id' => $ulasan->produk->id,
                    'nama_produk' => $ulasan->produk->nama_produk,
                    'slug' => $ulasan->produk->slug,
                ],
            ];
        });

        // Statistics
        $statistics = [
            'total_ulasan' => UlasanProduk::count(),
            'ulasan_pending' => UlasanProduk::where('disetujui', false)->whereNull('alasan_penolakan')->count(),
            'ulasan_approved' => UlasanProduk::where('disetujui', true)->count(),
            'rata_rata_rating' => round(UlasanProduk::where('disetujui', true)->avg('rating'), 1),
        ];

        // Rating distribution
        $ratingDistribution = UlasanProduk::select('rating', DB::raw('count(*) as total'))
            ->where('disetujui', true)
            ->groupBy('rating')
            ->orderBy('rating', 'desc')
            ->get()
            ->pluck('total', 'rating')
            ->toArray();

        // Get products for filter
        $products = Produk::select('id', 'nama_produk')
            ->where('aktif', true)
            ->orderBy('nama_produk')
            ->get();

        return Inertia::render('Admin/Feedback/Index', [
            'ulasans' => $ulasans,
            'statistics' => $statistics,
            'ratingDistribution' => $ratingDistribution,
            'products' => $products,
            'filters' => $request->only(['rating', 'status', 'produk_id', 'search']),
        ]);
    }

    private function getStatus($ulasan)
    {
        if ($ulasan->disetujui) {
            return 'approved';
        } elseif ($ulasan->alasan_penolakan) {
            return 'rejected';
        } else {
            return 'pending';
        }
    }

    public function show(UlasanProduk $feedback)
    {
        $feedback->load(['produk', 'user']);

        // Transform data untuk frontend
        $feedbackData = [
            'id' => $feedback->id,
            'produk_id' => $feedback->produk_id,
            'nama_customer' => $feedback->user ? $feedback->user->name : 'Guest',
            'email_customer' => $feedback->user ? $feedback->user->email : '-',
            'rating' => $feedback->rating,
            'komentar' => $feedback->isi_ulasan,
            'judul_ulasan' => $feedback->judul_ulasan,
            'status' => $this->getStatus($feedback),
            'created_at' => $feedback->created_at,
            'updated_at' => $feedback->updated_at,
            'produk' => [
                'id' => $feedback->produk->id,
                'nama_produk' => $feedback->produk->nama_produk,
                'slug' => $feedback->produk->slug,
                'harga' => $feedback->produk->harga,
                'gambar_utama' => $feedback->produk->gambar_utama,
            ],
        ];

        return Inertia::render('Admin/Feedback/Show', [
            'feedback' => $feedbackData,
        ]);
    }

    public function updateStatus(Request $request, UlasanProduk $feedback)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $status = $request->status;

        if ($status === 'approved') {
            $feedback->update([
                'disetujui' => true,
                'alasan_penolakan' => null,
            ]);
        } elseif ($status === 'rejected') {
            $feedback->update([
                'disetujui' => false,
                'alasan_penolakan' => 'Ditolak oleh admin',
            ]);
        } else { // pending
            $feedback->update([
                'disetujui' => false,
                'alasan_penolakan' => null,
            ]);
        }

        return redirect()->back()->with('success', 'Status ulasan berhasil diperbarui');
    }

    public function destroy(UlasanProduk $feedback)
    {
        $feedback->delete();

        return redirect()->route('admin.feedback.index')->with('success', 'Ulasan berhasil dihapus');
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:approve,reject,delete',
            'ids' => 'required|array',
            'ids.*' => 'exists:ulasan_produk,id',
        ]);

        $ids = $request->ids;
        $action = $request->action;

        switch ($action) {
            case 'approve':
                UlasanProduk::whereIn('id', $ids)->update([
                    'disetujui' => true,
                    'alasan_penolakan' => null,
                ]);
                $message = 'Ulasan berhasil disetujui';
                break;
            case 'reject':
                UlasanProduk::whereIn('id', $ids)->update([
                    'disetujui' => false,
                    'alasan_penolakan' => 'Ditolak oleh admin',
                ]);
                $message = 'Ulasan berhasil ditolak';
                break;
            case 'delete':
                UlasanProduk::whereIn('id', $ids)->delete();
                $message = 'Ulasan berhasil dihapus';
                break;
        }

        return redirect()->back()->with('success', $message);
    }

    public function analytics()
    {
        // Monthly reviews trend
        $monthlyTrend = UlasanProduk::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as total_ulasan'),
                DB::raw('AVG(rating) as rata_rata_rating')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->groupBy(DB::raw('YEAR(created_at), MONTH(created_at)'))
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function($item) {
                return [
                    'periode' => Carbon::create($item->year, $item->month, 1)->format('M Y'),
                    'total_ulasan' => $item->total_ulasan,
                    'rata_rata_rating' => round($item->rata_rata_rating, 1),
                ];
            });

        // Top rated products
        $topRatedProducts = Produk::select([
                'produk.id',
                'produk.nama_produk',
                DB::raw('COUNT(ulasan_produk.id) as total_ulasan'),
                DB::raw('AVG(ulasan_produk.rating) as rata_rata_rating')
            ])
            ->leftJoin('ulasan_produk', function($join) {
                $join->on('produk.id', '=', 'ulasan_produk.produk_id')
                     ->where('ulasan_produk.disetujui', '=', true);
            })
            ->groupBy('produk.id', 'produk.nama_produk')
            ->having('total_ulasan', '>', 0)
            ->orderByDesc('rata_rata_rating')
            ->orderByDesc('total_ulasan')
            ->limit(10)
            ->get()
            ->map(function($item) {
                return [
                    'nama_produk' => $item->nama_produk,
                    'total_ulasan' => $item->total_ulasan,
                    'rata_rata_rating' => round($item->rata_rata_rating, 1),
                ];
            });

        // Customer satisfaction
        $satisfaction = [
            'sangat_puas' => UlasanProduk::where('disetujui', true)->where('rating', 5)->count(),
            'puas' => UlasanProduk::where('disetujui', true)->where('rating', 4)->count(),
            'cukup' => UlasanProduk::where('disetujui', true)->where('rating', 3)->count(),
            'kurang_puas' => UlasanProduk::where('disetujui', true)->where('rating', 2)->count(),
            'tidak_puas' => UlasanProduk::where('disetujui', true)->where('rating', 1)->count(),
        ];

        return response()->json([
            'monthly_trend' => $monthlyTrend,
            'top_rated_products' => $topRatedProducts,
            'satisfaction' => $satisfaction,
        ]);
    }
}
