<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\LaporanController;
use App\Http\Controllers\Admin\FeedbackController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Customer routes (no authentication required)
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/about', [CustomerController::class, 'about'])->name('customer.about');
Route::get('/contact', [CustomerController::class, 'contact'])->name('customer.contact');

// Cart routes (session-based, no authentication)
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::put('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');

// Checkout routes (no authentication required)
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::post('/checkout/view', [CheckoutController::class, 'view'])->name('checkout.view'); // For localStorage cart data
Route::get('/checkout/view', function() {
    return redirect()->route('checkout.index');
})->name('checkout.view.fallback'); // Fallback for GET requests
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');

// Order tracking routes (no authentication required)
Route::get('/track-order', [CheckoutController::class, 'trackOrder'])->name('track.order');
Route::post('/track-order', [CheckoutController::class, 'getOrderDetails'])->name('track.order.details');

// Homepage for admin/dashboard
// Route::get('/home', [HomeController::class, 'index'])->name('home');

// Dashboard route (required after login)
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Admin routes (require authentication only)
Route::middleware(['auth'])->group(function () {
    // Admin Kategori Routes
    Route::prefix('admin/kategori')->name('admin.kategori.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\KategoriController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\Admin\KategoriController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\Admin\KategoriController::class, 'store'])->name('store');
        Route::get('/{kategori}', [App\Http\Controllers\Admin\KategoriController::class, 'show'])->name('show');
        Route::get('/{kategori}/edit', [App\Http\Controllers\Admin\KategoriController::class, 'edit'])->name('edit');
        Route::put('/{kategori}', [App\Http\Controllers\Admin\KategoriController::class, 'update'])->name('update');
        Route::delete('/{kategori}', [App\Http\Controllers\Admin\KategoriController::class, 'destroy'])->name('destroy');
        Route::patch('/{kategori}/toggle-status', [App\Http\Controllers\Admin\KategoriController::class, 'toggleStatus'])->name('toggle-status');
    });

    // Admin Produk Routes
    Route::prefix('admin/produk')->name('admin.produk.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\ProdukController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\Admin\ProdukController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\Admin\ProdukController::class, 'store'])->name('store');
        Route::get('/{produk}', [App\Http\Controllers\Admin\ProdukController::class, 'show'])->name('show');
        Route::get('/{produk}/edit', [App\Http\Controllers\Admin\ProdukController::class, 'edit'])->name('edit');
        Route::put('/{produk}', [App\Http\Controllers\Admin\ProdukController::class, 'update'])->name('update');
        Route::delete('/{produk}', [App\Http\Controllers\Admin\ProdukController::class, 'destroy'])->name('destroy');
        Route::patch('/{produk}/toggle-status', [App\Http\Controllers\Admin\ProdukController::class, 'toggleStatus'])->name('toggle-status');
        Route::patch('/{produk}/toggle-featured', [App\Http\Controllers\Admin\ProdukController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::delete('/{produk}/gambar/{gambar}', [App\Http\Controllers\Admin\ProdukController::class, 'deleteImage'])->name('delete-image');
    });

    // Admin Pelanggan Routes
    Route::prefix('admin/pelanggan')->name('admin.pelanggan.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\PelangganController::class, 'index'])->name('index');
        Route::get('/{email}', [App\Http\Controllers\Admin\PelangganController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [App\Http\Controllers\Admin\PelangganController::class, 'edit'])->name('edit');
        Route::put('/{id}', [App\Http\Controllers\Admin\PelangganController::class, 'update'])->name('update');
    });

    // Admin Pesanan Routes
    Route::prefix('admin/pesanan')->name('admin.pesanan.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\PesananController::class, 'index'])->name('index');
        Route::get('/export', [App\Http\Controllers\Admin\PesananController::class, 'export'])->name('export');
        Route::get('/{pesanan}', [App\Http\Controllers\Admin\PesananController::class, 'show'])->name('show');
        Route::get('/{pesanan}/invoice', [App\Http\Controllers\Admin\PesananController::class, 'printInvoice'])->name('invoice');
        Route::patch('/{pesanan}/status', [App\Http\Controllers\Admin\PesananController::class, 'updateStatus'])->name('update-status');
        Route::patch('/{pesanan}/payment-status', [App\Http\Controllers\Admin\PesananController::class, 'updatePaymentStatus'])->name('update-payment-status');
        Route::delete('/{pesanan}', [App\Http\Controllers\Admin\PesananController::class, 'destroy'])->name('destroy');
    });

    // Admin Laporan Routes
    Route::prefix('admin/laporan')->name('admin.laporan.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\LaporanController::class, 'index'])->name('index');
        Route::post('/penjualan', [App\Http\Controllers\Admin\LaporanController::class, 'penjualan'])->name('penjualan');
        Route::get('/stok', [App\Http\Controllers\Admin\LaporanController::class, 'stok'])->name('stok');
        Route::get('/customer', [App\Http\Controllers\Admin\LaporanController::class, 'customer'])->name('customer');
    });

    // Admin Feedback Routes
    Route::prefix('admin/feedback')->name('admin.feedback.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\FeedbackController::class, 'index'])->name('index');
        Route::get('/analytics', [App\Http\Controllers\Admin\FeedbackController::class, 'analytics'])->name('analytics');
        Route::get('/{feedback}', [App\Http\Controllers\Admin\FeedbackController::class, 'show'])->name('show');
        Route::patch('/{feedback}/status', [App\Http\Controllers\Admin\FeedbackController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{feedback}', [App\Http\Controllers\Admin\FeedbackController::class, 'destroy'])->name('destroy');
        Route::post('/bulk-action', [App\Http\Controllers\Admin\FeedbackController::class, 'bulkAction'])->name('bulk-action');
    });

    // Orders management
    // Route::prefix('orders')->name('orders.')->group(function () {
    //     Route::get('/', [OrderController::class, 'index'])->name('index');
    //     Route::get('/{id}', [OrderController::class, 'show'])->name('show');
    //     Route::put('/{id}/status', [OrderController::class, 'updateStatus'])->name('update.status');
    // });
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
