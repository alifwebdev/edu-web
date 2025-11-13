<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Menu;

class MenuController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->only(['store','update','destroy']);
    }

    public function index()
    {
        return Menu::whereNull('parent_id')->with('children')->orderBy('order')->get();
    }

    public function store(Request $request)
    {
        // $this->authorize('create', Menu::class);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'url' => 'nullable|string|max:500',
            'parent_id' => 'nullable|exists:menus,id',
            'order' => 'nullable|integer',
            'is_external' => 'nullable|boolean'
        ]);

        $menu = Menu::create($data);
        return response()->json($menu,201);
    }

    public function show($id)
    {
        return Menu::with('children')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $menu = Menu::findOrFail($id);
        $this->authorize('update', $menu);

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'url' => 'nullable|string|max:500',
            'parent_id' => 'nullable|exists:menus,id',
            'order' => 'nullable|integer',
            'is_external' => 'nullable|boolean'
        ]);

        $menu->update($data);
        return response()->json($menu);
    }

    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);
        $this->authorize('delete', $menu);
        $menu->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
