<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PenggunaanKupon extends Model
{
    use HasFactory;

    protected $table = 'penggunaan_kupon';

    protected $fillable = [
        'kupon_id',
        'user_id',
        'pesanan_id',
        'nilai_diskon_digunakan',
        'subtotal_sebelum_diskon',
    ];

    protected $casts = [
        'nilai_diskon_digunakan' => 'decimal:2',
        'subtotal_sebelum_diskon' => 'decimal:2',
    ];

    // Relationships
    public function kupon(): BelongsTo
    {
        return $this->belongsTo(Kupon::class, 'kupon_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id');
    }

    // Scopes
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForKupon($query, $kuponId)
    {
        return $query->where('kupon_id', $kuponId);
    }

    // Accessors
    public function getPersentaseDiskonAttribute()
    {
        if ($this->subtotal_sebelum_diskon > 0) {
            return round(($this->nilai_diskon_digunakan / $this->subtotal_sebelum_diskon) * 100, 2);
        }
        return 0;
    }
}
