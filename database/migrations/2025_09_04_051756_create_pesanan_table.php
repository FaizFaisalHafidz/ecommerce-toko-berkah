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
        Schema::create('pesanan', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_pesanan')->unique(); // Nomor pesanan unik
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->unsignedBigInteger('kupon_id')->nullable(); // Sementara tanpa constraint
            
            // Data Customer
            $table->string('nama_customer');
            $table->string('email_customer');
            $table->string('telepon_customer');
            
            // Alamat Pengiriman
            $table->text('alamat_pengiriman');
            $table->string('kota');
            $table->string('provinsi');
            $table->string('kode_pos');
            $table->text('catatan_pengiriman')->nullable();
            
            // Biaya
            $table->decimal('subtotal', 12, 2); // Subtotal sebelum diskon dan ongkir
            $table->decimal('diskon_kupon', 12, 2)->default(0); // Diskon dari kupon
            $table->decimal('ongkos_kirim', 12, 2)->default(0); // Ongkos kirim
            $table->decimal('total_akhir', 12, 2); // Total yang harus dibayar
            
            // Status dan Pembayaran
            $table->enum('status_pesanan', [
                'menunggu_pembayaran',
                'dibayar',
                'diproses',
                'dikirim',
                'selesai',
                'dibatalkan'
            ])->default('menunggu_pembayaran');
            
            $table->enum('metode_pembayaran', [
                'transfer_bank',
                'cod',
                'e_wallet',
                'kartu_kredit'
            ])->nullable();
            
            $table->enum('status_pembayaran', [
                'belum_dibayar',
                'menunggu_verifikasi',
                'dibayar',
                'gagal'
            ])->default('belum_dibayar');
            
            // Info Pengiriman
            $table->string('kurir')->nullable(); // JNE, TIKI, POS, dll
            $table->string('layanan_kurir')->nullable(); // REG, YES, ONS, dll
            $table->string('nomor_resi')->nullable();
            
            // Tanggal Penting
            $table->timestamp('tanggal_pembayaran')->nullable();
            $table->timestamp('tanggal_pengiriman')->nullable();
            $table->timestamp('tanggal_selesai')->nullable();
            $table->timestamp('batas_pembayaran')->nullable();
            
            $table->text('catatan_admin')->nullable(); // Catatan dari admin
            $table->timestamps();
            
            // Indexes
            $table->index('nomor_pesanan');
            $table->index('user_id');
            $table->index('status_pesanan');
            $table->index('status_pembayaran');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};
