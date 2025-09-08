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
        Schema::create('kupon', function (Blueprint $table) {
            $table->id();
            $table->string('kode_kupon')->unique(); // Kode kupon unik
            $table->string('nama_kupon'); // Nama kupon untuk display
            $table->text('deskripsi')->nullable(); // Deskripsi kupon
            
            // Jenis dan Nilai Diskon
            $table->enum('jenis_diskon', ['persentase', 'nominal']); // Jenis diskon
            $table->decimal('nilai_diskon', 12, 2); // Nilai diskon (% atau nominal)
            $table->decimal('maksimal_diskon', 12, 2)->nullable(); // Maksimal diskon untuk jenis persentase
            
            // Syarat Penggunaan
            $table->decimal('minimal_pembelian', 12, 2)->default(0); // Minimal pembelian
            $table->integer('batas_penggunaan')->nullable(); // Batas total penggunaan kupon
            $table->integer('batas_penggunaan_user')->nullable(); // Batas penggunaan per user
            $table->integer('jumlah_terpakai')->default(0); // Jumlah kupon yang sudah terpakai
            
            // Kategori dan Produk Berlaku
            $table->json('kategori_berlaku')->nullable(); // Array ID kategori yang berlaku
            $table->json('produk_berlaku')->nullable(); // Array ID produk yang berlaku
            $table->json('user_berlaku')->nullable(); // Array ID user yang bisa pakai (untuk kupon eksklusif)
            
            // Waktu Berlaku
            $table->timestamp('tanggal_mulai');
            $table->timestamp('tanggal_berakhir');
            
            // Status
            $table->boolean('aktif')->default(true);
            $table->boolean('kupon_publik')->default(true); // Apakah kupon bisa dilihat publik
            
            // Info Tambahan
            $table->string('gambar_kupon')->nullable(); // Banner/gambar kupon
            $table->text('syarat_ketentuan')->nullable(); // Syarat dan ketentuan detail
            
            $table->timestamps();
            
            // Indexes
            $table->index('kode_kupon');
            $table->index(['aktif', 'tanggal_mulai', 'tanggal_berakhir']);
            $table->index('kupon_publik');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kupon');
    }
};
