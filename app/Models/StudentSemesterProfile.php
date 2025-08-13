<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentSemesterProfile extends Model
{
   protected $fillable=[
            'student_id',
        'academic_year_id',
        'semester_id',
        'major_id',
        'roll_no',
        'permanent_address',
        'temporary_address',
        'phone',
        'email',
        'image',
   ];

        public function donor(){
        return $this->hasOne(Donor::class);
    }
public function registrationAgreement(){
    return $this->hasOne(RegistrationAgreement::class);
}
}
