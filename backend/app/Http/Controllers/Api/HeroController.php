<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hero;
use Illuminate\Support\Facades\Storage;

class HeroController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->only(['store','update','destroy']);
    }

    public function index()
    {
        return Hero::latest()->first() ?? response()->json(null,204);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Hero::class);

        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:500',
            'banner' => 'nullable|image|max:5120',
            'extra' => 'nullable|array'
        ]);

        if ($request->hasFile('banner')) {
            $path = $request->file('banner')->store('public/hero');
            $data['banner_path'] = Storage::url($path);
        }

        if (isset($data['extra'])) $data['extra'] = json_encode($data['extra']);

        $hero = Hero::create($data);
        return response()->json($hero,201);
    }

    public function update(Request $request, $id = null)
    {
        // allow update by id or update latest
        $hero = $id ? Hero::findOrFail($id) : Hero::latest()->firstOrFail();
        $this->authorize('update', $hero);

        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:500',
            'banner' => 'nullable|image|max:5120',
            'extra' => 'nullable|array'
        ]);

        if ($request->hasFile('banner')) {
            $path = $request->file('banner')->store('public/hero');
            $data['banner_path'] = Storage::url($path);
        }

        if (isset($data['extra'])) $data['extra'] = json_encode($data['extra']);

        $hero->update($data);
        return response()->json($hero);
    }

    public function destroy($id)
    {
        $hero = Hero::findOrFail($id);
        $this->authorize('delete', $hero);
        $hero->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
