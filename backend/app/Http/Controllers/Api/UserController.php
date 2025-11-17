<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index() {
        return response()->json(User::all());
    }

    public function show($id) {
        return response()->json(User::findOrFail($id));
    }

    public function store(Request $request) {
        // admin-only enforced by route middleware
        $data = $request->validate([
            'name'=>'required|string',
            'email'=>'required|email|unique:users',
            'password'=>'required|min:6',
            'role'=>'required|in:admin,editor'
        ]);
        $user = User::create($data);
        return response()->json($user, 201);
    }

    public function update(Request $request, $id) {
        $user = User::findOrFail($id);
        $data = $request->validate([
            'name'=>'sometimes|string',
            'email'=>'sometimes|email|unique:users,email,'.$user->id,
            'password'=>'sometimes|nullable|min:6',
            'role'=>'sometimes|in:admin,editor'
        ]);
        if (isset($data['password'])) $user->password = $data['password']; // model hashes it
        if (isset($data['name'])) $user->name = $data['name'];
        if (isset($data['email'])) $user->email = $data['email'];
        if (isset($data['role'])) $user->role = $data['role'];
        $user->save();
        return response()->json($user);
    }

    public function destroy($id) {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message'=>'Deleted']);
    }

    public function assignRole(Request $request, $id) {
        $request->validate(['role'=>'required|in:admin,editor']);
        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();
        return response()->json($user);
    }

    public function removeRole(Request $request, $id) {
        $user = User::findOrFail($id);
        $user->role = 'editor';
        $user->save();
        return response()->json($user);
    }
}
