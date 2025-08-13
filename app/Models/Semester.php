<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    protected $fillable = ['academic_year_id', 'year_name',  'semester_number','start_date', 'end_date'];


    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

public function courses()
{
    return $this->belongsToMany(Course::class, 'course_semesters')
        ->withPivot('is_elective') 
        ->withTimestamps();
}

public function courseSemesters()
{
    return $this->hasMany(CourseSemester::class);
}

// public function coursesByMajor($majorId)
// {
//     return $this->courses()->wherePivot('major_id', $majorId);
// }
}
