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
        Schema::table('ulasan_produk', function (Blueprint $table) {
            // Drop foreign key constraint dan index
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id', 'produk_id']);
            $table->dropUnique(['user_id', 'produk_id', 'pesanan_id']);
            
            // Ubah user_id menjadi nullable dan tambah nama_customer
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->string('nama_customer')->after('user_id'); // Nama customer dari pesanan
            
            // Buat index dan constraint baru
            $table->index(['produk_id', 'pesanan_id']);
            $table->unique(['produk_id', 'pesanan_id']); // Satu review per produk per pesanan
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ulasan_produk', function (Blueprint $table) {
            // Kembalikan seperti semula
            $table->dropColumn('nama_customer');
            $table->dropIndex(['produk_id', 'pesanan_id']);
            $table->dropUnique(['produk_id', 'pesanan_id']);
            
            // Kembalikan user_id constraint
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['user_id', 'produk_id']);
            $table->unique(['user_id', 'produk_id', 'pesanan_id']);
        });
    }
};
