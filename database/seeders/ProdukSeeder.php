<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Produk;
use App\Models\GambarProduk;
use App\Models\KategoriProduk;

class ProdukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $produks = [
            [
                'kategori_id' => 1, // Tas Wanita
                'nama_produk' => 'Tas Kulit Premium Berkah Classic',
                'slug_produk' => 'tas-kulit-premium-berkah-classic',
                'deskripsi_singkat' => 'Tas kulit asli dengan desain elegan dan berkualitas tinggi',
                'deskripsi_lengkap' => 'Tas kulit asli dengan desain elegan dan berkualitas tinggi. Cocok untuk acara formal maupun kasual. Dilengkapi dengan kompartemen dalam yang rapi dan tali yang dapat disesuaikan.',
                'sku' => 'TKP001',
                'harga' => 1250000,
                'stok' => 25,
                'berat' => 800,
                'dimensi' => '30x25x12 cm',
                'material' => 'Kulit Asli Premium',
                'warna' => json_encode(['Hitam', 'Coklat', 'Navy']),
                'aktif' => true,
                'rating_rata' => 4.8,
                'jumlah_ulasan' => 24,
                'tag' => 'tas wanita, kulit premium, elegan, formal',
            ],
            [
                'kategori_id' => 2, // Tas Pria
                'nama_produk' => 'Tas Ransel Berkah Executive',
                'slug_produk' => 'tas-ransel-berkah-executive',
                'deskripsi_singkat' => 'Tas ransel premium untuk pria eksekutif dengan fitur anti-theft',
                'deskripsi_lengkap' => 'Tas ransel premium untuk pria eksekutif dengan fitur anti-theft dan kompartemen laptop. Desain profesional dengan bahan berkualitas tinggi yang tahan lama.',
                'sku' => 'TRE002',
                'harga' => 890000,
                'stok' => 18,
                'berat' => 1200,
                'dimensi' => '45x30x15 cm',
                'material' => 'Ballistic Nylon',
                'warna' => json_encode(['Hitam', 'Abu-abu', 'Coklat Tua']),
                'aktif' => true,
                'rating_rata' => 4.6,
                'jumlah_ulasan' => 18,
                'tag' => 'tas pria, ransel, executive, anti-theft, laptop',
            ],
            [
                'kategori_id' => 3, // Tas Kerja
                'nama_produk' => 'Tas Laptop Berkah Professional',
                'slug_produk' => 'tas-laptop-berkah-professional',
                'deskripsi_singkat' => 'Tas laptop profesional dengan perlindungan maksimal',
                'deskripsi_lengkap' => 'Tas laptop profesional dengan perlindungan maksimal untuk perangkat elektronik. Dilengkapi dengan organizer untuk dokumen dan aksesoris kantor.',
                'sku' => 'TLP003',
                'harga' => 675000,
                'stok' => 30,
                'berat' => 950,
                'dimensi' => '40x28x8 cm',
                'material' => 'Polyester Premium + Foam Padding',
                'warna' => json_encode(['Hitam', 'Navy', 'Abu-abu']),
                'aktif' => true,
                'rating_rata' => 4.7,
                'jumlah_ulasan' => 31,
                'tag' => 'tas kerja, laptop, professional, organizer',
            ],
            [
                'kategori_id' => 4, // Tas Casual
                'nama_produk' => 'Tas Selempang Berkah Urban',
                'slug_produk' => 'tas-selempang-berkah-urban',
                'deskripsi_singkat' => 'Tas selempang bergaya urban dengan desain modern',
                'deskripsi_lengkap' => 'Tas selempang bergaya urban dengan desain modern dan praktis. Cocok untuk aktivitas sehari-hari dengan ukuran yang compact namun fungsional.',
                'sku' => 'TSU004',
                'harga' => 425000,
                'stok' => 40,
                'berat' => 400,
                'dimensi' => '25x18x8 cm',
                'material' => 'Canvas Premium',
                'warna' => json_encode(['Hitam', 'Hijau Army', 'Biru', 'Khaki']),
                'aktif' => true,
                'rating_rata' => 4.5,
                'jumlah_ulasan' => 28,
                'tag' => 'tas casual, selempang, urban, compact',
            ],
            [
                'kategori_id' => 5, // Tas Travel
                'nama_produk' => 'Tas Travel Berkah Explorer',
                'slug_produk' => 'tas-travel-berkah-explorer',
                'deskripsi_singkat' => 'Tas travel berkapasitas besar dengan fitur expandable',
                'deskripsi_lengkap' => 'Tas travel berkapasitas besar dengan fitur expandable dan roda yang smooth. Dilengkapi dengan TSA lock untuk keamanan maksimal saat bepergian.',
                'sku' => 'TTE005',
                'harga' => 1850000,
                'stok' => 12,
                'berat' => 3200,
                'dimensi' => '70x45x25 cm (expandable)',
                'material' => 'ABS + Polyester Tahan Air',
                'warna' => json_encode(['Hitam', 'Silver', 'Biru Navy']),
                'aktif' => true,
                'rating_rata' => 4.9,
                'jumlah_ulasan' => 15,
                'tag' => 'tas travel, expandable, TSA lock, roda',
            ],
        ];

        foreach ($produks as $produkData) {
            $produk = Produk::firstOrCreate(
                ['slug_produk' => $produkData['slug_produk']],
                $produkData
            );
            
            // Tambahkan gambar produk untuk setiap produk
            $gambar_utama = 'produk/' . strtolower(str_replace(' ', '-', $produkData['nama_produk'])) . '-1.jpg';
            $gambar_utama = str_replace(['berkah-', 'tas-'], ['', 'tas-'], $gambar_utama);
            
            GambarProduk::firstOrCreate([
                'produk_id' => $produk->id,
                'path_gambar' => $gambar_utama,
            ], [
                'nama_file' => basename($gambar_utama),
                'alt_text' => $produkData['nama_produk'],
                'urutan' => 1,
                'gambar_utama' => true,
                'tipe_file' => 'jpg',
                'ukuran_file' => 1024,
            ]);
            
            // Tambahkan gambar tambahan
            GambarProduk::firstOrCreate([
                'produk_id' => $produk->id,
                'path_gambar' => str_replace('-1.jpg', '-2.jpg', $gambar_utama),
            ], [
                'nama_file' => basename(str_replace('-1.jpg', '-2.jpg', $gambar_utama)),
                'alt_text' => $produkData['nama_produk'] . ' - Detail',
                'urutan' => 2,
                'gambar_utama' => false,
                'tipe_file' => 'jpg',
                'ukuran_file' => 1024,
            ]);
        }
    }
}
