<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    protected $table = 'hero';

    protected $fillable = [
        'title',
        'tagline',
        'banner_path',
        'extra'
    ];

    protected $casts = [
        'extra' => 'array'
    ];
}
