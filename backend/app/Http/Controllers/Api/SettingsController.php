<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;

class SettingsController extends Controller
{
    public function index() {
        $settings = Setting::all()->pluck('value','key')->toArray();
        return response()->json($settings);
    }

    public function store(Request $request) {
        // expects { settings: { key1: val1, key2: val2 } } OR direct keys
        $payload = $request->input('settings', $request->all());
        if (isset($payload['settings'])) $payload = $payload['settings'];
        foreach ($payload as $k => $v) {
            Setting::updateOrCreate(['key'=>$k], ['value'=>is_array($v)? json_encode($v): $v]);
        }
        return response()->json(['message'=>'Settings saved']);
    }
}
