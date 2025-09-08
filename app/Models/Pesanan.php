<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pesanan extends Model
{
    use HasFactory;

    protected $table = 'pesanan';

    protected $fillable = [
        'nomor_pesanan',
        'user_id',
        'kupon_id',
        'nama_customer',
        'email_customer',
        'telepon_customer',
        'alamat_pengiriman',
        'kota',
        'provinsi',
        'kode_pos',
        'catatan_pengiriman',
        'subtotal',
        'diskon_kupon',
        'ongkos_kirim',
        'total_akhir',
        'status_pesanan',
        'metode_pembayaran',
        'status_pembayaran',
        'kurir',
        'layanan_kurir',
        'nomor_resi',
        'tanggal_pembayaran',
        'tanggal_pengiriman',
        'tanggal_selesai',
        'batas_pembayaran',
        'catatan_admin',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'diskon_kupon' => 'decimal:2',
        'ongkos_kirim' => 'decimal:2',
        'total_akhir' => 'decimal:2',
        'tanggal_pembayaran' => 'datetime',
        'tanggal_pengiriman' => 'datetime',
        'tanggal_selesai' => 'datetime',
        'batas_pembayaran' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function kupon(): BelongsTo
    {
        return $this->belongsTo(Kupon::class, 'kupon_id');
    }

    public function detailPesanan(): HasMany
    {
        return $this->hasMany(DetailPesanan::class, 'pesanan_id');
    }

    public function penggunaanKupon(): HasMany
    {
        return $this->hasMany(PenggunaanKupon::class, 'pesanan_id');
    }

    public function ulasanProduk(): HasMany
    {
        return $this->hasMany(UlasanProduk::class, 'pesanan_id');
    }

    // Scopes
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status_pesanan', $status);
    }

    public function scopeByStatusPembayaran($query, $status)
    {
        return $query->where('status_pembayaran', $status);
    }

    public function scopePending($query)
    {
        return $query->where('status_pesanan', 'menunggu_pembayaran');
    }

    public function scopeSelesai($query)
    {
        return $query->where('status_pesanan', 'selesai');
    }

    public function scopeDibatalkan($query)
    {
        return $query->where('status_pesanan', 'dibatalkan');
    }

    // Accessors
    public function getStatusBadgeAttribute()
    {
        $statusMap = [
            'menunggu_pembayaran' => ['label' => 'Menunggu Pembayaran', 'color' => 'warning'],
            'dibayar' => ['label' => 'Dibayar', 'color' => 'info'],
            'diproses' => ['label' => 'Diproses', 'color' => 'primary'],
            'dikirim' => ['label' => 'Dikirim', 'color' => 'info'],
            'selesai' => ['label' => 'Selesai', 'color' => 'success'],
            'dibatalkan' => ['label' => 'Dibatalkan', 'color' => 'danger'],
        ];

        return $statusMap[$this->status_pesanan] ?? ['label' => $this->status_pesanan, 'color' => 'secondary'];
    }

    public function getBisaDibatalkanAttribute()
    {
        return in_array($this->status_pesanan, ['menunggu_pembayaran', 'dibayar']);
    }

    public function getBisaDiulasAttribute()
    {
        return $this->status_pesanan === 'selesai';
    }

    // Static Methods
    public static function generateNomorPesanan()
    {
        $prefix = 'TKB';
        $date = now()->format('ymd');
        $lastOrder = self::where('nomor_pesanan', 'like', $prefix . $date . '%')
                         ->orderBy('nomor_pesanan', 'desc')
                         ->first();

        if ($lastOrder) {
            $lastNumber = (int) substr($lastOrder->nomor_pesanan, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . $date . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }
}
