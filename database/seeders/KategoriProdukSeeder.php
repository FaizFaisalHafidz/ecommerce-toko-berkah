<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\KategoriProduk;

class KategoriProdukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategoris = [
            [
                'nama_kategori' => 'Tas Wanita',
                'slug_kategori' => 'tas-wanita',
                'deskripsi_kategori' => 'Koleksi tas eksklusif untuk wanita modern dengan desain elegan dan berkualitas tinggi',
                'gambar_kategori' => 'kategori/tas-wanita.jpg',
                'aktif' => true,
            ],
            [
                'nama_kategori' => 'Tas Pria',
                'slug_kategori' => 'tas-pria',
                'deskripsi_kategori' => 'Tas berkualitas premium untuk pria dengan desain maskulin dan fungsional',
                'gambar_kategori' => 'kategori/tas-pria.jpg',
                'aktif' => true,
            ],
            [
                'nama_kategori' => 'Tas Kerja',
                'slug_kategori' => 'tas-kerja',
                'deskripsi_kategori' => 'Tas profesional untuk kebutuhan kerja dan bisnis dengan kompartemen yang lengkap',
                'gambar_kategori' => 'kategori/tas-kerja.jpg',
                'aktif' => true,
            ],
            [
                'nama_kategori' => 'Tas Casual',
                'slug_kategori' => 'tas-casual',
                'deskripsi_kategori' => 'Tas santai untuk aktivitas sehari-hari dengan desain trendy dan nyaman',
                'gambar_kategori' => 'kategori/tas-casual.jpg',
                'aktif' => true,
            ],
            [
                'nama_kategori' => 'Tas Travel',
                'slug_kategori' => 'tas-travel',
                'deskripsi_kategori' => 'Tas perjalanan dengan kapasitas besar dan daya tahan tinggi untuk petualangan Anda',
                'gambar_kategori' => 'kategori/tas-travel.jpg',
                'aktif' => true,
            ],
        ];

        foreach ($kategoris as $kategori) {
            KategoriProduk::firstOrCreate(
                ['slug_kategori' => $kategori['slug_kategori']],
                $kategori
            );
        }
    }
}
