<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kupon extends Model
{
    use HasFactory;

    protected $table = 'kupon';

    protected $fillable = [
        'kode_kupon',
        'nama_kupon',
        'deskripsi',
        'jenis_diskon',
        'nilai_diskon',
        'maksimal_diskon',
        'minimal_pembelian',
        'batas_penggunaan',
        'batas_penggunaan_user',
        'jumlah_terpakai',
        'kategori_berlaku',
        'produk_berlaku',
        'user_berlaku',
        'tanggal_mulai',
        'tanggal_berakhir',
        'aktif',
        'kupon_publik',
        'gambar_kupon',
        'syarat_ketentuan',
    ];

    protected $casts = [
        'nilai_diskon' => 'decimal:2',
        'maksimal_diskon' => 'decimal:2',
        'minimal_pembelian' => 'decimal:2',
        'batas_penggunaan' => 'integer',
        'batas_penggunaan_user' => 'integer',
        'jumlah_terpakai' => 'integer',
        'kategori_berlaku' => 'array',
        'produk_berlaku' => 'array',
        'user_berlaku' => 'array',
        'tanggal_mulai' => 'datetime',
        'tanggal_berakhir' => 'datetime',
        'aktif' => 'boolean',
        'kupon_publik' => 'boolean',
    ];

    // Relationships
    public function pesanan(): HasMany
    {
        return $this->hasMany(Pesanan::class, 'kupon_id');
    }

    public function penggunaanKupon(): HasMany
    {
        return $this->hasMany(PenggunaanKupon::class, 'kupon_id');
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('aktif', true);
    }

    public function scopePublik($query)
    {
        return $query->where('kupon_publik', true);
    }

    public function scopeBerlaku($query)
    {
        $now = now();
        return $query->where('tanggal_mulai', '<=', $now)
                    ->where('tanggal_berakhir', '>=', $now);
    }

    public function scopeTersedia($query)
    {
        return $query->whereRaw('(batas_penggunaan IS NULL OR jumlah_terpakai < batas_penggunaan)');
    }

    // Methods
    public function isValid($userId = null, $subtotal = 0, $kategoriIds = [], $produkIds = [])
    {
        // Cek apakah kupon aktif
        if (!$this->aktif) {
            return ['valid' => false, 'message' => 'Kupon tidak aktif'];
        }

        // Cek tanggal berlaku
        $now = now();
        if ($this->tanggal_mulai > $now || $this->tanggal_berakhir < $now) {
            return ['valid' => false, 'message' => 'Kupon sudah tidak berlaku'];
        }

        // Cek minimal pembelian
        if ($subtotal < $this->minimal_pembelian) {
            return ['valid' => false, 'message' => "Minimal pembelian Rp " . number_format($this->minimal_pembelian)];
        }

        // Cek batas penggunaan total
        if ($this->batas_penggunaan && $this->jumlah_terpakai >= $this->batas_penggunaan) {
            return ['valid' => false, 'message' => 'Kupon sudah habis'];
        }

        // Cek batas penggunaan per user
        if ($userId && $this->batas_penggunaan_user) {
            $jumlahPakai = $this->penggunaanKupon()->where('user_id', $userId)->count();
            if ($jumlahPakai >= $this->batas_penggunaan_user) {
                return ['valid' => false, 'message' => 'Anda sudah mencapai batas penggunaan kupon ini'];
            }
        }

        // Cek user yang berhak (jika ada)
        if ($userId && $this->user_berlaku && !in_array($userId, $this->user_berlaku)) {
            return ['valid' => false, 'message' => 'Kupon tidak berlaku untuk akun Anda'];
        }

        // Cek kategori yang berlaku (jika ada)
        if ($this->kategori_berlaku && $kategoriIds) {
            $validKategori = array_intersect($this->kategori_berlaku, $kategoriIds);
            if (empty($validKategori)) {
                return ['valid' => false, 'message' => 'Kupon tidak berlaku untuk kategori produk ini'];
            }
        }

        // Cek produk yang berlaku (jika ada)
        if ($this->produk_berlaku && $produkIds) {
            $validProduk = array_intersect($this->produk_berlaku, $produkIds);
            if (empty($validProduk)) {
                return ['valid' => false, 'message' => 'Kupon tidak berlaku untuk produk ini'];
            }
        }

        return ['valid' => true, 'message' => 'Kupon valid'];
    }

    public function hitungDiskon($subtotal)
    {
        if ($this->jenis_diskon === 'persentase') {
            $diskon = ($subtotal * $this->nilai_diskon) / 100;
            if ($this->maksimal_diskon && $diskon > $this->maksimal_diskon) {
                $diskon = $this->maksimal_diskon;
            }
        } else {
            $diskon = $this->nilai_diskon;
        }

        return min($diskon, $subtotal); // Diskon tidak boleh melebihi subtotal
    }

    // Accessors
    public function getStatusAttribute()
    {
        $now = now();
        
        if (!$this->aktif) return 'tidak_aktif';
        if ($this->tanggal_mulai > $now) return 'belum_berlaku';
        if ($this->tanggal_berakhir < $now) return 'kadaluarsa';
        if ($this->batas_penggunaan && $this->jumlah_terpakai >= $this->batas_penggunaan) return 'habis';
        
        return 'aktif';
    }

    public function getSisaKuponAttribute()
    {
        if (!$this->batas_penggunaan) return null;
        return max(0, $this->batas_penggunaan - $this->jumlah_terpakai);
    }
}
