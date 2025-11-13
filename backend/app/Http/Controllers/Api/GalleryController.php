<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Gallery;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->only(['store','update','destroy']);
    }

    public function index()
    {
        return Gallery::orderBy('created_at','desc')->get();
    }

    public function store(Request $request)
    {
        $this->authorize('create', Gallery::class);

        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'required|image|max:5120',
            'alt' => 'nullable|string|max:255'
        ]);

        $p = $request->file('image')->store('public/gallery');
        $data['image_path'] = Storage::url($p);
        $data['uploaded_by'] = auth('api')->id() ?? null;

        $gallery = Gallery::create($data);
        return response()->json($gallery,201);
    }

    public function show($id)
    {
        return Gallery::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $gallery = Gallery::findOrFail($id);
        $this->authorize('update', $gallery);

        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'alt' => 'nullable|string|max:255'
        ]);

        if ($request->hasFile('image')) {
            $p = $request->file('image')->store('public/gallery');
            $data['image_path'] = Storage::url($p);
        }

        $gallery->update($data);
        return response()->json($gallery);
    }

    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);
        $this->authorize('delete', $gallery);
        $gallery->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
