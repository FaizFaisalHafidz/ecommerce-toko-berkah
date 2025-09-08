<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Keranjang extends Model
{
    use HasFactory;

    protected $table = 'keranjang';

    protected $fillable = [
        'user_id',
        'session_id',
        'produk_id',
        'jumlah',
        'harga_saat_ditambah',
        'catatan',
    ];

    protected $casts = [
        'jumlah' => 'integer',
        'harga_saat_ditambah' => 'decimal:2',
        'catatan' => 'array',
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

    // Accessors
    public function getSubtotalAttribute()
    {
        return $this->jumlah * $this->harga_saat_ditambah;
    }

    public function getTotalBeratAttribute()
    {
        if ($this->produk && $this->produk->berat) {
            return $this->jumlah * $this->produk->berat;
        }
        return 0;
    }
}
