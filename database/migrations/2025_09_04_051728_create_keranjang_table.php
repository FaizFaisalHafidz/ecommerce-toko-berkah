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
        Schema::create('keranjang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('session_id')->nullable(); // Untuk guest user
            $table->foreignId('produk_id')->constrained('produk')->onDelete('cascade');
            $table->integer('jumlah'); // Jumlah produk
            $table->decimal('harga_saat_ditambah', 12, 2); // Harga saat produk ditambah ke keranjang
            $table->json('catatan')->nullable(); // Catatan khusus dari customer
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'produk_id']);
            $table->index('session_id');
            $table->unique(['user_id', 'produk_id']); // Satu user hanya bisa punya 1 item sama di keranjang
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keranjang');
    }
};
