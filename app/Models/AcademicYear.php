<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    protected $fillable = ['name', 'start_date', 'end_date'];

    public function semesters(){
        return $this->hasMany(Semester::class);
    }
}
