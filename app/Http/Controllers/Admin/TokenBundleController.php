<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TokenBundle;
use Illuminate\Http\Request;

class TokenBundleController extends Controller
{
    public function index()
    {
        $bundles = TokenBundle::paginate(20);

        return inertia('Admin/TokenBundles/Index', [
            'bundles' => $bundles
        ]);
    }

    public function create()
    {
        return inertia('Admin/TokenBundles/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'tokens' => 'required|integer|min:1',
            'price_cents' => 'required|integer|min:1',
            'is_active' => 'boolean'
        ]);

        TokenBundle::create($data);

        return redirect()->route('admin.token-bundles.index')
            ->with('success', 'Token bundle created successfully.');
    }

    public function edit(TokenBundle $tokenBundle)
    {
        return inertia('Admin/TokenBundles/Edit', [
            'bundle' => $tokenBundle
        ]);
    }

    public function update(Request $request, TokenBundle $tokenBundle)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'tokens' => 'required|integer|min:1',
            'price_cents' => 'required|integer|min:1',
            'is_active' => 'boolean'
        ]);

        $tokenBundle->update($data);

        return redirect()->route('admin.token-bundles.index')
            ->with('success', 'Token bundle updated successfully.');
    }

    public function destroy(TokenBundle $tokenBundle)
    {
        $tokenBundle->delete();

        return back()->with('success', 'Token bundle deleted successfully.');
    }
}
