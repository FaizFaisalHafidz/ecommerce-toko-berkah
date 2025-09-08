<?php

namespace App\Http\Controllers;

use App\Models\KategoriProduk;
use App\Models\Produk;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display product catalog with filtering and pagination
     */
    public function index(Request $request): Response
    {
        $query = Produk::with(['kategori', 'gambarProduk'])
            ->where('aktif', true);

        // Filter by category
        if ($request->has('category')) {
            $query->whereHas('kategori', function($q) use ($request) {
                $q->where('slug_kategori', $request->category);
            });
        }

        // Search by name
        if ($request->has('search')) {
            $query->where('nama_produk', 'like', '%' . $request->search . '%');
        }

        // Price filter
        if ($request->has('price_min')) {
            $query->where('harga', '>=', $request->price_min);
        }
        if ($request->has('price_max')) {
            $query->where('harga', '<=', $request->price_max);
        }

        // Sort
        $sort = $request->get('sort', 'newest');
        switch ($sort) {
            case 'price_low':
                $query->orderBy('harga', 'asc');
                break;
            case 'price_high':
                $query->orderBy('harga', 'desc');
                break;
            case 'popular':
                $query->orderBy('jumlah_terjual', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating_rata', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate(12)->through(function ($product) {
            $gambarUtama = $product->gambarProduk->where('gambar_utama', true)->first();
            $semuaGambar = $product->gambarProduk->map(function($gambar) {
                return '/storage/' . $gambar->path_gambar;
            })->toArray();
            
            return [
                'id' => $product->id,
                'name' => $product->nama_produk,
                'price' => $product->harga,
                'originalPrice' => $product->harga_diskon ? $product->harga : null,
                'discount' => $product->persentase_diskon,
                'image' => $gambarUtama ? '/storage/' . $gambarUtama->path_gambar : null,
                'images' => $semuaGambar,
                'category' => $product->kategori->nama_kategori,
                'rating' => $product->rating_rata ?? 0,
                'reviews' => $product->jumlah_ulasan ?? 0,
                'inStock' => $product->stok > 0,
                'isNew' => $product->produk_baru ?? false,
                'slug' => $product->slug_produk
            ];
        });

        // Get categories for filter
        $categories = KategoriProduk::withCount('produk')
            ->where('aktif', true)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->nama_kategori,
                    'count' => $category->produk_count,
                    'slug' => $category->slug_kategori
                ];
            });

        return Inertia::render('Customer/Catalog', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search', 'price_min', 'price_max', 'sort'])
        ]);
    }

    /**
     * Display product details
     */
    public function show($slug): Response
    {
        $product = Produk::with(['kategori', 'gambarProduk', 'ulasanProduk.user'])
            ->where('slug_produk', $slug)
            ->where('aktif', true)
            ->firstOrFail();

        $productData = [
            'id' => $product->id,
            'name' => $product->nama_produk,
            'description' => $product->deskripsi_lengkap,
            'shortDescription' => $product->deskripsi_singkat,
            'price' => $product->harga,
            'originalPrice' => $product->harga_diskon ? $product->harga : null,
            'discount' => $product->persentase_diskon,
            'sku' => $product->sku,
            'category' => $product->kategori->nama_kategori,
            'rating' => $product->rating_rata ?? 0,
            'reviewCount' => $product->jumlah_ulasan ?? 0,
            'stock' => $product->stok,
            'weight' => $product->berat,
            'dimensions' => $product->dimensi,
            'material' => $product->material,
            'colors' => json_decode($product->warna) ?? [],
            'tags' => explode(',', $product->tag ?? ''),
            'isNew' => $product->produk_baru ?? false,
            'isFeatured' => $product->produk_unggulan ?? false,
            'images' => $product->gambarProduk->map(function($img) {
                return [
                    'url' => '/storage/' . $img->path_gambar,
                    'alt' => $img->alt_text,
                    'primary' => $img->gambar_utama
                ];
            }),
            'reviews' => $product->ulasanProduk->map(function($review) {
                return [
                    'id' => $review->id,
                    'user' => $review->user->name,
                    'rating' => $review->rating,
                    'comment' => $review->komentar,
                    'date' => $review->created_at->diffForHumans()
                ];
            })
        ];

        // Related products
        $relatedProducts = Produk::with(['kategori', 'gambarProduk'])
            ->where('kategori_id', $product->kategori_id)
            ->where('id', '!=', $product->id)
            ->where('aktif', true)
            ->limit(4)
            ->get()
            ->map(function ($product) {
                $gambarUtama = $product->gambarProduk->where('gambar_utama', true)->first();
                return [
                    'id' => $product->id,
                    'name' => $product->nama_produk,
                    'price' => $product->harga,
                    'image' => $gambarUtama ? '/storage/' . $gambarUtama->path_gambar : null,
                    'rating' => $product->rating_rata ?? 0,
                    'reviews' => $product->jumlah_ulasan ?? 0,
                    'slug' => $product->slug_produk
                ];
            });

        return Inertia::render('Customer/ProductDetail', [
            'product' => $productData,
            'relatedProducts' => $relatedProducts
        ]);
    }

    /**
     * Search products
     */
    public function search(Request $request)
    {
        $query = $request->get('q');
        
        if (!$query) {
            return redirect()->route('products.index');
        }

        $products = Produk::with(['kategori', 'gambarProduk'])
            ->where('aktif', true)
            ->where(function($q) use ($query) {
                $q->where('nama_produk', 'like', "%{$query}%")
                  ->orWhere('deskripsi_singkat', 'like', "%{$query}%")
                  ->orWhere('tag', 'like', "%{$query}%");
            })
            ->paginate(12)
            ->through(function ($product) {
                $gambarUtama = $product->gambarProduk->where('gambar_utama', true)->first();
                return [
                    'id' => $product->id,
                    'name' => $product->nama_produk,
                    'price' => $product->harga,
                    'image' => $gambarUtama ? '/storage/' . $gambarUtama->path_gambar : null,
                    'category' => $product->kategori->nama_kategori,
                    'rating' => $product->rating_rata ?? 0,
                    'reviews' => $product->jumlah_ulasan ?? 0,
                    'slug' => $product->slug_produk
                ];
            });

        return Inertia::render('Customer/SearchResults', [
            'products' => $products,
            'query' => $query
        ]);
    }
}
            
