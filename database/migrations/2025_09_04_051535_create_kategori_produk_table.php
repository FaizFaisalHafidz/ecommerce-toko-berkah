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
        Schema::create('kategori_produk', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kategori'); // Nama kategori (Tote Bag, Sling Bag, Backpack, dll)
            $table->string('slug_kategori')->unique(); // URL slug untuk kategori
            $table->text('deskripsi_kategori')->nullable(); // Deskripsi kategori
            $table->string('gambar_kategori')->nullable(); // Path gambar kategori
            $table->boolean('aktif')->default(true); // Status aktif kategori
            $table->integer('urutan')->default(0); // Urutan tampil kategori
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kategori_produk');
    }
};
