<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\About;
use Illuminate\Support\Facades\Storage;

class AboutController extends Controller
{
    public function index() { return response()->json(About::first()); }

    public function store(Request $request) {
        $data = $request->validate([
            'mission'=>'nullable|string',
            'vision'=>'nullable|string',
            'history'=>'nullable|string',
            'images.*'=>'sometimes|file|image|max:10240'
        ]);
        $about = About::create($request->only(['mission','vision','history']));
        if ($request->hasFile('images')) {
            $paths = [];
            foreach ($request->file('images') as $f) {
                $p = $f->store('public/about');
                $paths[] = Storage::url($p);
            }
            $about->images = $paths;
            $about->save();
        }
        return response()->json($about,201);
    }

    public function update(Request $request, $id) {
        $about = About::findOrFail($id);
        $about->update($request->only(['mission','vision','history']));
        if ($request->hasFile('images')) {
            $existing = $about->images ?? [];
            foreach ($request->file('images') as $f) {
                $p = $f->store('public/about');
                $existing[] = Storage::url($p);
            }
            $about->images = $existing;
            $about->save();
        }
        return response()->json($about);
    }

    public function destroy($id) {
        $about = About::findOrFail($id);
        $about->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
