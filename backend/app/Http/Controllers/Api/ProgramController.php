<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Program;

class ProgramController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->only(['store','update','destroy']);
    }

    public function index()
    {
        return Program::orderBy('title')->get();
    }

    public function store(Request $request)
    {
        $this->authorize('create', Program::class);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'nullable|string|max:255',
            'fees' => 'nullable|numeric',
            'is_active' => 'nullable|boolean'
        ]);

        $program = Program::create($data);
        return response()->json($program,201);
    }

    public function show($id)
    {
        return Program::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $program = Program::findOrFail($id);
        $this->authorize('update', $program);

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'nullable|string|max:255',
            'fees' => 'nullable|numeric',
            'is_active' => 'nullable|boolean'
        ]);

        $program->update($data);
        return response()->json($program);
    }

    public function destroy($id)
    {
        $program = Program::findOrFail($id);
        $this->authorize('delete', $program);
        $program->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
