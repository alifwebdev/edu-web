<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Menu;

class MenuController extends Controller
{
    public function index() {
        return response()->json(Menu::with('children')->orderBy('order')->get());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'title'=>'required|string',
            'slug'=>'nullable|string',
            'url'=>'nullable|string',
            'parent_id'=>'nullable|exists:menus,id',
            'order'=>'nullable|integer',
            'is_external'=>'nullable|boolean'
        ]);
        $menu = Menu::create($data);
        return response()->json($menu,201);
    }

    public function update(Request $request, $id) {
        $menu = Menu::findOrFail($id);
        $data = $request->validate([
            'title'=>'sometimes|string',
            'slug'=>'sometimes|nullable|string',
            'url'=>'sometimes|nullable|string',
            'parent_id'=>'nullable|exists:menus,id',
            'order'=>'nullable|integer',
            'is_external'=>'nullable|boolean'
        ]);
        $menu->update($data);
        return response()->json($menu);
    }

    public function destroy($id) {
        $menu = Menu::findOrFail($id);
        $menu->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
