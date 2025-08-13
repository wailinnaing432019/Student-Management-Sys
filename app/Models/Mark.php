<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mark extends Model
{
       protected $fillable = ['student_course_enrollment_id', 'mark', 'grade', 'remark'];

    public function studentCourseEnrollment() {
        return $this->belongsTo(StudentCourseEnrollment::class);
    }
           
}
