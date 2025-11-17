<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    protected $fillable = ['title','tagline','banner_path','meta'];
    protected $casts = ['meta' => 'array'];
}
