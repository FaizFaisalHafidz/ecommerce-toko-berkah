<?php

namespace App\Http\Controllers;

use App\Models\KategoriProduk;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the main homepage
     */
    public function index(): Response
    {
        // Get featured products from database
        $featuredProducts = Produk::with(['kategori', 'gambarProduk'])
            ->where('aktif', true)
            ->limit(8)
            ->get()
            ->map(function ($product) {
                $gambarUtama = $product->gambarProduk->where('gambar_utama', true)->first();
                return [
                    'id' => $product->id,
                    'name' => $product->nama_produk,
                    'price' => $product->harga,
                    'originalPrice' => $product->harga_diskon ? $product->harga : null,
                    'discount' => $product->persentase_diskon,
                    'image' => $gambarUtama ? '/storage/' . $gambarUtama->path_gambar : null,
                    'category' => $product->kategori->nama_kategori,
                    'rating' => $product->rating_rata ?? 0,
                    'reviews' => $product->jumlah_ulasan ?? 0,
                    'inStock' => $product->stok > 0,
                    'isNew' => $product->produk_baru ?? false,
                    'slug' => $product->slug_produk
                ];
            });

        // Get categories with product count
        $categories = KategoriProduk::withCount('produk')
            ->where('aktif', true)
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->nama_kategori,
                    'count' => $category->produk_count,
                    'image' => '/storage/' . $category->gambar_kategori,
                    'slug' => $category->slug_kategori
                ];
            });

        // Debug information
        Log::info('Featured Products Count: ' . $featuredProducts->count());
        Log::info('Categories Count: ' . $categories->count());

        return Inertia::render('Customer/Homepage', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories
        ]);
    }
}
