<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except'=>['login','register']]);
    }

    public function register(Request $request)
    {
        $request->validate(['name'=>'required','email'=>'required|email|unique:users','password'=>'required|confirmed|min:6']);
        $user = User::create([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>$request->password, // auto hashed by model
            'role'=>'editor'
        ]);
        $token = Auth::login($user);
        return $this->respondWithToken($token,$user);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email','password');
        if (!$token = Auth::attempt($credentials)) {
            return response()->json(['error'=>'Invalid credentials'], 401);
        }
        return $this->respondWithToken($token, Auth::user());
    }

    public function me() { return response()->json(Auth::user()); }

    public function logout() { Auth::logout(); return response()->json(['message'=>'Logged out']); }

    public function refresh() { return $this->respondWithToken(Auth::refresh(), Auth::user()); }

    protected function respondWithToken($token, $user) {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60,
            'user' => $user
        ]);
    }
}
