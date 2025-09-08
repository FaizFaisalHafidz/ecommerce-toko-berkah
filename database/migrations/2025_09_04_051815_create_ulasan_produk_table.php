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
        Schema::create('ulasan_produk', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('produk_id')->constrained('produk')->onDelete('cascade');
            $table->foreignId('pesanan_id')->nullable()->constrained('pesanan')->onDelete('set null');
            
            $table->integer('rating'); // Rating 1-5 bintang
            $table->string('judul_ulasan')->nullable(); // Judul ulasan
            $table->text('isi_ulasan')->nullable(); // Isi ulasan
            $table->json('gambar_ulasan')->nullable(); // Array gambar ulasan
            
            // Status dan Moderasi
            $table->boolean('disetujui')->default(false); // Apakah ulasan disetujui admin
            $table->boolean('ditampilkan')->default(true); // Apakah ulasan ditampilkan
            $table->text('alasan_penolakan')->nullable(); // Alasan jika ulasan ditolak
            
            // Info Helpful
            $table->integer('helpful_count')->default(0); // Jumlah yang menganggap helpful
            $table->integer('unhelpful_count')->default(0); // Jumlah yang menganggap tidak helpful
            
            // Balasan Admin
            $table->text('balasan_admin')->nullable();
            $table->timestamp('tanggal_balasan')->nullable();
            $table->foreignId('admin_id')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index(['produk_id', 'disetujui']);
            $table->index(['user_id', 'produk_id']);
            $table->index('rating');
            $table->unique(['user_id', 'produk_id', 'pesanan_id']); // Satu user hanya bisa review 1x per produk per pesanan
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ulasan_produk');
    }
};
