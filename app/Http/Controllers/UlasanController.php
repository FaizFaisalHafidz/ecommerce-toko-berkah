<?php

namespace App\Http\Controllers;

use App\Models\UlasanProduk;
use App\Models\Pesanan;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UlasanController extends Controller
{
    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'produk_id' => 'required|exists:produk,id',
            'pesanan_id' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'ulasan' => 'required|string|max:500'
        ]);

        try {
            // Pastikan user sudah login (untuk review yang memerlukan auth)
            // Atau bisa juga tanpa auth jika menggunakan session
            $userId = Auth::id() ?? null;

            // Verifikasi bahwa pesanan exists dan statusnya delivered
            $pesanan = Pesanan::where('nomor_pesanan', $request->pesanan_id)->first();
            if (!$pesanan) {
                if ($request->expectsJson()) {
                    return response()->json(['success' => false, 'message' => 'Pesanan tidak ditemukan.'], 404);
                }
                return back()->withErrors(['message' => 'Pesanan tidak ditemukan.']);
            }

            // Check if pesanan status is delivered/selesai
            if ($pesanan->status_pesanan !== 'selesai' && $pesanan->status_pesanan !== 'delivered') {
                if ($request->expectsJson()) {
                    return response()->json(['success' => false, 'message' => 'Ulasan hanya dapat diberikan untuk pesanan yang sudah selesai.'], 400);
                }
                return back()->withErrors(['message' => 'Ulasan hanya dapat diberikan untuk pesanan yang sudah selesai.']);
            }

            // Check if user already reviewed this product for this order
            $existingReview = UlasanProduk::where('produk_id', $request->produk_id)
                ->where('pesanan_id', $pesanan->id)
                ->first();

            if ($existingReview) {
                if ($request->expectsJson()) {
                    return response()->json(['success' => false, 'message' => 'Anda sudah memberikan ulasan untuk produk ini.'], 400);
                }
                return back()->withErrors(['message' => 'Anda sudah memberikan ulasan untuk produk ini.']);
            }

            // Create the review
            UlasanProduk::create([
                'user_id' => null, // Guest customer, no user_id
                'nama_customer' => $pesanan->nama_customer, // Menggunakan nama dari pesanan
                'produk_id' => $request->produk_id,
                'pesanan_id' => $pesanan->id,
                'rating' => $request->rating,
                'isi_ulasan' => $request->ulasan,
                'disetujui' => false, // Will be reviewed by admin
            ]);

            // Update product average rating
            $this->updateProductRating($request->produk_id);

            if ($request->expectsJson()) {
                return response()->json(['success' => true, 'message' => 'Ulasan berhasil dikirim dan akan ditinjau oleh admin.']);
            }
            return back()->with('success', 'Ulasan berhasil dikirim dan akan ditinjau oleh admin.');

        } catch (\Exception $e) {
            Log::error('Error creating review: ' . $e->getMessage());
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => 'Terjadi kesalahan saat menyimpan ulasan.'], 500);
            }
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan ulasan.']);
        }
    }

    /**
     * Update product average rating
     */
    private function updateProductRating($produkId)
    {
        $avgRating = UlasanProduk::where('produk_id', $produkId)
            ->where('disetujui', true)
            ->avg('rating');

        Produk::where('id', $produkId)->update([
            'rating_rata' => round($avgRating, 1)
        ]);
    }
}