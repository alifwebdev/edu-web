<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\About;
use Illuminate\Support\Facades\Storage;

class AboutController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->only(['store','update','destroy']);
    }

    public function index()
    {
        return About::latest()->first() ?? response()->json(null,204);
    }

    public function store(Request $request)
    {
        $this->authorize('create', About::class);

        $data = $request->validate([
            'mission' => 'nullable|string',
            'vision' => 'nullable|string',
            'history' => 'nullable|string',
            'images.*' => 'nullable|image|max:5120'
        ]);

        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $p = $file->store('public/about');
                $images[] = Storage::url($p);
            }
        }

        $data['images'] = $images;
        $about = About::create($data);
        return response()->json($about,201);
    }

    public function update(Request $request, $id)
    {
        $about = About::findOrFail($id);
        $this->authorize('update', $about);

        $data = $request->validate([
            'mission' => 'nullable|string',
            'vision' => 'nullable|string',
            'history' => 'nullable|string',
            'images.*' => 'nullable|image|max:5120',
            'images_remove' => 'nullable|array'
        ]);

        $images = $about->images ?: [];

        if ($request->has('images_remove')) {
            $toRemove = $request->input('images_remove');
            $images = array_values(array_filter($images, function ($i) use ($toRemove) {
                return !in_array($i, $toRemove);
            }));
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $p = $file->store('public/about');
                $images[] = Storage::url($p);
            }
        }

        $data['images'] = $images;
        $about->update($data);

        return response()->json($about);
    }

    public function destroy($id)
    {
        $about = About::findOrFail($id);
        $this->authorize('delete', $about);
        $about->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
