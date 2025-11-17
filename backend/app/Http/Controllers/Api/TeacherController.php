<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Teacher;
use Illuminate\Support\Facades\Storage;

class TeacherController extends Controller
{
    public function index() { return response()->json(Teacher::all()); }

    public function store(Request $request) {
        $data = $request->validate([
            'name'=>'required|string',
            'designation'=>'nullable|string',
            'phone'=>'nullable|string',
            'email'=>'nullable|email',
            'profile'=>'sometimes|image|max:10240',
            'short_bio'=>'nullable|string'
        ]);
        $t = new Teacher($request->only(['name','designation','phone','email','short_bio']));
        if ($request->hasFile('profile')) {
            $p = $request->file('profile')->store('public/teachers');
            $t->profile_path = Storage::url($p);
        }
        $t->save();
        return response()->json($t,201);
    }

    public function show($id) { return response()->json(Teacher::findOrFail($id)); }

    public function update(Request $request, $id) {
        $t = Teacher::findOrFail($id);
        $t->fill($request->only(['name','designation','phone','email','short_bio']));
        if ($request->hasFile('profile')) {
            $p = $request->file('profile')->store('public/teachers');
            $t->profile_path = Storage::url($p);
        }
        $t->save();
        return response()->json($t);
    }

    public function destroy($id) { Teacher::findOrFail($id)->delete(); return response()->json(['message'=>'Deleted']); }
}
