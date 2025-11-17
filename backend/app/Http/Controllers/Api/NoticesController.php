<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notice;
use Illuminate\Support\Facades\Storage;

class NoticesController extends Controller
{
    public function index() {
        return response()->json(Notice::orderBy('created_at','desc')->get());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'title'=>'required|string',
            'description'=>'nullable|string',
            'publish_date'=>'nullable|date',
            'attachment'=>'sometimes|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:20480'
        ]);
        $notice = new Notice($request->only(['title','description','publish_date']));
        if ($request->hasFile('attachment')) {
            $p = $request->file('attachment')->store('public/notices');
            $notice->attachment_path = Storage::url($p);
        }
        $notice->save();
        return response()->json($notice,201);
    }

    public function show($id) { return response()->json(Notice::findOrFail($id)); }

    public function update(Request $request, $id) {
        $notice = Notice::findOrFail($id);
        $notice->update($request->only(['title','description','publish_date']));
        if ($request->hasFile('attachment')) {
            $p = $request->file('attachment')->store('public/notices');
            $notice->attachment_path = Storage::url($p);
        }
        return response()->json($notice);
    }

    public function destroy($id) { Notice::findOrFail($id)->delete(); return response()->json(['message'=>'Deleted']); }
}
