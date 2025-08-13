<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentCourseEnrollment extends Model
{
    protected $fillable = ['student_enrollment_id', 'course_id'];

    public function studentEnrollment() {
        return $this->belongsTo(StudentEnrollment::class);
    }

    public function course() {
        return $this->belongsTo(Course::class);
    }
    

    public function mark() {
        return $this->hasOne(Mark::class);
    }

    
}
