<?php

namespace App\Http\Controllers;

use App\Models\Keranjang;
use App\Models\Pesanan;
use App\Models\DetailPesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(Request $request)
    {
        // For direct GET access, redirect to home or show empty cart message
        return Inertia::render('Customer/Checkout', [
            'cartItems' => [],
            'subtotal' => 0,
            'shipping' => 25000,
            'total' => 25000,
            'provinces' => $this->getProvinces(),
            'cities' => $this->getCities(),
            'shippingMethods' => $this->getShippingMethods(),
            'message' => 'Silakan tambahkan produk ke keranjang terlebih dahulu.',
        ]);
    }

    public function view(Request $request)
    {
        // Get cart data from request (localStorage cart)
        $cartDataJson = $request->input('cart');
        $cartData = $cartDataJson ? json_decode($cartDataJson, true) : null;
        
        // If no cart data passed, return with empty cart
        if (!$cartData || empty($cartData['items'])) {
            return Inertia::render('Customer/Checkout', [
                'cartItems' => [],
                'subtotal' => 0,
                'shipping' => 25000,
                'total' => 25000,
                'provinces' => $this->getProvinces(),
                'cities' => $this->getCities(),
                'shippingMethods' => $this->getShippingMethods(),
                'message' => 'Keranjang Anda kosong. Silakan tambahkan produk terlebih dahulu.',
            ]);
        }

        // Process cart items from localStorage
        $cartItems = collect($cartData['items'])->map(function ($item) {
            return [
                'id' => $item['id'],
                'productId' => $item['productId'],
                'name' => $item['name'],
                'price' => $item['price'],
                'image' => $item['image'],
                'quantity' => $item['quantity'],
                'color' => $item['color'] ?? null,
                'slug' => $item['slug'],
            ];
        });

        return Inertia::render('Customer/Checkout', [
            'cartItems' => $cartItems,
            'subtotal' => $cartData['subtotal'] ?? 0,
            'shipping' => $cartData['shipping'] ?? 25000,
            'total' => $cartData['total'] ?? 25000,
            'provinces' => $this->getProvinces(),
            'cities' => $this->getCities(),
            'shippingMethods' => $this->getShippingMethods(),
        ]);
    }

    private function getProvinces()
    {
        return [
            ['id' => 1, 'name' => 'DKI Jakarta'],
            ['id' => 2, 'name' => 'Jawa Barat'],
            ['id' => 3, 'name' => 'Jawa Tengah'],
            ['id' => 4, 'name' => 'Jawa Timur'],
            ['id' => 5, 'name' => 'Bali'],
        ];
    }

    private function getCities()
    {
        return [
            ['id' => 1, 'name' => 'Jakarta Pusat', 'province_id' => 1],
            ['id' => 2, 'name' => 'Jakarta Utara', 'province_id' => 1],
            ['id' => 3, 'name' => 'Jakarta Selatan', 'province_id' => 1],
            ['id' => 4, 'name' => 'Bandung', 'province_id' => 2],
            ['id' => 5, 'name' => 'Bekasi', 'province_id' => 2],
            ['id' => 6, 'name' => 'Semarang', 'province_id' => 3],
            ['id' => 7, 'name' => 'Solo', 'province_id' => 3],
            ['id' => 8, 'name' => 'Surabaya', 'province_id' => 4],
            ['id' => 9, 'name' => 'Malang', 'province_id' => 4],
            ['id' => 10, 'name' => 'Denpasar', 'province_id' => 5],
        ];
    }

    private function getShippingMethods()
    {
        return [
            [
                'id' => 'regular',
                'name' => 'Regular (JNE REG)',
                'cost' => 15000,
                'estimate' => '2-3 hari kerja'
            ],
            [
                'id' => 'express',
                'name' => 'Express (JNE YES)',
                'cost' => 25000,
                'estimate' => '1-2 hari kerja'
            ],
            [
                'id' => 'same_day',
                'name' => 'Same Day',
                'cost' => 35000,
                'estimate' => 'Hari yang sama'
            ],
        ];
    }

    public function store(Request $request)
    {
        // Debug: Log what we receive
        Log::info('Checkout request data:', $request->all());
        
        try {
            $request->validate([
                'nama_penerima' => 'required|string|max:255',
                'telepon_penerima' => 'required|string|max:20',
                'alamat' => 'required|string',
                'kota_id' => 'required',
                'provinsi_id' => 'required',
                'kode_pos' => 'required|string|max:10',
                'catatan_pengiriman' => 'nullable|string',
                'metode_pengiriman' => 'required|string',
                'metode_pembayaran' => 'required|string',
                'biaya_pengiriman' => 'required|numeric|min:0',
                'total_bayar' => 'required|numeric|min:0',
                'cart_items' => 'required|array|min:1', // Cart items from localStorage
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed:', $e->errors());
            // Handle validation errors without redirect
            return Inertia::render('Customer/Checkout', [
                'cartItems' => $request->cart_items ?? [],
                'subtotal' => $request->subtotal ?? 0,
                'shipping' => $request->biaya_pengiriman ?? 25000,
                'total' => $request->total_bayar ?? 25000,
                'provinces' => $this->getProvinces(),
                'cities' => $this->getCities(),
                'shippingMethods' => $this->getShippingMethods(),
                'message' => 'Mohon lengkapi semua field yang diperlukan.',
                'errors' => $e->errors(),
            ]);
        }

        try {
            DB::beginTransaction();

            // Get cart items from request (localStorage)
            $cartItems = collect($request->cart_items);

            if ($cartItems->isEmpty()) {
                throw new \Exception('Keranjang kosong');
            }

            // Calculate subtotal from cart items
            $subtotal = $cartItems->sum(function ($item) {
                return $item['price'] * $item['quantity'];
            });

            // Generate unique order number
            $orderNumber = 'ORD-' . time() . '-' . uniqid();

            // Create order
            $order = Pesanan::create([
                'user_id' => null, // No user authentication required
                'nomor_pesanan' => $orderNumber,
                'nama_customer' => $request->nama_penerima,
                'email_customer' => $request->email_penerima ?? 'guest@example.com', // Default email for guest
                'telepon_customer' => $request->telepon_penerima,
                'alamat_pengiriman' => $request->alamat,
                'kota' => $request->kota_id,
                'provinsi' => $request->provinsi_id,
                'kode_pos' => $request->kode_pos,
                'catatan_pengiriman' => $request->catatan_pengiriman,
                'kurir' => $request->metode_pengiriman,
                'ongkos_kirim' => $request->biaya_pengiriman,
                'metode_pembayaran' => $request->metode_pembayaran,
                'subtotal' => $subtotal,
                'total_akhir' => $request->total_bayar,
            ]);

            // Create order details
            foreach ($cartItems as $item) {
                DetailPesanan::create([
                    'pesanan_id' => $order->id,
                    'produk_id' => $item['productId'],
                    'nama_produk' => $item['name'],
                    'sku_produk' => $item['slug'], // Using slug as SKU since no SKU field in cart
                    'harga_satuan' => $item['price'],
                    'jumlah' => $item['quantity'],
                    'subtotal' => $item['price'] * $item['quantity'],
                    'gambar_produk' => $item['image'] ?? null,
                    'spesifikasi_produk' => json_encode([
                        'color' => $item['color'] ?? null
                    ]),
                ]);
            }

            // No need to clear cart since it's localStorage based
            // Cart will be cleared on frontend after successful order

            DB::commit();

            return redirect()->route('checkout.success')->with([
                'order_id' => $order->id,
                'order_number' => $order->nomor_pesanan,
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            
            // Return Inertia response instead of redirect to avoid route issues
            return Inertia::render('Customer/Checkout', [
                'cartItems' => [],
                'subtotal' => 0,
                'shipping' => 25000,
                'total' => 25000,
                'provinces' => $this->getProvinces(),
                'cities' => $this->getCities(),
                'shippingMethods' => $this->getShippingMethods(),
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
                'errors' => ['error' => 'Terjadi kesalahan: ' . $e->getMessage()],
            ]);
        }
    }

    public function success(Request $request)
    {
        Log::info('Success page accessed', [
            'session_order_id' => session('order_id'),
            'session_order_number' => session('order_number'),
            'all_session' => session()->all()
        ]);
        
        $orderId = session('order_id');
        $orderNumber = session('order_number');
        
        // If order details not in session, redirect to home
        if (!$orderId || !$orderNumber) {
            Log::warning('Order details not found in session, redirecting to home');
            return redirect()->route('home')->with('error', 'Pesanan tidak ditemukan');
        }

        $order = Pesanan::with(['detailPesanan'])->find($orderId);
        
        if (!$order) {
            Log::warning('Order not found in database', ['order_id' => $orderId]);
            return redirect()->route('home')->with('error', 'Pesanan tidak ditemukan');
        }

        Log::info('Success page rendering', ['order_number' => $orderNumber]);

        return Inertia::render('Customer/CheckoutSuccess', [
            'order' => $order,
            'orderDetails' => $order->detailPesanan,
            'orderNumber' => $orderNumber,
            'redirectUrl' => route('track.order') . '?order_id=' . $orderNumber
        ]);
    }

    /**
     * Show order tracking page
     */
    public function trackOrder()
    {
        return Inertia::render('Customer/TrackOrder');
    }

    /**
     * Get order details by order number for tracking
     */
    public function getOrderDetails(Request $request)
    {
        $request->validate([
            'order_number' => 'required|string'
        ]);

        $order = Pesanan::with(['detailPesanan'])
            ->where('nomor_pesanan', $request->order_number)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }

    /**
     * Track order via API (GET request)
     */
    public function trackOrderApi($orderNumber)
    {
        $order = Pesanan::with(['detailPesanan.produk.gambarProduk', 'user'])
            ->where('nomor_pesanan', $orderNumber)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan'
            ], 404);
        }

        // Format order data for frontend
        $formattedOrder = [
            'id' => $order->id,
            'nomor_pesanan' => $order->nomor_pesanan,
            'nama_penerima' => $order->nama_customer,
            'alamat_lengkap' => $order->alamat_pengiriman,
            'kota' => $order->kota,
            'provinsi' => $order->provinsi,
            'kode_pos' => $order->kode_pos,
            'no_telepon' => $order->telepon_customer,
            'email' => $order->email_customer,
            'metode_pembayaran' => $order->metode_pembayaran ?? 'Belum dipilih',
            'status_pesanan' => $order->status_pesanan ?? 'pending',
            'status_pembayaran' => $order->status_pembayaran ?? 'pending',
            'total_harga' => $order->total_akhir,
            'ongkos_kirim' => $order->ongkos_kirim,
            'created_at' => $order->created_at->toISOString(),
            'detailPesanan' => $order->detailPesanan->map(function ($detail) use ($order) {
                // Cek apakah ada ulasan untuk produk ini di pesanan ini
                $existingReview = \App\Models\UlasanProduk::where('produk_id', $detail->produk->id)
                    ->where('pesanan_id', $order->id)
                    ->first();

                return [
                    'id' => $detail->id,
                    'produk' => [
                        'id' => $detail->produk->id,
                        'nama' => $detail->produk->nama_produk,
                        'harga' => $detail->produk->harga,
                        'gambarProduk' => $detail->produk->gambarProduk->map(function ($gambar) {
                            return [
                                'url' => '/storage/' . $gambar->path_gambar,
                            ];
                        })->toArray(),
                    ],
                    'jumlah' => $detail->jumlah,
                    'harga_saat_beli' => $detail->harga_satuan,
                    'ulasan' => $existingReview ? [
                        'id' => $existingReview->id,
                        'rating' => $existingReview->rating,
                        'isi_ulasan' => $existingReview->isi_ulasan,
                        'nama_customer' => $existingReview->nama_customer,
                        'disetujui' => $existingReview->disetujui,
                        'created_at' => $existingReview->created_at->format('d M Y'),
                    ] : null,
                ];
            }),
        ];

        return response()->json([
            'success' => true,
            'data' => $formattedOrder
        ]);
    }
}
