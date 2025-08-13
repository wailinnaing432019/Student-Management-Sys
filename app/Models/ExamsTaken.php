<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamsTaken extends Model
{
    protected $fillable=[
        'exam_name',
        'major',
        'roll_no',
        'year',
        'pass_fail',
        'student_id',
    ];

    public function student(){
        return $this->belongsTo(Student::class);
    }
}
