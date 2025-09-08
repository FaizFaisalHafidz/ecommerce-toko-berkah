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
        Schema::create('gambar_produk', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produk_id')->constrained('produk')->onDelete('cascade');
            $table->string('nama_file'); // Nama file gambar
            $table->string('path_gambar'); // Path lengkap gambar
            $table->string('alt_text')->nullable(); // Alt text untuk SEO
            $table->boolean('gambar_utama')->default(false); // Apakah ini gambar utama
            $table->integer('urutan')->default(0); // Urutan tampil gambar
            $table->integer('ukuran_file')->nullable(); // Ukuran file dalam bytes
            $table->string('tipe_file')->nullable(); // Tipe file (jpg, png, webp)
            $table->timestamps();
            
            // Indexes
            $table->index(['produk_id', 'gambar_utama']);
            $table->index(['produk_id', 'urutan']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gambar_produk');
    }
};
