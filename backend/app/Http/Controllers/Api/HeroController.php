<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hero;
use Illuminate\Support\Facades\Storage;

class HeroController extends Controller
{
    public function index() {
        return response()->json(Hero::first());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'title'=>'nullable|string',
            'tagline'=>'nullable|string',
            'banner'=>'sometimes|file|image|max:10240'
        ]);
        $hero = Hero::create([]);
        if ($request->hasFile('banner')) {
            $path = $request->file('banner')->store('public/hero');
            $hero->banner_path = Storage::url($path);
        }
        $hero->title = $request->title;
        $hero->tagline = $request->tagline;
        $hero->save();
        return response()->json($hero,201);
    }

    public function update(Request $request, $id = null) {
        $hero = $id ? Hero::findOrFail($id) : Hero::first();
        if (!$hero) $hero = new Hero();
        if ($request->hasFile('banner')) {
            $path = $request->file('banner')->store('public/hero');
            $hero->banner_path = Storage::url($path);
        }
        $hero->title = $request->input('title', $hero->title);
        $hero->tagline = $request->input('tagline', $hero->tagline);
        $hero->save();
        return response()->json($hero);
    }

    public function destroy($id) {
        $hero = Hero::findOrFail($id);
        $hero->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
