<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Jalankan seeder dalam urutan yang benar
        $this->call([
            UserSeeder::class,
            KategoriProdukSeeder::class,
            ProdukSeeder::class,
            KuponSeeder::class,
        ]);
    }
}
