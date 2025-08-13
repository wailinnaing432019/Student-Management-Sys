<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseSemester extends Model
{
    protected $fillable = ['course_id', 'semester_id','is_elective'];

        public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function major()
{
    return $this->belongsTo(Major::class);
}
}
