<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Program;

class ProgramController extends Controller
{
    public function index() { return response()->json(Program::all()); }
    public function store(Request $request) {
        $data = $request->validate(['title'=>'required','description'=>'nullable','duration'=>'nullable','fees'=>'nullable|numeric']);
        $program = Program::create($data);
        return response()->json($program,201);
    }
    public function show($id) { return response()->json(Program::findOrFail($id)); }
    public function update(Request $request, $id) {
        $p = Program::findOrFail($id);
        $p->update($request->only(['title','description','duration','fees']));
        return response()->json($p);
    }
    public function destroy($id) { Program::findOrFail($id)->delete(); return response()->json(['message'=>'Deleted']); }
}
