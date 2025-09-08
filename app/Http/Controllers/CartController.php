<?php

namespace App\Http\Controllers;

use App\Models\Keranjang;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Display shopping cart
     */
    public function index(Request $request)
    {
        // Get cart from session instead of database
        $cartItems = session('cart', []);
        
        // Convert session cart to proper format
        $formattedCartItems = collect($cartItems)->map(function ($item) {
            $produk = Produk::with('gambarProduk')->find($item['produk_id']);
            return [
                'id' => $item['id'] ?? uniqid(),
                'user_id' => null,
                'produk_id' => $item['produk_id'],
                'jumlah' => $item['jumlah'],
                'harga_saat_ditambah' => $item['harga_saat_ditambah'],
                'warna' => $item['warna'] ?? null,
                'catatan' => $item['catatan'] ?? null,
                'produk' => $produk
            ];
        });

        $subtotal = $formattedCartItems->sum(function ($item) {
            return $item['harga_saat_ditambah'] * $item['jumlah'];
        });
        
        $shipping = $subtotal > 400000 ? 0 : 25000; // Free shipping over 400k
        $total = $subtotal + $shipping;

        $cartData = [
            'cartItems' => $formattedCartItems->values(),
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'total' => $total
        ];

        // Return JSON for AJAX requests
        if ($request->expectsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json($cartData);
        }

        return Inertia::render('Customer/Cart', [
            'cartItems' => $formattedCartItems->values(),
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'total' => $total
        ]);
    }

    /**
     * Add product to cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'produk_id' => 'required|exists:produk,id',
            'jumlah' => 'required|integer|min:1',
            'warna' => 'nullable|string',
            'catatan' => 'nullable|string'
        ]);

        // Get product to get current price
        $produk = Produk::findOrFail($request->produk_id);

        // Get cart from session
        $cart = session('cart', []);

        // Check if product already exists in cart
        $existingKey = null;
        foreach ($cart as $key => $item) {
            if ($item['produk_id'] == $request->produk_id && 
                ($item['warna'] ?? null) == ($request->warna ?? null)) {
                $existingKey = $key;
                break;
            }
        }

        if ($existingKey !== null) {
            // Update quantity if product exists
            $cart[$existingKey]['jumlah'] += $request->jumlah;
        } else {
            // Add new item to cart
            $cart[] = [
                'id' => uniqid(),
                'produk_id' => $request->produk_id,
                'jumlah' => $request->jumlah,
                'harga_saat_ditambah' => $produk->harga,
                'warna' => $request->warna,
                'catatan' => $request->catatan,
            ];
        }

        // Save cart to session
        session(['cart' => $cart]);

        // Return JSON for AJAX requests
        if ($request->expectsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil ditambahkan ke keranjang',
                'cart_count' => collect($cart)->sum('jumlah')
            ]);
        }

        return back()->with('success', 'Produk berhasil ditambahkan ke keranjang');
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'jumlah' => 'required|integer|min:1'
        ]);

        // Get cart from session
        $cart = session('cart', []);

        // Find and update item
        foreach ($cart as $key => $item) {
            if ($item['id'] === $id) {
                $cart[$key]['jumlah'] = $request->jumlah;
                break;
            }
        }

        // Save cart to session
        session(['cart' => $cart]);

        // Return JSON for AJAX requests
        if ($request->expectsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'success' => true,
                'message' => 'Jumlah produk berhasil diperbarui'
            ]);
        }

        return back()->with('success', 'Jumlah produk berhasil diperbarui');
    }

    /**
     * Remove item from cart
     */
    public function destroy(Request $request, $id)
    {
        // Get cart from session
        $cart = session('cart', []);

        // Remove item from cart
        $cart = array_filter($cart, function($item) use ($id) {
            return $item['id'] !== $id;
        });

        // Save cart to session
        session(['cart' => array_values($cart)]);

        // Return JSON for AJAX requests
        if ($request->expectsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil dihapus dari keranjang'
            ]);
        }

        return back()->with('success', 'Produk berhasil dihapus dari keranjang');
    }
}
