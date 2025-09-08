<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Kupon;

class KuponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
                $kupons = [
            [
                'kode_kupon' => 'WELCOME10',
                'nama_kupon' => 'Selamat Datang - Diskon 10%',
                'deskripsi' => 'Dapatkan diskon 10% untuk pembelian pertama Anda di Toko Tas Berkah',
                'jenis_diskon' => 'persentase',
                'nilai_diskon' => 10.00,
                'minimal_pembelian' => 300000,
                'maksimal_diskon' => 150000,
                'tanggal_mulai' => now(),
                'tanggal_berakhir' => now()->addMonths(3),
                'batas_penggunaan' => 100,
                'aktif' => true,
            ],
            [
                'kode_kupon' => 'BERKAH50K',
                'nama_kupon' => 'Potongan Langsung 50K',
                'deskripsi' => 'Diskon langsung Rp 50.000 untuk pembelian minimal Rp 500.000',
                'jenis_diskon' => 'nominal',
                'nilai_diskon' => 50000.00,
                'minimal_pembelian' => 500000,
                'maksimal_diskon' => null,
                'tanggal_mulai' => now(),
                'tanggal_berakhir' => now()->addMonths(2),
                'batas_penggunaan' => 50,
                'aktif' => true,
            ],
            [
                'kode_kupon' => 'PREMIUM20',
                'nama_kupon' => 'Member Premium - Diskon 20%',
                'deskripsi' => 'Diskon khusus 20% untuk member premium Toko Tas Berkah',
                'jenis_diskon' => 'persentase',
                'nilai_diskon' => 20.00,
                'minimal_pembelian' => 800000,
                'maksimal_diskon' => 300000,
                'tanggal_mulai' => now(),
                'tanggal_berakhir' => now()->addMonths(6),
                'batas_penggunaan' => 25,
                'aktif' => true,
            ],
            [
                'kode_kupon' => 'FLASHSALE',
                'nama_kupon' => 'Flash Sale - Diskon 15%',
                'deskripsi' => 'Dapatkan diskon 15% untuk pembelian hari ini saja!',
                'jenis_diskon' => 'persentase',
                'nilai_diskon' => 15.00,
                'minimal_pembelian' => 250000,
                'maksimal_diskon' => 200000,
                'tanggal_mulai' => now(),
                'tanggal_berakhir' => now()->addDays(1),
                'batas_penggunaan' => 30,
                'aktif' => true,
            ],
            [
                'kode_kupon' => 'FREEONGKIR',
                'nama_kupon' => 'Gratis Ongkos Kirim',
                'deskripsi' => 'Gratis ongkos kirim untuk pembelian minimal Rp 400.000',
                'jenis_diskon' => 'nominal',
                'nilai_diskon' => 0.00,
                'minimal_pembelian' => 400000,
                'maksimal_diskon' => null,
                'tanggal_mulai' => now(),
                'tanggal_berakhir' => now()->addMonth(),
                'batas_penggunaan' => 75,
                'aktif' => true,
            ],
        ];

        foreach ($kupons as $kupon) {
            Kupon::firstOrCreate(
                ['kode_kupon' => $kupon['kode_kupon']],
                $kupon
            );
        }
    }
}
