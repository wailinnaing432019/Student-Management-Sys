<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistrationAgreement extends Model
{
    protected $fillable=[
        'student_semester_profile_id',
        'name',
        'gender',
        'examed_year',
        'examed_month',
        'examed_name',
        'examed_roll_no',
        'examed_status',
        'class',
        'fee',
        'guardian',
        'nrc_state',
        'nrc_township',
        'nrc_type',
        'nrc_number',
        'agreed',
        
    ];

            public function studentSemesterProfile(){
        return $this->belongsTo(StudentSemesterProfile::class);
    }
}
