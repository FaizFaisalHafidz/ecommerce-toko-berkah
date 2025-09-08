<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display the about page
     */
    public function about(): Response
    {
        return Inertia::render('Customer/About');
    }

    /**
     * Display the contact page
     */
    public function contact(): Response
    {
        return Inertia::render('Customer/Contact');
    }

    /**
     * Display customer profile page
     */
    public function profile(): Response
    {
        return Inertia::render('Customer/Profile');
    }

    /**
     * Display customer orders page
     */
    public function orders(): Response
    {
        return Inertia::render('Customer/Orders');
    }
}
