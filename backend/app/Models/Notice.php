<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    protected $fillable = [
        'title',
        'body',
        'publish_date',
        'expire_date',
        'is_published',
        'attachment_path'
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'publish_date' => 'date',
        'expire_date' => 'date'
    ];
}
