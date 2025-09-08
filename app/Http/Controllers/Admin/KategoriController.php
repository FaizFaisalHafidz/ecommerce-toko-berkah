<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KategoriProduk;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class KategoriController extends Controller
{
    public function index()
    {
        $kategoris = KategoriProduk::withCount('produk')
            ->orderBy('nama_kategori')
            ->get()
            ->map(function ($kategori) {
                return [
                    'id' => $kategori->id,
                    'nama_kategori' => $kategori->nama_kategori,
                    'deskripsi' => $kategori->deskripsi_kategori,
                    'gambar' => $kategori->gambar_kategori ? Storage::url($kategori->gambar_kategori) : null,
                    'aktif' => $kategori->aktif,
                    'produk_count' => $kategori->produk_count,
                    'created_at' => $kategori->created_at->format('d M Y'),
                    'updated_at' => $kategori->updated_at->format('d M Y'),
                ];
            });

        return Inertia::render('Admin/Kategori/Index', [
            'kategoris' => $kategoris,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Kategori/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:kategori_produk',
            'deskripsi_kategori' => 'nullable|string',
            'gambar_kategori' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'aktif' => 'boolean',
        ]);

        $data = [
            'nama_kategori' => $request->nama_kategori,
            'slug_kategori' => Str::slug($request->nama_kategori),
            'deskripsi_kategori' => $request->deskripsi_kategori,
            'aktif' => $request->aktif ?? true,
        ];

        if ($request->hasFile('gambar_kategori')) {
            $data['gambar_kategori'] = $request->file('gambar_kategori')->store('kategori', 'public');
        }

        KategoriProduk::create($data);

        return redirect()->route('admin.kategori.index')
            ->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function show($id)
    {
        $kategori = KategoriProduk::with(['produk' => function ($query) {
            $query->with('gambarProduk')->take(10);
        }])->findOrFail($id);

        return Inertia::render('Admin/Kategori/Show', [
            'kategori' => [
                'id' => $kategori->id,
                'nama_kategori' => $kategori->nama_kategori,
                'slug_kategori' => $kategori->slug_kategori,
                'deskripsi_kategori' => $kategori->deskripsi_kategori,
                'gambar_kategori' => $kategori->gambar_kategori ? Storage::url($kategori->gambar_kategori) : null,
                'aktif' => $kategori->aktif,
                'produk' => $kategori->produk->map(function ($produk) {
                    return [
                        'id' => $produk->id,
                        'nama_produk' => $produk->nama_produk,
                        'harga' => $produk->harga,
                        'gambar' => $produk->gambarProduk->first()?->gambar 
                            ? Storage::url($produk->gambarProduk->first()->gambar) 
                            : null,
                    ];
                }),
                'created_at' => $kategori->created_at->format('d M Y H:i'),
                'updated_at' => $kategori->updated_at->format('d M Y H:i'),
            ],
        ]);
    }

    public function edit($id)
    {
        $kategori = KategoriProduk::findOrFail($id);

        return Inertia::render('Admin/Kategori/Edit', [
            'kategori' => [
                'id' => $kategori->id,
                'nama_kategori' => $kategori->nama_kategori,
                'deskripsi_kategori' => $kategori->deskripsi_kategori,
                'gambar_kategori' => $kategori->gambar_kategori ? Storage::url($kategori->gambar_kategori) : null,
                'aktif' => $kategori->aktif,
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $kategori = KategoriProduk::findOrFail($id);

        $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:kategori_produk,nama_kategori,' . $id,
            'deskripsi_kategori' => 'nullable|string',
            'gambar_kategori' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'aktif' => 'boolean',
        ]);

        $data = [
            'nama_kategori' => $request->nama_kategori,
            'slug_kategori' => Str::slug($request->nama_kategori),
            'deskripsi_kategori' => $request->deskripsi_kategori,
            'aktif' => $request->aktif ?? true,
        ];

        if ($request->hasFile('gambar_kategori')) {
            // Delete old image
            if ($kategori->gambar_kategori) {
                Storage::disk('public')->delete($kategori->gambar_kategori);
            }
            $data['gambar_kategori'] = $request->file('gambar_kategori')->store('kategori', 'public');
        }

        $kategori->update($data);

        return redirect()->route('admin.kategori.index')
            ->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $kategori = KategoriProduk::findOrFail($id);

        // Check if category has products
        if ($kategori->produk()->count() > 0) {
            return redirect()->route('admin.kategori.index')
                ->with('error', 'Kategori tidak dapat dihapus karena masih memiliki produk.');
        }

        // Delete image
        if ($kategori->gambar_kategori) {
            Storage::disk('public')->delete($kategori->gambar_kategori);
        }

        $kategori->delete();

        return redirect()->route('admin.kategori.index')
            ->with('success', 'Kategori berhasil dihapus.');
    }

    public function toggleStatus($id)
    {
        $kategori = KategoriProduk::findOrFail($id);
        $kategori->update(['aktif' => !$kategori->aktif]);

        return response()->json([
            'success' => true,
            'message' => 'Status kategori berhasil diperbarui.',
            'aktif' => $kategori->aktif,
        ]);
    }
}
