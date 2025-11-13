<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notice;
use Illuminate\Support\Facades\Storage;

class NoticesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->only(['store','update','destroy']);
    }

    public function index()
    {
        return Notice::orderBy('publish_date','desc')->get();
    }

    public function store(Request $request)
    {
        $this->authorize('create', Notice::class);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'nullable|string',
            'publish_date' => 'nullable|date',
            'expire_date' => 'nullable|date',
            'is_published' => 'nullable|boolean',
            'attachment' => 'nullable|file|max:10240'
        ]);

        if ($request->hasFile('attachment')) {
            $p = $request->file('attachment')->store('public/notices');
            $data['attachment_path'] = Storage::url($p);
        }

        $notice = Notice::create($data);
        return response()->json($notice,201);
    }

    public function show($id)
    {
        return Notice::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $notice = Notice::findOrFail($id);
        $this->authorize('update', $notice);

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'body' => 'nullable|string',
            'publish_date' => 'nullable|date',
            'expire_date' => 'nullable|date',
            'is_published' => 'nullable|boolean',
            'attachment' => 'nullable|file|max:10240'
        ]);

        if ($request->hasFile('attachment')) {
            $p = $request->file('attachment')->store('public/notices');
            $data['attachment_path'] = Storage::url($p);
        }

        $notice->update($data);
        return response()->json($notice);
    }

    public function destroy($id)
    {
        $notice = Notice::findOrFail($id);
        $this->authorize('delete', $notice);
        $notice->delete();
        return response()->json(['message'=>'Deleted']);
    }
}
