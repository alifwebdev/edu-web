<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;

class SettingsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->only(['store']);
    }

    public function index()
    {
        $settings = Setting::all()->pluck('value','key')->toArray();
        return response()->json($settings);
    }

    public function store(Request $request)
    {
        $this->authorize('update', Setting::class);

        $data = $request->validate([
            'settings' => 'required|array'
        ]);

        foreach ($data['settings'] as $k => $v) {
            Setting::updateOrCreate(['key' => $k], ['value' => is_array($v) ? json_encode($v) : $v]);
        }

        return response()->json(['message'=>'Settings saved']);
    }
}
