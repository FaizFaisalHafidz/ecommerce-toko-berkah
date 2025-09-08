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
        Schema::create('aktivitas_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('session_id')->nullable(); // Untuk guest user
            $table->foreignId('produk_id')->constrained('produk')->onDelete('cascade');
            
            // Jenis Aktivitas untuk Collaborative Filtering
            $table->enum('jenis_aktivitas', [
                'view',           // Melihat produk
                'add_to_cart',    // Menambah ke keranjang
                'remove_from_cart', // Menghapus dari keranjang
                'add_to_wishlist', // Menambah ke wishlist
                'remove_from_wishlist', // Menghapus dari wishlist
                'purchase',       // Membeli produk
                'review',         // Memberikan ulasan
                'search',         // Mencari produk
                'share'           // Membagikan produk
            ]);
            
            // Data Tambahan
            $table->json('metadata')->nullable(); // Data tambahan seperti search query, rating, dll
            $table->integer('durasi_view')->nullable(); // Durasi melihat produk (detik)
            $table->string('sumber_traffic')->nullable(); // Dari mana user datang (search, category, recommendation, dll)
            $table->string('device_type')->nullable(); // desktop, mobile, tablet
            $table->ipAddress('ip_address')->nullable();
            
            // Bobot untuk Collaborative Filtering
            $table->decimal('bobot_aktivitas', 3, 2)->default(1.0); // Bobot aktivitas untuk algorithm
            
            $table->timestamps();
            
            // Indexes untuk Performance Collaborative Filtering
            $table->index(['user_id', 'jenis_aktivitas']);
            $table->index(['produk_id', 'jenis_aktivitas']);
            $table->index(['user_id', 'produk_id']);
            $table->index('session_id');
            $table->index(['created_at', 'jenis_aktivitas']);
            $table->index('bobot_aktivitas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aktivitas_user');
    }
};
