<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AktivitasUser extends Model
{
    use HasFactory;

    protected $table = 'aktivitas_user';

    protected $fillable = [
        'user_id',
        'session_id',
        'produk_id',
        'jenis_aktivitas',
        'metadata',
        'durasi_view',
        'sumber_traffic',
        'device_type',
        'ip_address',
        'bobot_aktivitas',
    ];

    protected $casts = [
        'metadata' => 'array',
        'durasi_view' => 'integer',
        'bobot_aktivitas' => 'decimal:2',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'produk_id');
    }

    // Scopes
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForSession($query, $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }

    public function scopeForUserOrSession($query, $userId = null, $sessionId = null)
    {
        if ($userId) {
            return $query->where('user_id', $userId);
        }
        return $query->where('session_id', $sessionId);
    }

    public function scopeByJenisAktivitas($query, $jenisAktivitas)
    {
        return $query->where('jenis_aktivitas', $jenisAktivitas);
    }

    public function scopeForProduk($query, $produkId)
    {
        return $query->where('produk_id', $produkId);
    }

    public function scopeRecentActivity($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function scopeHighValue($query)
    {
        return $query->whereIn('jenis_aktivitas', ['purchase', 'add_to_cart', 'review']);
    }

    // Static Methods untuk Collaborative Filtering
    public static function getBobotAktivitas($jenisAktivitas)
    {
        $bobot = [
            'view' => 1.0,
            'add_to_cart' => 3.0,
            'remove_from_cart' => -1.0,
            'add_to_wishlist' => 2.0,
            'remove_from_wishlist' => -0.5,
            'purchase' => 5.0,
            'review' => 4.0,
            'search' => 0.5,
            'share' => 1.5
        ];

        return $bobot[$jenisAktivitas] ?? 1.0;
    }

    public static function recordActivity($userId, $sessionId, $produkId, $jenisAktivitas, $metadata = null)
    {
        return self::create([
            'user_id' => $userId,
            'session_id' => $sessionId,
            'produk_id' => $produkId,
            'jenis_aktivitas' => $jenisAktivitas,
            'metadata' => $metadata,
            'bobot_aktivitas' => self::getBobotAktivitas($jenisAktivitas),
            'device_type' => request()->header('User-Agent') ? 'mobile' : 'desktop', // Simplified
            'ip_address' => request()->ip(),
            'sumber_traffic' => request()->header('referer') ? 'external' : 'internal',
        ]);
    }

    // Methods untuk Matrix Factorization
    public function getUserProductMatrix($limit = 1000)
    {
        return self::select('user_id', 'produk_id', 'bobot_aktivitas')
            ->whereNotNull('user_id')
            ->groupBy('user_id', 'produk_id')
            ->selectRaw('user_id, produk_id, SUM(bobot_aktivitas) as total_bobot')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
