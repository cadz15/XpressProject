<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SiteController extends Controller
{
    //

    public function index()
    {
        return Inertia::render('Welcome');
    }
    public function privacy()
    {
        return Inertia::render('Policy');
    }
    public function terms()
    {
        return Inertia::render('Terms');
    }
    public function disclaimer()
    {
        return Inertia::render('Disclaimer');
    }
}
