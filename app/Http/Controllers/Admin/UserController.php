<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Searching
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Role filter
        if ($request->role === 'admin') {
            $query->where('is_admin', true);
        } elseif ($request->role === 'user') {
            $query->where('is_admin', false);
        }

        // Status filter
        if ($request->status === 'active') {
            $query->where('is_banned', false);
        } elseif ($request->status === 'banned') {
            $query->where('is_banned', true);
        }

        // Sorting
        $sortBy = $request->get('sortBy', 'created_at');
        $sortDir = $request->get('sortDir', 'desc');

        if (! in_array($sortBy, ['id', 'name', 'email', 'created_at'])) {
            $sortBy = 'created_at';
        }
        if (! in_array($sortDir, ['asc', 'desc'])) {
            $sortDir = 'desc';
        }

        $users = $query->orderBy($sortBy, $sortDir)->paginate(10)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status', 'sortBy', 'sortDir']),
        ]);
    }



    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    public function toggleAdmin(User $user)
    {
        $user->update(['is_admin' => !$user->is_admin]);

        return redirect()->back()->with('success', 'User role updated.');
    }

    public function toggleBan(User $user)
    {
        $user->update(['is_banned' => !$user->is_banned]);

        return redirect()->back()->with('success', 'User status updated.');
    }
}
