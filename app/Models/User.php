<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'nama_lengkap',
        'email',
        'password',
        'telepon',
        'tanggal_lahir',
        'jenis_kelamin',
        'alamat',
        'kota',
        'provinsi',
        'kode_pos',
        'foto_profil',
        'aktif',
        'terakhir_login',
        'menerima_notifikasi',
        'preferensi',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'tanggal_lahir' => 'date',
            'aktif' => 'boolean',
            'terakhir_login' => 'datetime',
            'menerima_notifikasi' => 'boolean',
            'preferensi' => 'array',
        ];
    }

    // Relationships
    public function keranjang(): HasMany
    {
        return $this->hasMany(Keranjang::class, 'user_id');
    }

    public function pesanan(): HasMany
    {
        return $this->hasMany(Pesanan::class, 'user_id');
    }

    public function ulasanProduk(): HasMany
    {
        return $this->hasMany(UlasanProduk::class, 'user_id');
    }

    public function wishlist(): HasMany
    {
        return $this->hasMany(Wishlist::class, 'user_id');
    }

    public function penggunaanKupon(): HasMany
    {
        return $this->hasMany(PenggunaanKupon::class, 'user_id');
    }

    public function aktivitasUser(): HasMany
    {
        return $this->hasMany(AktivitasUser::class, 'user_id');
    }

    public function rekomendasiProduk(): HasMany
    {
        return $this->hasMany(RekomendasiProduk::class, 'user_id');
    }

    public function balasanUlasan(): HasMany
    {
        return $this->hasMany(UlasanProduk::class, 'admin_id');
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('aktif', true);
    }

    public function scopeCustomer($query)
    {
        return $query->whereHas('roles', function($q) {
            $q->where('name', 'customer');
        });
    }

    public function scopeAdmin($query)
    {
        return $query->whereHas('roles', function($q) {
            $q->whereIn('name', ['admin', 'super-admin']);
        });
    }

    // Accessors
    public function getNamaLengkapAttribute()
    {
        return $this->attributes['nama_lengkap'] ?? $this->name;
    }

    public function getUrlFotoProfilAttribute()
    {
        if ($this->foto_profil) {
            return asset('storage/' . $this->foto_profil);
        }
        return asset('images/default-avatar.png');
    }

    public function getTotalPesananAttribute()
    {
        return $this->pesanan()->count();
    }

    public function getTotalBelanjaAttribute()
    {
        return $this->pesanan()->where('status_pesanan', 'selesai')->sum('total_akhir');
    }

    // Methods
    public function isAdmin()
    {
        return $this->hasRole(['admin', 'super-admin']);
    }

    public function isCustomer()
    {
        return $this->hasRole('customer');
    }

    public function updateTerakhirLogin()
    {
        $this->update(['terakhir_login' => now()]);
    }
}
