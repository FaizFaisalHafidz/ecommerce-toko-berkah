<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        // Get dashboard statistics
        $totalOrders = Pesanan::count();
        $totalProducts = Produk::count();
        $totalUsers = User::count();
        
        // Get recent orders with customer information
        $recentOrders = Pesanan::latest()
            ->take(10)
            ->get()
            ->map(function ($pesanan) {
                return [
                    'id' => $pesanan->id,
                    'nomor_pesanan' => $pesanan->nomor_pesanan,
                    'status_pesanan' => $pesanan->status_pesanan,
                    'total_akhir' => $pesanan->total_akhir,
                    'nama_customer' => $pesanan->nama_penerima ?? 'Guest Customer',
                    'created_at' => $pesanan->created_at->toISOString(),
                ];
            });

        // Calculate total revenue
        $totalRevenue = Pesanan::where('status_pesanan', 'selesai')->sum('total_akhir');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalOrders' => $totalOrders,
                'totalProducts' => $totalProducts,
                'totalUsers' => $totalUsers,
                'totalRevenue' => $totalRevenue,
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}
