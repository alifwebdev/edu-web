<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Gallery;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function index() { return response()->json(Gallery::orderBy('id','desc')->get()); }

    public function store(Request $request) {
        $data = $request->validate([
            'title'=>'nullable|string',
            'image'=>'required|image|max:20480',
            'alt'=>'nullable|string'
        ]);
        $path = $request->file('image')->store('public/gallery');
        $gallery = Gallery::create([
            'title'=>$request->title,
            'image_path'=>Storage::url($path),
            'alt'=>$request->alt
        ]);
        return response()->json($gallery,201);
    }

    public function show($id) { return response()->json(Gallery::findOrFail($id)); }

    public function update(Request $request, $id) {
        $g = Gallery::findOrFail($id);
        if ($request->hasFile('image')) {
            $p = $request->file('image')->store('public/gallery');
            $g->image_path = Storage::url($p);
        }
        $g->title = $request->input('title', $g->title);
        $g->alt = $request->input('alt', $g->alt);
        $g->save();
        return response()->json($g);
    }

    public function destroy($id) { Gallery::findOrFail($id)->delete(); return response()->json(['message'=>'Deleted']); }
}
