<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UlasanProduk extends Model
{
    use HasFactory;

    protected $table = 'ulasan_produk';

    protected $fillable = [
        'user_id',
        'nama_customer',
        'produk_id',
        'pesanan_id',
        'rating',
        'judul_ulasan',
        'isi_ulasan',
        'gambar_ulasan',
        'disetujui',
        'ditampilkan',
        'alasan_penolakan',
        'helpful_count',
        'unhelpful_count',
        'balasan_admin',
        'tanggal_balasan',
        'admin_id',
    ];

    protected $casts = [
        'rating' => 'integer',
        'gambar_ulasan' => 'array',
        'disetujui' => 'boolean',
        'ditampilkan' => 'boolean',
        'helpful_count' => 'integer',
        'unhelpful_count' => 'integer',
        'tanggal_balasan' => 'datetime',
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

    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    // Scopes
    public function scopeDisetujui($query)
    {
        return $query->where('disetujui', true);
    }

    public function scopeDitampilkan($query)
    {
        return $query->where('ditampilkan', true);
    }

    public function scopeForProduk($query, $produkId)
    {
        return $query->where('produk_id', $produkId);
    }

    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    public function scopePublik($query)
    {
        return $query->where('disetujui', true)->where('ditampilkan', true);
    }

    // Accessors
    public function getRatingBintangAttribute()
    {
        return str_repeat('★', $this->rating) . str_repeat('☆', 5 - $this->rating);
    }

    public function getUrlGambarUlasanAttribute()
    {
        if ($this->gambar_ulasan && is_array($this->gambar_ulasan)) {
            return array_map(function($gambar) {
                return asset('storage/' . $gambar);
            }, $this->gambar_ulasan);
        }
        return [];
    }

    public function getTotalHelpfulAttribute()
    {
        return $this->helpful_count + $this->unhelpful_count;
    }

    public function getPersentaseHelpfulAttribute()
    {
        $total = $this->getTotalHelpfulAttribute();
        if ($total === 0) return 0;
        return round(($this->helpful_count / $total) * 100);
    }
}
