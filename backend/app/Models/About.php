<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class About extends Model
{
    protected $fillable = ['mission','vision','history','images'];
    protected $casts = ['images' => 'array'];
}
