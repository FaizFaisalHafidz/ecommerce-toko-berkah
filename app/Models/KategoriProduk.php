<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class KategoriProduk extends Model
{
    use HasFactory;

    protected $table = 'kategori_produk';

    protected $fillable = [
        'nama_kategori',
        'slug_kategori',
        'deskripsi_kategori',
        'gambar_kategori',
        'aktif',
        'urutan',
    ];

    protected $casts = [
        'aktif' => 'boolean',
        'urutan' => 'integer',
    ];

    // Relationships
    public function produk(): HasMany
    {
        return $this->hasMany(Produk::class, 'kategori_id');
    }

    public function produkAktif(): HasMany
    {
        return $this->hasMany(Produk::class, 'kategori_id')->where('aktif', true);
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('aktif', true);
    }

    public function scopeUrutan($query)
    {
        return $query->orderBy('urutan', 'asc');
    }

    // Accessors
    public function getJumlahProdukAttribute()
    {
        return $this->produkAktif()->count();
    }
}
