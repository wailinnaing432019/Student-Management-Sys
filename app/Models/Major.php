<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    protected $fillable = ['name', 'description'];

    public function courses()
{
    return $this->belongsToMany(Course::class, 'course_major');
}
}
