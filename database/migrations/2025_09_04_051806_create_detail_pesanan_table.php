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
        Schema::create('detail_pesanan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pesanan_id')->constrained('pesanan')->onDelete('cascade');
            $table->foreignId('produk_id')->constrained('produk')->onDelete('cascade');
            
            // Data Produk saat Pesanan (untuk history)
            $table->string('nama_produk'); // Nama produk saat dipesan
            $table->string('sku_produk'); // SKU produk saat dipesan
            $table->decimal('harga_satuan', 12, 2); // Harga satuan saat dipesan
            $table->decimal('harga_diskon', 12, 2)->nullable(); // Harga diskon saat dipesan
            $table->integer('jumlah'); // Jumlah produk yang dipesan
            $table->decimal('subtotal', 12, 2); // Subtotal untuk item ini
            
            // Info tambahan
            $table->string('gambar_produk')->nullable(); // Path gambar produk saat dipesan
            $table->json('spesifikasi_produk')->nullable(); // Spesifikasi produk saat dipesan
            
            $table->timestamps();
            
            // Indexes
            $table->index('pesanan_id');
            $table->index('produk_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_pesanan');
    }
};
