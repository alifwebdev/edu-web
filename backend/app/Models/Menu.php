<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $fillable = ['title','slug','url','parent_id','order','is_external'];

    public function parent() { return $this->belongsTo(Menu::class,'parent_id'); }
    public function children() { return $this->hasMany(Menu::class,'parent_id'); }
}
