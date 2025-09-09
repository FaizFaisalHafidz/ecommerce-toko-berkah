<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use App\Models\KategoriProduk;
use App\Models\GambarProduk;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProdukController extends Controller
{
    public function index()
    {
        $produk = Produk::with(['kategori', 'gambarProduk' => function($query) {
                $query->orderBy('gambar_utama', 'desc')->orderBy('urutan', 'asc');
            }])
            ->withCount('ulasanProduk')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $gambarUtama = $item->gambarProduk->first();
                
                return [
                    'id' => $item->id,
                    'nama_produk' => $item->nama_produk,
                    'kategori' => $item->kategori?->nama_kategori ?? 'Tanpa Kategori',
                    'harga' => $item->harga,
                    'harga_diskon' => $item->harga_diskon,
                    'stok' => $item->stok,
                    'minimal_stok' => $item->minimal_stok,
                    'aktif' => $item->aktif,
                    'produk_unggulan' => $item->produk_unggulan,
                    'gambar_utama' => $gambarUtama ? Storage::url($gambarUtama->path_gambar) : null,
                    'images' => $item->gambarProduk->map(function($img) {
                        return [
                            'url' => Storage::url($img->path_gambar),
                            'alt' => $img->alt_text,
                            'primary' => $img->gambar_utama
                        ];
                    }),
                    'jumlah_ulasan' => $item->ulasan_produk_count,
                    'jumlah_terjual' => $item->jumlah_terjual,
                    'created_at' => $item->created_at->format('d M Y'),
                    'updated_at' => $item->updated_at->format('d M Y'),
                ];
            });

        return Inertia::render('Admin/Produk/Index', [
            'produk' => $produk,
        ]);
    }

    public function create()
    {
        $kategoris = KategoriProduk::where('aktif', true)
            ->orderBy('nama_kategori')
            ->get(['id', 'nama_kategori']);

        return Inertia::render('Admin/Produk/Create', [
            'kategoris' => $kategoris,
        ]);
    }

    public function store(Request $request)
    {
        // Debug logging
        Log::info('Store produk - Request data:', $request->all());
        Log::info('Store produk - Files:', $request->allFiles());

        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'kategori_id' => 'required|exists:kategori_produk,id',
            'deskripsi_singkat' => 'nullable|string|max:500',
            'deskripsi_lengkap' => 'nullable|string',
            'sku' => 'nullable|string|max:100|unique:produk',
            'harga' => 'required|numeric|min:0',
            'harga_diskon' => 'nullable|numeric|min:0|lt:harga',
            'stok' => 'required|integer|min:0',
            'minimal_stok' => 'nullable|integer|min:0',
            'berat' => 'nullable|numeric|min:0',
            'dimensi' => 'nullable|string',
            'material' => 'nullable|string',
            'warna' => 'nullable|string',
            'tag' => 'nullable|array',
            'produk_unggulan' => 'boolean',
            'produk_baru' => 'boolean',
            'aktif' => 'boolean',
            'gambar' => 'nullable|array',
            'gambar.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();

        try {
            // Prepare data
            $warna = $request->warna;
            if (is_string($warna) && $this->isValidJson($warna)) {
                // Keep as JSON string for database storage
                $warna = $warna;
            } elseif (is_array($warna)) {
                $warna = json_encode($warna);
            }

            $tag = $request->tag;
            if (is_string($tag) && $this->isValidJson($tag)) {
                $tag = json_decode($tag, true) ?: [];
            }

            $data = [
                'kategori_id' => $request->kategori_id,
                'nama_produk' => $request->nama_produk,
                'slug_produk' => Str::slug($request->nama_produk),
                'deskripsi_singkat' => $request->deskripsi_singkat,
                'deskripsi_lengkap' => $request->deskripsi_lengkap,
                'sku' => $request->sku ?: 'SKU-' . strtoupper(Str::random(8)),
                'harga' => $request->harga,
                'harga_diskon' => $request->harga_diskon,
                'stok' => $request->stok,
                'minimal_stok' => $request->minimal_stok ?? 5,
                'berat' => $request->berat,
                'dimensi' => $request->dimensi,
                'material' => $request->material,
                'warna' => $warna,
                'tag' => $tag,
                'produk_unggulan' => $request->boolean('produk_unggulan'),
                'produk_baru' => $request->boolean('produk_baru'),
                'aktif' => $request->boolean('aktif'),
                'tanggal_rilis' => now(),
            ];

            Log::info('Store produk - Processed data:', $data);

            $produk = Produk::create($data);

            // Handle images
            if ($request->hasFile('gambar')) {
                foreach ($request->file('gambar') as $index => $file) {
                    $gambarPath = $file->store('produk', 'public');
                    $originalName = $file->getClientOriginalName();
                    
                    GambarProduk::create([
                        'produk_id' => $produk->id,
                        'nama_file' => $originalName,
                        'path_gambar' => $gambarPath,
                        'alt_text' => $produk->nama_produk,
                        'gambar_utama' => $index === 0, // First image as main
                        'urutan' => $index + 1,
                        'ukuran_file' => $file->getSize(),
                        'tipe_file' => $file->getMimeType(),
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('admin.produk.index')
                ->with('success', 'Produk berhasil ditambahkan.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Validation errors:', $e->errors());
            return redirect()->back()
                ->withInput()
                ->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Store produk error: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Terjadi kesalahan saat menyimpan produk: ' . $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $produk = Produk::with(['kategori', 'gambarProduk', 'ulasanProduk.user'])
            ->findOrFail($id);

        return Inertia::render('Admin/Produk/Show', [
            'produk' => [
                'id' => $produk->id,
                'nama_produk' => $produk->nama_produk,
                'slug_produk' => $produk->slug_produk,
                'kategori' => $produk->kategori?->nama_kategori ?? 'Tanpa Kategori',
                'deskripsi_singkat' => $produk->deskripsi_singkat,
                'deskripsi_lengkap' => $produk->deskripsi_lengkap,
                'sku' => $produk->sku,
                'harga' => $produk->harga,
                'harga_diskon' => $produk->harga_diskon,
                'stok' => $produk->stok,
                'minimal_stok' => $produk->minimal_stok,
                'berat' => $produk->berat,
                'dimensi' => $produk->dimensi,
                'material' => $produk->material,
                'warna' => $produk->warna,
                'tag' => is_array($produk->tag) ? $produk->tag : [],
                'produk_unggulan' => $produk->produk_unggulan,
                'produk_baru' => $produk->produk_baru,
                'aktif' => $produk->aktif,
                'rating_rata' => $produk->rating_rata,
                'jumlah_ulasan' => $produk->jumlah_ulasan,
                'jumlah_terjual' => $produk->jumlah_terjual,
                'jumlah_dilihat' => $produk->jumlah_dilihat,
                'gambar' => $produk->gambarProduk->map(function ($gambar) {
                    return [
                        'id' => $gambar->id,
                        'url' => Storage::url($gambar->path_gambar),
                        'alt' => $gambar->alt_text,
                        'primary' => $gambar->gambar_utama,
                        'urutan' => $gambar->urutan,
                    ];
                }),
                'created_at' => $produk->created_at->format('d M Y H:i'),
                'updated_at' => $produk->updated_at->format('d M Y H:i'),
            ],
        ]);
    }

    public function edit($id)
    {
        $produk = Produk::with(['kategori', 'gambarProduk'])->findOrFail($id);
        $kategoris = KategoriProduk::where('aktif', true)
            ->orderBy('nama_kategori')
            ->get(['id', 'nama_kategori']);

        return Inertia::render('Admin/Produk/Edit', [
            'produk' => [
                'id' => $produk->id,
                'nama_produk' => $produk->nama_produk,
                'kategori_id' => $produk->kategori_id,
                'deskripsi_singkat' => $produk->deskripsi_singkat,
                'deskripsi_lengkap' => $produk->deskripsi_lengkap,
                'sku' => $produk->sku,
                'harga' => $produk->harga,
                'harga_diskon' => $produk->harga_diskon,
                'stok' => $produk->stok,
                'minimal_stok' => $produk->minimal_stok,
                'berat' => $produk->berat,
                'dimensi' => $produk->dimensi,
                'material' => $produk->material,
                'warna' => $produk->warna,
                'tag' => is_array($produk->tag) ? $produk->tag : [],
                'produk_unggulan' => $produk->produk_unggulan,
                'produk_baru' => $produk->produk_baru,
                'aktif' => $produk->aktif,
                'gambar' => $produk->gambarProduk->map(function ($gambar) {
                    return [
                        'id' => $gambar->id,
                        'url' => Storage::url($gambar->path_gambar),
                        'alt' => $gambar->alt_text,
                        'primary' => $gambar->gambar_utama,
                        'urutan' => $gambar->urutan,
                    ];
                }),
            ],
            'kategoris' => $kategoris,
        ]);
    }

    public function update(Request $request, $id)
    {
        $produk = Produk::findOrFail($id);
        
        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'kategori_id' => 'required|exists:kategori_produk,id',
            'deskripsi_singkat' => 'nullable|string|max:500',
            'deskripsi_lengkap' => 'nullable|string',
            'sku' => 'nullable|string|max:100|unique:produk,sku,' . $id,
            'harga' => 'required|numeric|min:0',
            'harga_diskon' => 'nullable|numeric|min:0|lt:harga',
            'stok' => 'required|integer|min:0',
            'minimal_stok' => 'nullable|integer|min:0',
            'berat' => 'nullable|numeric|min:0',
            'dimensi' => 'nullable|string',
            'material' => 'nullable|string',
            'warna' => 'nullable|string',
            'tag' => 'nullable|array',
            'produk_unggulan' => 'boolean',
            'produk_baru' => 'boolean',
            'aktif' => 'boolean',
            'gambar' => 'nullable|array',
            'gambar.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'deleted_images' => 'nullable|array',
            'deleted_images.*' => 'integer|exists:gambar_produk,id',
        ]);

        DB::beginTransaction();

        try {
            $data = [
                'kategori_id' => $request->kategori_id,
                'nama_produk' => $request->nama_produk,
                'slug_produk' => Str::slug($request->nama_produk),
                'deskripsi_singkat' => $request->deskripsi_singkat,
                'deskripsi_lengkap' => $request->deskripsi_lengkap,
                'sku' => $request->sku ?: $produk->sku,
                'harga' => $request->harga,
                'harga_diskon' => $request->harga_diskon,
                'stok' => $request->stok,
                'minimal_stok' => $request->minimal_stok ?? 5,
                'berat' => $request->berat,
                'dimensi' => $request->dimensi,
                'material' => $request->material,
                'warna' => $request->warna,
                'tag' => $request->tag ?? [],
                'produk_unggulan' => $request->produk_unggulan ?? false,
                'produk_baru' => $request->produk_baru ?? false,
                'aktif' => $request->aktif ?? true,
            ];

            $produk->update($data);

            // Handle deleted images
            if ($request->has('deleted_images') && is_array($request->deleted_images)) {
                $deletedImages = GambarProduk::whereIn('id', $request->deleted_images)
                    ->where('produk_id', $produk->id)
                    ->get();

                foreach ($deletedImages as $deletedImage) {
                    // Delete file from storage
                    if (Storage::disk('public')->exists($deletedImage->path_gambar)) {
                        Storage::disk('public')->delete($deletedImage->path_gambar);
                    }
                    // Delete record from database
                    $deletedImage->delete();
                }
            }

            // Handle new images
            if ($request->hasFile('gambar')) {
                $existingCount = $produk->gambarProduk()->count();
                
                foreach ($request->file('gambar') as $index => $file) {
                    $gambarPath = $file->store('produk', 'public');
                    $originalName = $file->getClientOriginalName();
                    
                    GambarProduk::create([
                        'produk_id' => $produk->id,
                        'nama_file' => $originalName,
                        'path_gambar' => $gambarPath,
                        'alt_text' => $produk->nama_produk,
                        'gambar_utama' => $existingCount === 0 && $index === 0,
                        'urutan' => $existingCount + $index + 1,
                        'ukuran_file' => $file->getSize(),
                        'tipe_file' => $file->getMimeType(),
                    ]);
                }
            }

            // If no main image exists after deletion, set first remaining image as main
            $hasMainImage = $produk->gambarProduk()->where('gambar_utama', true)->exists();
            if (!$hasMainImage) {
                $firstImage = $produk->gambarProduk()->orderBy('urutan')->first();
                if ($firstImage) {
                    $firstImage->update(['gambar_utama' => true]);
                }
            }

            DB::commit();

            return redirect()->route('admin.produk.index')
                ->with('success', 'Produk berhasil diperbarui.');        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Terjadi kesalahan saat memperbarui produk.']);
        }
    }

    public function destroy($id)
    {
        $produk = Produk::findOrFail($id);

        // Check if product has orders
        if ($produk->detailPesanan()->count() > 0) {
            return redirect()->route('admin.produk.index')
                ->with('error', 'Produk tidak dapat dihapus karena sudah ada dalam pesanan.');
        }

        DB::beginTransaction();

        try {
            // Delete product images
            foreach ($produk->gambarProduk as $gambar) {
                Storage::disk('public')->delete($gambar->gambar);
                $gambar->delete();
            }

            $produk->delete();

            DB::commit();

            return redirect()->route('admin.produk.index')
                ->with('success', 'Produk berhasil dihapus.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.produk.index')
                ->with('error', 'Terjadi kesalahan saat menghapus produk.');
        }
    }

    public function toggleStatus($id)
    {
        $produk = Produk::findOrFail($id);
        $produk->update(['aktif' => !$produk->aktif]);

        return response()->json([
            'success' => true,
            'message' => 'Status produk berhasil diperbarui.',
            'aktif' => $produk->aktif,
        ]);
    }

    private function isValidJson($string)
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }

    public function toggleFeatured($id)
    {
        $produk = Produk::findOrFail($id);
        $produk->update(['produk_unggulan' => !$produk->produk_unggulan]);

        return response()->json([
            'success' => true,
            'message' => 'Status unggulan produk berhasil diperbarui.',
            'produk_unggulan' => $produk->produk_unggulan,
        ]);
    }

    public function deleteImage($produkId, $imageId)
    {
        $gambar = GambarProduk::where('produk_id', $produkId)->findOrFail($imageId);
        
        Storage::disk('public')->delete($gambar->path_gambar);
        $gambar->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gambar berhasil dihapus.',
        ]);
    }
}
