<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentEnrollment extends Model
{
    protected $fillable = ['student_id','student_semester_profile_id', 'semester_id', 'major_id', 'academic_year_id','registration_date','status','pdf_path'];


    public function student(){

        return $this->belongsTo(Student::class);
    }

    public function studentSemesterProfile(){
        return $this->belongsTo(StudentSemesterProfile::class);
    }
    public function semester(){
        return $this->belongsTo(Semester::class);
    }
    public function major(){
        return $this->belongsTo(Major::class);
    }
    public function academicYear(){
        return $this->belongsTo(AcademicYear::class);
    }

 
    public function studentCourses(){
        return $this->hasMany(StudentCourseEnrollment::class);
    }

}
