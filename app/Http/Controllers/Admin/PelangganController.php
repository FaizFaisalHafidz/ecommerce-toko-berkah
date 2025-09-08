<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PelangganController extends Controller
{
    public function index()
    {
        // Ambil data pelanggan dari pesanan, baik guest maupun registered user
        $pelanggan = Pesanan::select([
                'nama_customer',
                'email_customer', 
                'telepon_customer',
                'kota',
                'provinsi',
                'user_id'
            ])
            ->selectRaw('COUNT(*) as total_pesanan')
            ->selectRaw('SUM(total_akhir) as total_belanja')
            ->selectRaw('MAX(created_at) as pesanan_terakhir')
            ->selectRaw('MIN(created_at) as pesanan_pertama')
            ->groupBy(['nama_customer', 'email_customer', 'telepon_customer', 'kota', 'provinsi', 'user_id'])
            ->orderBy('pesanan_terakhir', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'nama_customer' => $item->nama_customer,
                    'email_customer' => $item->email_customer,
                    'telepon_customer' => $item->telepon_customer,
                    'kota' => $item->kota,
                    'provinsi' => $item->provinsi,
                    'is_registered' => !is_null($item->user_id),
                    'user_id' => $item->user_id,
                    'total_pesanan' => $item->total_pesanan,
                    'total_belanja' => $item->total_belanja,
                    'pesanan_terakhir' => Carbon::parse($item->pesanan_terakhir)->format('d M Y'),
                    'pesanan_pertama' => Carbon::parse($item->pesanan_pertama)->format('d M Y'),
                    'status_customer' => !is_null($item->user_id) ? 'Member' : 'Guest',
                ];
            });

        return Inertia::render('Admin/Pelanggan/Index', [
            'pelanggan' => $pelanggan,
        ]);
    }

    public function show($email)
    {
        // Ambil semua pesanan dari email customer tertentu
        $pesananCustomer = Pesanan::where('email_customer', $email)
            ->with(['detailPesanan.produk', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        if ($pesananCustomer->isEmpty()) {
            return redirect()->route('admin.pelanggan.index')
                ->with('error', 'Data pelanggan tidak ditemukan.');
        }

        $firstPesanan = $pesananCustomer->first();
        
        // Data customer
        $customerData = [
            'nama_customer' => $firstPesanan->nama_customer,
            'email_customer' => $firstPesanan->email_customer,
            'telepon_customer' => $firstPesanan->telepon_customer,
            'alamat_lengkap' => $firstPesanan->alamat_pengiriman,
            'kota' => $firstPesanan->kota,
            'provinsi' => $firstPesanan->provinsi,
            'kode_pos' => $firstPesanan->kode_pos,
            'is_registered' => !is_null($firstPesanan->user_id),
            'user_id' => $firstPesanan->user_id,
            'status_customer' => !is_null($firstPesanan->user_id) ? 'Member' : 'Guest',
            'total_pesanan' => $pesananCustomer->count(),
            'total_belanja' => $pesananCustomer->sum('total_akhir'),
            'pesanan_terakhir' => $pesananCustomer->first()->created_at->format('d M Y'),
            'bergabung_sejak' => !is_null($firstPesanan->user_id) ? 
                ($firstPesanan->user ? $firstPesanan->user->created_at->format('d M Y') : $pesananCustomer->last()->created_at->format('d M Y')) :
                $pesananCustomer->last()->created_at->format('d M Y'),
        ];

        // Statistik customer
        $statistik = [
            'total_pesanan' => $pesananCustomer->count(),
            'total_belanja' => $pesananCustomer->sum('total_akhir'),
            'rata_rata_pesanan' => $pesananCustomer->avg('total_akhir'),
            'pesanan_pertama' => $pesananCustomer->last()->created_at->format('d M Y'),
            'pesanan_terakhir' => $pesananCustomer->first()->created_at->format('d M Y'),
            'pesanan_selesai' => $pesananCustomer->where('status_pesanan', 'selesai')->count(),
            'pesanan_dibatalkan' => $pesananCustomer->where('status_pesanan', 'dibatalkan')->count(),
        ];

        // Daftar pesanan
        $pesanan = $pesananCustomer->map(function ($pesanan) {
            return [
                'id' => $pesanan->id,
                'tanggal_pesanan' => $pesanan->created_at->format('d M Y'),
                'total_pesanan' => $pesanan->total_akhir,
                'status_pesanan' => $pesanan->status_pesanan,
                'jumlah_item' => $pesanan->detailPesanan->count(),
                'nomor_pesanan' => $pesanan->nomor_pesanan,
                'status_pembayaran' => $pesanan->status_pembayaran,
                'metode_pembayaran' => $pesanan->metode_pembayaran,
                'alamat_pengiriman' => $pesanan->alamat_pengiriman,
                'kota' => $pesanan->kota,
                'provinsi' => $pesanan->provinsi,
                'kode_pos' => $pesanan->kode_pos,
                'kurir' => $pesanan->kurir,
                'layanan_kurir' => $pesanan->layanan_kurir,
                'nomor_resi' => $pesanan->nomor_resi,
                'created_at' => $pesanan->created_at->format('d M Y H:i'),
                'items' => $pesanan->detailPesanan->map(function ($detail) {
                    return [
                        'nama_produk' => $detail->produk->nama_produk,
                        'kuantitas' => $detail->kuantitas,
                        'harga' => $detail->harga,
                        'subtotal' => $detail->subtotal,
                    ];
                }),
            ];
        });

        // Alamat pengiriman yang pernah digunakan
        $alamatPengiriman = $pesananCustomer->map(function ($pesanan) {
            return [
                'alamat' => $pesanan->alamat_pengiriman,
                'kota' => $pesanan->kota,
                'provinsi' => $pesanan->provinsi,
                'kode_pos' => $pesanan->kode_pos,
                'full_address' => $pesanan->alamat_pengiriman . ', ' . $pesanan->kota . ', ' . $pesanan->provinsi . ' ' . $pesanan->kode_pos,
            ];
        })->unique('full_address')->values();

        return Inertia::render('Admin/Pelanggan/Show', [
            'customer' => $customerData,
            'statistik' => $statistik,
            'pesanan' => $pesanan,
            'alamat_pengiriman' => $alamatPengiriman,
        ]);
    }

    public function edit($email)
    {
        // Untuk edit, kita hanya bisa edit data user yang registered
        $pesanan = Pesanan::where('email_customer', $email)
            ->whereNotNull('user_id')
            ->with('user')
            ->first();

        if (!$pesanan || !$pesanan->user) {
            return redirect()->route('admin.pelanggan.index')
                ->with('error', 'Hanya data member yang dapat diedit. Customer guest tidak dapat diedit.');
        }

        $user = $pesanan->user;

        return Inertia::render('Admin/Pelanggan/Edit', [
            'customer' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->nomor_telepon ?? '',
                'address' => $user->alamat ?? '',
                'city' => $user->kota ?? '',
                'province' => $user->provinsi ?? '',
                'postal_code' => $user->kode_pos ?? '',
                'nama_lengkap' => $user->nama_lengkap,
                'tanggal_lahir' => $user->tanggal_lahir?->format('Y-m-d'),
                'jenis_kelamin' => $user->jenis_kelamin,
                'created_at' => $user->created_at->format('d M Y H:i'),
                'email_verified_at' => $user->email_verified_at?->format('d M Y H:i'),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:10',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'nomor_telepon' => $request->phone,
            'alamat' => $request->address,
            'kota' => $request->city,
            'provinsi' => $request->province,
            'kode_pos' => $request->postal_code,
        ]);

        return redirect()->route('admin.pelanggan.show', $user->email)
            ->with('success', 'Data pelanggan berhasil diperbarui.');
    }

    public function destroy($email)
    {
        // Untuk hapus, kita hanya bisa hapus user yang registered
        $pesanan = Pesanan::where('email_customer', $email)
            ->whereNotNull('user_id')
            ->with('user')
            ->first();

        if (!$pesanan || !$pesanan->user) {
            return redirect()->route('admin.pelanggan.index')
                ->with('error', 'Hanya data member yang dapat dihapus. Data guest customer tidak dapat dihapus.');
        }

        $user = $pesanan->user;

        // Check if user has pending orders
        $hasPendingOrders = Pesanan::where('user_id', $user->id)
            ->whereIn('status_pesanan', ['menunggu_pembayaran', 'dibayar', 'diproses', 'dikirim'])
            ->exists();

        if ($hasPendingOrders) {
            return redirect()->route('admin.pelanggan.index')
                ->with('error', 'Tidak dapat menghapus pelanggan yang memiliki pesanan aktif.');
        }

        $user->delete();

        return redirect()->route('admin.pelanggan.index')
            ->with('success', 'Data pelanggan berhasil dihapus.');
    }
}
