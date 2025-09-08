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
        Schema::table('users', function (Blueprint $table) {
            $table->string('nama_lengkap')->after('name'); // Nama lengkap user
            $table->string('telepon')->nullable()->after('email'); // Nomor telepon
            $table->date('tanggal_lahir')->nullable()->after('telepon'); // Tanggal lahir
            $table->enum('jenis_kelamin', ['laki-laki', 'perempuan', 'tidak_disebutkan'])->nullable()->after('tanggal_lahir');
            $table->text('alamat')->nullable()->after('jenis_kelamin'); // Alamat lengkap
            $table->string('kota')->nullable()->after('alamat'); // Kota
            $table->string('provinsi')->nullable()->after('kota'); // Provinsi
            $table->string('kode_pos')->nullable()->after('provinsi'); // Kode pos
            $table->string('foto_profil')->nullable()->after('kode_pos'); // Path foto profil
            $table->boolean('aktif')->default(true)->after('foto_profil'); // Status aktif user
            $table->timestamp('terakhir_login')->nullable()->after('aktif'); // Waktu terakhir login
            $table->boolean('menerima_notifikasi')->default(true)->after('terakhir_login'); // Apakah menerima notifikasi
            $table->json('preferensi')->nullable()->after('menerima_notifikasi'); // Preferensi user untuk rekomendasi
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'nama_lengkap',
                'telepon',
                'tanggal_lahir', 
                'jenis_kelamin',
                'alamat',
                'kota',
                'provinsi',
                'kode_pos',
                'foto_profil',
                'aktif',
                'terakhir_login',
                'menerima_notifikasi',
                'preferensi'
            ]);
        });
    }
};
