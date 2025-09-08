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
        Schema::create('rekomendasi_produk', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('session_id')->nullable(); // Untuk guest user
            $table->foreignId('produk_id')->constrained('produk')->onDelete('cascade');
            
            // Jenis Rekomendasi
            $table->enum('jenis_rekomendasi', [
                'user_based',         // Collaborative Filtering berdasarkan user similarity
                'item_based',         // Collaborative Filtering berdasarkan item similarity
                'content_based',      // Content-based filtering
                'hybrid',             // Kombinasi dari berbagai metode
                'trending',           // Produk yang sedang trending
                'new_arrival',        // Produk baru
                'best_seller',        // Produk terlaris
                'similar_category',   // Produk dalam kategori yang sama
                'frequently_bought'   // Sering dibeli bersamaan
            ]);
            
            // Skor Rekomendasi
            $table->decimal('skor_rekomendasi', 5, 4); // Skor 0.0000 - 1.0000
            $table->decimal('confidence_score', 5, 4)->nullable(); // Tingkat kepercayaan rekomendasi
            
            // Konteks Rekomendasi
            $table->string('konteks')->nullable(); // Konteks kapan rekomendasi ini dibuat
            $table->json('alasan_rekomendasi')->nullable(); // Alasan mengapa produk ini direkomendasikan
            $table->json('metadata_algorithm')->nullable(); // Data tambahan untuk algorithm
            
            // Status
            $table->boolean('ditampilkan')->default(true);
            $table->boolean('diklik')->default(false);
            $table->timestamp('tanggal_klik')->nullable();
            $table->timestamp('tanggal_expired')->nullable(); // Kapan rekomendasi expired
            
            // Version Algorithm
            $table->string('versi_algorithm', 10)->default('1.0'); // Untuk tracking performa algorithm
            
            $table->timestamps();
            
            // Indexes untuk Performance
            $table->index(['user_id', 'jenis_rekomendasi', 'ditampilkan']);
            $table->index(['produk_id', 'skor_rekomendasi']);
            $table->index('session_id');
            $table->index(['created_at', 'tanggal_expired']);
            $table->index(['skor_rekomendasi', 'jenis_rekomendasi']);
            $table->index('versi_algorithm');
            
            // Composite index untuk query rekomendasi
            $table->index(['user_id', 'ditampilkan', 'skor_rekomendasi', 'tanggal_expired'], 'idx_rekomendasi_user_query');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rekomendasi_produk');
    }
};
