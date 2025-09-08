<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Produk extends Model
{
    use HasFactory;

    protected $table = 'produk';

    protected $fillable = [
        'kategori_id',
        'nama_produk',
        'slug_produk',
        'deskripsi_singkat',
        'deskripsi_lengkap',
        'sku',
        'harga',
        'harga_diskon',
        'persentase_diskon',
        'stok',
        'minimal_stok',
        'berat',
        'dimensi',
        'material',
        'warna',
        'produk_unggulan',
        'produk_baru',
        'aktif',
        'tag',
        'rating_rata',
        'jumlah_ulasan',
        'jumlah_terjual',
        'jumlah_dilihat',
        'tanggal_rilis',
    ];

    protected $casts = [
        'harga' => 'decimal:2',
        'harga_diskon' => 'decimal:2',
        'persentase_diskon' => 'integer',
        'stok' => 'integer',
        'minimal_stok' => 'integer',
        'berat' => 'decimal:2',
        'produk_unggulan' => 'boolean',
        'produk_baru' => 'boolean',
        'aktif' => 'boolean',
        'tag' => 'array',
        'rating_rata' => 'decimal:2',
        'jumlah_ulasan' => 'integer',
        'jumlah_terjual' => 'integer',
        'jumlah_dilihat' => 'integer',
        'tanggal_rilis' => 'datetime',
    ];

    // Relationships
    public function kategori(): BelongsTo
    {
        return $this->belongsTo(KategoriProduk::class, 'kategori_id');
    }

    public function gambarProduk(): HasMany
    {
        return $this->hasMany(GambarProduk::class, 'produk_id')->orderBy('urutan');
    }

    public function gambarUtama()
    {
        return $this->hasOne(GambarProduk::class, 'produk_id')->where('gambar_utama', true);
    }

    public function ulasanProduk(): HasMany
    {
        return $this->hasMany(UlasanProduk::class, 'produk_id');
    }

    public function ulasanDiSetujui(): HasMany
    {
        return $this->hasMany(UlasanProduk::class, 'produk_id')->where('disetujui', true);
    }

    public function keranjang(): HasMany
    {
        return $this->hasMany(Keranjang::class, 'produk_id');
    }

    public function wishlist(): HasMany
    {
        return $this->hasMany(Wishlist::class, 'produk_id');
    }

    public function detailPesanan(): HasMany
    {
        return $this->hasMany(DetailPesanan::class, 'produk_id');
    }

    public function aktivitasUser(): HasMany
    {
        return $this->hasMany(AktivitasUser::class, 'produk_id');
    }

    public function rekomendasiProduk(): HasMany
    {
        return $this->hasMany(RekomendasiProduk::class, 'produk_id');
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('aktif', true);
    }

    public function scopeUnggulan($query)
    {
        return $query->where('produk_unggulan', true);
    }

    public function scopeBaru($query)
    {
        return $query->where('produk_baru', true);
    }

    public function scopeTersedia($query)
    {
        return $query->where('stok', '>', 0);
    }

    public function scopeKategori($query, $kategoriId)
    {
        return $query->where('kategori_id', $kategoriId);
    }

    // Accessors
    public function getHargaAkhirAttribute()
    {
        return $this->harga_diskon ?? $this->harga;
    }

    public function getDiskonPersentaseAttribute()
    {
        if ($this->harga_diskon && $this->harga > $this->harga_diskon) {
            return round((($this->harga - $this->harga_diskon) / $this->harga) * 100);
        }
        return 0;
    }

    public function getStokHabisAttribute()
    {
        return $this->stok <= 0;
    }

    public function getStokMenipis()
    {
        return $this->stok <= $this->minimal_stok;
    }
}
