<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donor extends Model
{
       protected $fillable=[
        'student_semester_profile_id',
        'name',
        'relationship',
        'job',
        'address',
        'phone',
        'status',
        // 'student_id',
    ];

        public function studentSemesterProfile(){
        return $this->belongsTo(StudentSemesterProfile::class);
    }
}
