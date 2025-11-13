<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = [
        'title',
        'description',
        'duration',
        'fees',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'fees' => 'decimal:2'
    ];
}
