<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailPesanan extends Model
{
    use HasFactory;

    protected $table = 'detail_pesanan';

    protected $fillable = [
        'pesanan_id',
        'produk_id',
        'nama_produk',
        'sku_produk',
        'harga_satuan',
        'harga_diskon',
        'jumlah',
        'subtotal',
        'gambar_produk',
        'spesifikasi_produk',
    ];

    protected $casts = [
        'harga_satuan' => 'decimal:2',
        'harga_diskon' => 'decimal:2',
        'jumlah' => 'integer',
        'subtotal' => 'decimal:2',
        'spesifikasi_produk' => 'array',
    ];

    // Relationships
    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id');
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'produk_id');
    }

    // Accessors
    public function getHargaAkhirAttribute()
    {
        return $this->harga_diskon ?? $this->harga_satuan;
    }

    public function getTotalHargaAttribute()
    {
        return $this->jumlah * $this->getHargaAkhirAttribute();
    }

    public function getUrlGambarAttribute()
    {
        if ($this->gambar_produk) {
            return asset('storage/' . $this->gambar_produk);
        }
        return $this->produk ? $this->produk->gambarUtama?->url_gambar : null;
    }
}
