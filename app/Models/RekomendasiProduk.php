<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RekomendasiProduk extends Model
{
    use HasFactory;

    protected $table = 'rekomendasi_produk';

    protected $fillable = [
        'user_id',
        'session_id',
        'produk_id',
        'jenis_rekomendasi',
        'skor_rekomendasi',
        'confidence_score',
        'konteks',
        'alasan_rekomendasi',
        'metadata_algorithm',
        'ditampilkan',
        'diklik',
        'tanggal_klik',
        'tanggal_expired',
        'versi_algorithm',
    ];

    protected $casts = [
        'skor_rekomendasi' => 'decimal:4',
        'confidence_score' => 'decimal:4',
        'alasan_rekomendasi' => 'array',
        'metadata_algorithm' => 'array',
        'ditampilkan' => 'boolean',
        'diklik' => 'boolean',
        'tanggal_klik' => 'datetime',
        'tanggal_expired' => 'datetime',
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

    public function scopeByJenis($query, $jenisRekomendasi)
    {
        return $query->where('jenis_rekomendasi', $jenisRekomendasi);
    }

    public function scopeDitampilkan($query)
    {
        return $query->where('ditampilkan', true);
    }

    public function scopeBelumExpired($query)
    {
        return $query->where(function($q) {
            $q->whereNull('tanggal_expired')
              ->orWhere('tanggal_expired', '>', now());
        });
    }

    public function scopeHighScore($query, $minScore = 0.5)
    {
        return $query->where('skor_rekomendasi', '>=', $minScore);
    }

    public function scopeOrderByScore($query)
    {
        return $query->orderBy('skor_rekomendasi', 'desc');
    }

    public function scopeWithProdukAktif($query)
    {
        return $query->whereHas('produk', function($q) {
            $q->where('aktif', true)->where('stok', '>', 0);
        });
    }

    // Static Methods
    public static function getRekomendasi($userId = null, $sessionId = null, $limit = 10, $jenisRekomendasi = null)
    {
        $query = self::query()
            ->ditampilkan()
            ->belumExpired()
            ->withProdukAktif()
            ->orderByScore()
            ->limit($limit);

        if ($jenisRekomendasi) {
            $query->byJenis($jenisRekomendasi);
        }

        if ($userId) {
            $query->forUser($userId);
        } elseif ($sessionId) {
            $query->forSession($sessionId);
        }

        return $query->with('produk.gambarUtama', 'produk.kategori')->get();
    }

    public static function saveRekomendasi($userId, $sessionId, $produkId, $jenisRekomendasi, $skor, $metadata = [])
    {
        return self::updateOrCreate(
            [
                'user_id' => $userId,
                'session_id' => $sessionId,
                'produk_id' => $produkId,
                'jenis_rekomendasi' => $jenisRekomendasi,
            ],
            [
                'skor_rekomendasi' => $skor,
                'metadata_algorithm' => $metadata,
                'tanggal_expired' => now()->addDays(7), // Expired dalam 7 hari
                'versi_algorithm' => config('app.recommendation_version', '1.0'),
            ]
        );
    }

    public static function recordClick($rekomendasiId)
    {
        return self::where('id', $rekomendasiId)->update([
            'diklik' => true,
            'tanggal_klik' => now(),
        ]);
    }

    public static function cleanupExpired()
    {
        return self::where('tanggal_expired', '<', now())->delete();
    }

    // Accessors
    public function getClickThroughRateAttribute()
    {
        // Menghitung CTR berdasarkan total tampilan vs klik
        // Ini adalah contoh sederhana, di production mungkin perlu data lebih detail
        return $this->diklik ? 100 : 0;
    }

    public function getAlgorithmPerformanceAttribute()
    {
        return [
            'score' => $this->skor_rekomendasi,
            'confidence' => $this->confidence_score,
            'clicked' => $this->diklik,
            'age' => $this->created_at->diffInHours(now()),
        ];
    }
}
