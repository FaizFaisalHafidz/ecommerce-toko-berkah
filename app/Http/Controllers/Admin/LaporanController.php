<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\DetailPesanan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LaporanController extends Controller
{
    public function index()
    {
        // Date range default (30 hari terakhir)
        $defaultStartDate = Carbon::now()->subDays(30)->format('Y-m-d');
        $defaultEndDate = Carbon::now()->format('Y-m-d');

        return Inertia::render('Admin/Laporan/Index', [
            'defaultDateRange' => [
                'start' => $defaultStartDate,
                'end' => $defaultEndDate,
            ]
        ]);
    }

    public function penjualan(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'group_by' => 'nullable|in:day,week,month,year',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $groupBy = $request->group_by ?? 'day';

        // Query penjualan berdasarkan periode
        $penjualanQuery = Pesanan::where('status_pesanan', 'selesai')
            ->whereBetween('created_at', [$startDate->startOfDay(), $endDate->endOfDay()]);

        // Summary statistics
        $summary = [
            'total_penjualan' => $penjualanQuery->sum('total_akhir'),
            'total_pesanan' => $penjualanQuery->count(),
            'rata_rata_pesanan' => $penjualanQuery->avg('total_akhir'),
            'total_item_terjual' => DetailPesanan::whereHas('pesanan', function($q) use ($startDate, $endDate) {
                $q->where('status_pesanan', 'selesai')
                  ->whereBetween('created_at', [$startDate->startOfDay(), $endDate->endOfDay()]);
            })->sum('jumlah'),
        ];

        // Chart data berdasarkan group_by
        $chartData = $this->getChartData($startDate, $endDate, $groupBy);

        // Top selling products
        $topProducts = DetailPesanan::select([
                'produk_id',
                'nama_produk',
                DB::raw('SUM(jumlah) as total_kuantitas'),
                DB::raw('SUM(subtotal) as total_penjualan'),
                DB::raw('COUNT(DISTINCT pesanan_id) as total_transaksi')
            ])
            ->whereHas('pesanan', function($q) use ($startDate, $endDate) {
                $q->where('status_pesanan', 'selesai')
                  ->whereBetween('created_at', [$startDate->startOfDay(), $endDate->endOfDay()]);
            })
            ->groupBy('produk_id', 'nama_produk')
            ->orderByDesc('total_kuantitas')
            ->limit(10)
            ->get();

        // Payment method statistics
        $paymentMethods = Pesanan::select([
                'metode_pembayaran',
                DB::raw('COUNT(*) as total_transaksi'),
                DB::raw('SUM(total_akhir) as total_nilai')
            ])
            ->where('status_pesanan', 'selesai')
            ->whereBetween('created_at', [$startDate->startOfDay(), $endDate->endOfDay()])
            ->groupBy('metode_pembayaran')
            ->get();

        return response()->json([
            'summary' => $summary,
            'chart_data' => $chartData,
            'top_products' => $topProducts,
            'payment_methods' => $paymentMethods,
            'period' => [
                'start' => $startDate->format('d M Y'),
                'end' => $endDate->format('d M Y'),
                'group_by' => $groupBy,
            ]
        ]);
    }

    public function stok()
    {
        // Produk dengan stok menipis
        $stokMenupis = Produk::with(['kategori', 'gambarProduk'])
            ->where('aktif', true)
            ->whereColumn('stok', '<=', 'minimal_stok')
            ->orderBy('stok', 'asc')
            ->get()
            ->map(function ($produk) {
                $gambarUtama = $produk->gambarProduk->where('gambar_utama', true)->first();
                return [
                    'id' => $produk->id,
                    'nama_produk' => $produk->nama_produk,
                    'sku' => $produk->sku,
                    'kategori' => $produk->kategori?->nama_kategori ?? 'Tanpa Kategori',
                    'stok' => $produk->stok,
                    'minimal_stok' => $produk->minimal_stok,
                    'status_stok' => $produk->stok == 0 ? 'habis' : 'menipis',
                    'gambar' => $gambarUtama ? asset('storage/' . $gambarUtama->path_gambar) : null,
                ];
            });

        // Produk terlaris
        $produkTerlaris = DetailPesanan::select([
                'produk_id',
                'nama_produk',
                DB::raw('SUM(jumlah) as total_terjual')
            ])
            ->whereHas('pesanan', function($q) {
                $q->where('status_pesanan', 'selesai')
                  ->where('created_at', '>=', Carbon::now()->subDays(30));
            })
            ->groupBy('produk_id', 'nama_produk')
            ->orderByDesc('total_terjual')
            ->limit(10)
            ->get();

        // Summary stok
        $summary = [
            'total_produk' => Produk::where('aktif', true)->count(),
            'stok_habis' => Produk::where('aktif', true)->where('stok', 0)->count(),
            'stok_menipis' => Produk::where('aktif', true)->whereColumn('stok', '<=', 'minimal_stok')->where('stok', '>', 0)->count(),
            'total_nilai_stok' => Produk::where('aktif', true)->sum(DB::raw('stok * harga')),
        ];

        return response()->json([
            'stok_menipis' => $stokMenupis,
            'produk_terlaris' => $produkTerlaris,
            'summary' => $summary,
        ]);
    }

    public function customer()
    {
        // Customer statistics
        $totalCustomers = Pesanan::distinct('email_customer')->count();
        $newCustomers = Pesanan::where('created_at', '>=', Carbon::now()->subDays(30))
            ->distinct('email_customer')
            ->count();

        // Top customers by total purchase
        $topCustomers = Pesanan::select([
                'nama_customer',
                'email_customer',
                DB::raw('COUNT(*) as total_pesanan'),
                DB::raw('SUM(total_akhir) as total_belanja')
            ])
            ->where('status_pesanan', 'selesai')
            ->groupBy('nama_customer', 'email_customer')
            ->orderByDesc('total_belanja')
            ->limit(10)
            ->get();

        // Customer acquisition by month
        $acquisitionData = Pesanan::select([
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as bulan'),
                DB::raw('COUNT(DISTINCT email_customer) as customers_baru')
            ])
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->get();

        return response()->json([
            'summary' => [
                'total_customers' => $totalCustomers,
                'new_customers' => $newCustomers,
                'repeat_customers' => $totalCustomers - $newCustomers,
            ],
            'top_customers' => $topCustomers,
            'acquisition_data' => $acquisitionData,
        ]);
    }

    private function getChartData($startDate, $endDate, $groupBy)
    {
        $dateFormat = match($groupBy) {
            'day' => '%Y-%m-%d',
            'week' => '%Y-%u',
            'month' => '%Y-%m',
            'year' => '%Y',
            default => '%Y-%m-%d'
        };

        $data = Pesanan::select([
                DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as periode"),
                DB::raw('COUNT(*) as total_pesanan'),
                DB::raw('SUM(total_akhir) as total_penjualan')
            ])
            ->where('status_pesanan', 'selesai')
            ->whereBetween('created_at', [$startDate->startOfDay(), $endDate->endOfDay()])
            ->groupBy('periode')
            ->orderBy('periode')
            ->get();

        return $data->map(function ($item) use ($groupBy) {
            $label = match($groupBy) {
                'day' => Carbon::parse($item->periode)->format('d M'),
                'week' => 'Week ' . Carbon::parse($item->periode)->format('W, Y'),
                'month' => Carbon::parse($item->periode . '-01')->format('M Y'),
                'year' => $item->periode,
                default => $item->periode
            };

            return [
                'periode' => $item->periode,
                'label' => $label,
                'total_pesanan' => $item->total_pesanan,
                'total_penjualan' => $item->total_penjualan,
            ];
        });
    }

    public function export(Request $request)
    {
        // Export functionality will be implemented later
        return response()->json([
            'message' => 'Export functionality will be available soon'
        ]);
    }
}
