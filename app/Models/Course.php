<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['name', 'code', 'description' ,'is_elective'];

public function majors()
{
    return $this->belongsToMany(Major::class, 'course_major');
}

// App\Models\Course.php
public function semesters()
{
    return $this->belongsToMany(Semester::class, 'course_semesters')
        ->withPivot('is_elective')
        ->withTimestamps();
}
public function courseSemesters()
{
    return $this->hasMany(CourseSemester::class);
}



}
