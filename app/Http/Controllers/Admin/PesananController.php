<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use App\Models\DetailPesanan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class PesananController extends Controller
{
    public function index(Request $request)
    {
        $query = Pesanan::with(['detailPesanan.produk', 'user'])
            ->withCount('detailPesanan');

        // Filter berdasarkan status pesanan
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status_pesanan', $request->status);
        }

        // Filter berdasarkan status pembayaran
        if ($request->has('payment_status') && $request->payment_status !== 'all') {
            $query->where('status_pembayaran', $request->payment_status);
        }

        // Filter berdasarkan tanggal
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search berdasarkan nomor pesanan, nama customer, atau email
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nomor_pesanan', 'like', "%{$search}%")
                  ->orWhere('nama_customer', 'like', "%{$search}%")
                  ->orWhere('email_customer', 'like', "%{$search}%");
            });
        }

        $pesanan = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'nomor_pesanan' => $item->nomor_pesanan,
                    'nama_customer' => $item->nama_customer,
                    'email_customer' => $item->email_customer,
                    'telepon_customer' => $item->telepon_customer,
                    'total_akhir' => $item->total_akhir,
                    'status_pesanan' => $item->status_pesanan,
                    'status_pembayaran' => $item->status_pembayaran,
                    'metode_pembayaran' => $item->metode_pembayaran,
                    'jumlah_item' => $item->detail_pesanan_count,
                    'tanggal_pesanan' => $item->created_at->format('d M Y H:i'),
                    'is_guest' => is_null($item->user_id),
                    'kurir' => $item->kurir,
                    'layanan_kurir' => $item->layanan_kurir,
                    'nomor_resi' => $item->nomor_resi,
                ];
            });

        // Statistik untuk dashboard
        $statistik = [
            'total_pesanan' => Pesanan::count(),
            'pesanan_pending' => Pesanan::where('status_pesanan', 'pending')->count(),
            'pesanan_diproses' => Pesanan::where('status_pesanan', 'diproses')->count(),
            'pesanan_dikirim' => Pesanan::where('status_pesanan', 'dikirim')->count(),
            'pesanan_selesai' => Pesanan::where('status_pesanan', 'selesai')->count(),
            'pesanan_dibatalkan' => Pesanan::where('status_pesanan', 'dibatalkan')->count(),
            'total_penjualan' => Pesanan::where('status_pesanan', 'selesai')->sum('total_akhir'),
            'pembayaran_pending' => Pesanan::where('status_pembayaran', 'pending')->count(),
            'pembayaran_berhasil' => Pesanan::where('status_pembayaran', 'berhasil')->count(),
        ];

        return Inertia::render('Admin/Pesanan/Index', [
            'pesanan' => $pesanan,
            'statistik' => $statistik,
            'filters' => $request->only(['status', 'payment_status', 'date_from', 'date_to', 'search']),
        ]);
    }

    public function show($id)
    {
        $pesanan = Pesanan::with([
            'detailPesanan.produk.gambarProduk',
            'user'
        ])->findOrFail($id);

        $pesananData = [
            'id' => $pesanan->id,
            'nomor_pesanan' => $pesanan->nomor_pesanan,
            'nama_customer' => $pesanan->nama_customer,
            'email_customer' => $pesanan->email_customer,
            'telepon_customer' => $pesanan->telepon_customer,
            'alamat_pengiriman' => $pesanan->alamat_pengiriman,
            'kota' => $pesanan->kota,
            'provinsi' => $pesanan->provinsi,
            'kode_pos' => $pesanan->kode_pos,
            'subtotal' => $pesanan->subtotal,
            'ongkir' => $pesanan->ongkir,
            'diskon' => $pesanan->diskon,
            'total_akhir' => $pesanan->total_akhir,
            'status_pesanan' => $pesanan->status_pesanan,
            'status_pembayaran' => $pesanan->status_pembayaran,
            'metode_pembayaran' => $pesanan->metode_pembayaran,
            'kurir' => $pesanan->kurir,
            'layanan_kurir' => $pesanan->layanan_kurir,
            'estimasi_pengiriman' => $pesanan->estimasi_pengiriman,
            'nomor_resi' => $pesanan->nomor_resi,
            'catatan' => $pesanan->catatan,
            'is_guest' => is_null($pesanan->user_id),
            'user_id' => $pesanan->user_id,
            'tanggal_pesanan' => $pesanan->created_at->format('d M Y H:i'),
            'tanggal_update' => $pesanan->updated_at->format('d M Y H:i'),
            'items' => $pesanan->detailPesanan->map(function ($detail) {
                $gambar = $detail->produk->gambarProduk->where('gambar_utama', true)->first();
                return [
                    'id' => $detail->id,
                    'nama_produk' => $detail->nama_produk,
                    'sku_produk' => $detail->sku_produk,
                    'harga' => $detail->harga,
                    'kuantitas' => $detail->kuantitas,
                    'subtotal' => $detail->subtotal,
                    'produk_id' => $detail->produk_id,
                    'gambar_produk' => $gambar ? Storage::url($gambar->path_gambar) : null,
                ];
            }),
        ];

        return Inertia::render('Admin/Pesanan/Show', [
            'pesanan' => $pesananData,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status_pesanan' => 'required|in:menunggu_pembayaran,dibayar,diproses,dikirim,selesai,dibatalkan',
            'catatan_admin' => 'nullable|string',
            'nomor_resi' => 'nullable|string|max:255',
        ]);

        $pesanan = Pesanan::findOrFail($id);
        
        $oldStatus = $pesanan->status_pesanan;
        
        $pesanan->update([
            'status_pesanan' => $request->status_pesanan,
            'catatan_admin' => $request->catatan_admin,
            'nomor_resi' => $request->nomor_resi,
        ]);

        // Log status change atau kirim notifikasi di sini jika diperlukan

        return back()->with('success', "Status pesanan berhasil diubah dari '{$oldStatus}' ke '{$request->status_pesanan}'");
    }

    public function updatePaymentStatus(Request $request, $id)
    {
        $request->validate([
            'status_pembayaran' => 'required|in:belum_dibayar,menunggu_verifikasi,dibayar,gagal'
        ]);

        $pesanan = Pesanan::findOrFail($id);
        
        $oldStatus = $pesanan->status_pembayaran;
        
        $pesanan->update([
            'status_pembayaran' => $request->status_pembayaran,
        ]);

        return back()->with('success', "Status pembayaran berhasil diubah dari '{$oldStatus}' ke '{$request->status_pembayaran}'");
    }

    public function printInvoice($id)
    {
        $pesanan = Pesanan::with([
            'detailPesanan.produk',
            'user'
        ])->findOrFail($id);

        return Inertia::render('Admin/Pesanan/Invoice', [
            'pesanan' => $pesanan,
        ]);
    }

    public function export(Request $request)
    {
        // Export data pesanan ke Excel/CSV
        // Implementasi export akan ditambahkan jika diperlukan
        return response()->json([
            'message' => 'Fitur export akan segera tersedia'
        ]);
    }

    public function destroy($id)
    {
        $pesanan = Pesanan::findOrFail($id);

        // Hanya bisa hapus pesanan yang dibatalkan
        if ($pesanan->status_pesanan !== 'dibatalkan') {
            return redirect()->route('admin.pesanan.index')
                ->with('error', 'Hanya pesanan yang dibatalkan yang dapat dihapus.');
        }

        $pesanan->delete();

        return redirect()->route('admin.pesanan.index')
            ->with('success', 'Pesanan berhasil dihapus.');
    }
}
