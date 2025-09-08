<?php

use App\Http# Customer routes (no authentication required)
Route::get('/', [CustomerController::class, 'index'])->name('customer.home');
Route::get('/products', [CustomerController::class, 'products'])->name('customer.products');
Route::get('/products/{slug}', [CustomerController::class, 'productDetail'])->name('customer.product.detail');
Route::get('/about', [CustomerController::class, 'about'])->name('customer.about');
Route::get('/contact', [CustomerController::class, 'contact'])->name('customer.contact');

# Cart routes (session-based, no authentication)
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::put('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');

# Checkout routes (no authentication required)
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');

# Order tracking routes (no authentication required)
Route::get('/track-order', [CheckoutController::class, 'trackOrder'])->name('track.order');
Route::post('/track-order', [CheckoutController::class, 'getOrderDetails'])->name('track.order.details');llers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Homepage
Route::get('/', [HomeController::class, 'index'])->name('home');

// Product routes
Route::prefix('products')->name('products.')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('index');
    Route::get('/search', [ProductController::class, 'search'])->name('search');
    Route::get('/{slug}', [ProductController::class, 'show'])->name('show');
});

// Cart routes (no auth required)
Route::prefix('cart')->name('cart.')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('index');
    Route::post('/', [CartController::class, 'store'])->name('store');
    Route::put('/{id}', [CartController::class, 'update'])->name('update');
    Route::delete('/{id}', [CartController::class, 'destroy'])->name('destroy');
});

// Checkout routes (no auth required)
Route::prefix('checkout')->name('checkout.')->group(function () {
    Route::get('/', [CheckoutController::class, 'index'])->name('index');
    Route::post('/', [CheckoutController::class, 'store'])->name('store');
    Route::get('/success', [CheckoutController::class, 'success'])->name('success');
});

// Order tracking (no auth required)
Route::get('/track-order', [CheckoutController::class, 'trackOrder'])->name('track.order');
Route::post('/track-order', [CheckoutController::class, 'trackOrderResult'])->name('track.order.result');

// Admin only routes
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
