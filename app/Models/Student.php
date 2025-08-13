<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
    'name_myan',
    'name_eng',

    'uid',
    'entried_year',
    'nrc_state',
    'nrc_township',
    'nrc_type',
    'nrc_number', 
    'dob', 
    'gender', 
    'ethnicity', 
    'religion', 
    'hometown',
    'township_state_region', 
    'local_foreign',
    'matriculation_passed_year',
    'matriculation_passed_roll_no',
    'examination_center', 
    ];


    public function father(){
        return $this->hasOne(Father::class);
    }

     public function mother(){
        return $this->hasOne(Mother::class);
    }


     public function examsTaken(){
        return $this->hasMany(ExamsTaken::class);
    }

}
