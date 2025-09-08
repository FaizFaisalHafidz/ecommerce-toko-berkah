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
        Schema::create('penggunaan_kupon', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kupon_id')->constrained('kupon')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('pesanan_id')->constrained('pesanan')->onDelete('cascade');
            $table->decimal('nilai_diskon_digunakan', 12, 2); // Nilai diskon yang benar-benar digunakan
            $table->decimal('subtotal_sebelum_diskon', 12, 2); // Subtotal sebelum diskon kupon
            $table->timestamps();
            
            // Indexes
            $table->index('kupon_id');
            $table->index('user_id');
            $table->index('pesanan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penggunaan_kupon');
    }
};
