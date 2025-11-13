<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Teacher;
use Illuminate\Support\Facades\Storage;

class TeacherController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->only(['store','update','destroy']);
    }

    public function index()
    {
        return Teacher::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $this->authorize('create', Teacher::class);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'profile' => 'nullable|image|max:5120',
            'short_bio' => 'nullable|string'
        ]);

        if ($request->hasFile('profile')) {
            $p = $request->file('profile')->store('public/teachers');
            $data['profile_path'] = Storage::url($p);
        }

        $teacher = Teacher::create($data);
        return response()->json($teacher,201);
    }

    public function show($id)
    {
        return Teacher::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);
        $this->authorize('update', $teacher);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'profile' => 'nullable|image|max:5120',
            'short_bio' => 'nullable|string'
        ]);

        if ($request->hasFile('profile')) {
            $p = $request->file('profile')->store('public/teachers');
            $data['profile_path'] = Storage::url($p);
        }

        $teacher->update($data);
        return response()->json($teacher);
    }

    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        $this->authorize('delete', $teacher);
        $teacher->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
