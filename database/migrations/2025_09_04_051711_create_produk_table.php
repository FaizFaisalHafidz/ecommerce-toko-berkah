<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('produk', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_id')->constrained('kategori_produk')->onDelete('cascade');
            $table->string('nama_produk'); // Nama produk
            $table->string('slug_produk')->unique(); // URL slug untuk produk
            $table->text('deskripsi_singkat')->nullable(); // Deskripsi singkat produk
            $table->longText('deskripsi_lengkap')->nullable(); // Deskripsi lengkap produk
            $table->string('sku')->unique(); // Stock Keeping Unit
            $table->decimal('harga', 12, 2); // Harga produk
            $table->decimal('harga_diskon', 12, 2)->nullable(); // Harga setelah diskon
            $table->integer('persentase_diskon')->nullable(); // Persentase diskon
            $table->integer('stok')->default(0); // Jumlah stok
            $table->integer('minimal_stok')->default(5); // Minimal stok untuk notifikasi
            $table->decimal('berat', 8, 2)->nullable(); // Berat produk (kg)
            $table->string('dimensi')->nullable(); // Dimensi produk (PxLxT)
            $table->string('material')->nullable(); // Material tas
            $table->string('warna')->nullable(); // Warna produk
            $table->boolean('produk_unggulan')->default(false); // Apakah produk unggulan
            $table->boolean('produk_baru')->default(false); // Apakah produk baru
            $table->boolean('aktif')->default(true); // Status aktif produk
            $table->json('tag')->nullable(); // Tags untuk pencarian
            $table->decimal('rating_rata', 3, 2)->default(0); // Rating rata-rata
            $table->integer('jumlah_ulasan')->default(0); // Jumlah ulasan
            $table->integer('jumlah_terjual')->default(0); // Jumlah produk terjual
            $table->integer('jumlah_dilihat')->default(0); // Jumlah view produk
            $table->timestamp('tanggal_rilis')->nullable(); // Tanggal rilis produk
            $table->timestamps();
            
            // Indexes untuk performance
            $table->index(['aktif', 'kategori_id']);
            $table->index(['produk_unggulan', 'aktif']);
            $table->index(['produk_baru', 'aktif']);
            $table->index('rating_rata');
            $table->index('harga');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
