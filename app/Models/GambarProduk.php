<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GambarProduk extends Model
{
    use HasFactory;

    protected $table = 'gambar_produk';

    protected $fillable = [
        'produk_id',
        'nama_file',
        'path_gambar',
        'alt_text',
        'gambar_utama',
        'urutan',
        'ukuran_file',
        'tipe_file',
    ];

    protected $casts = [
        'gambar_utama' => 'boolean',
        'urutan' => 'integer',
        'ukuran_file' => 'integer',
    ];

    // Relationships
    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'produk_id');
    }

    // Scopes
    public function scopeUtama($query)
    {
        return $query->where('gambar_utama', true);
    }

    public function scopeUrutan($query)
    {
        return $query->orderBy('urutan', 'asc');
    }

    // Accessors
    public function getUrlGambarAttribute()
    {
        return asset('storage/' . $this->path_gambar);
    }

    public function getUkuranFormatAttribute()
    {
        if (!$this->ukuran_file) return null;
        
        $size = $this->ukuran_file;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $size > 1024 && $i < count($units) - 1; $i++) {
            $size /= 1024;
        }
        
        return round($size, 2) . ' ' . $units[$i];
    }
}
