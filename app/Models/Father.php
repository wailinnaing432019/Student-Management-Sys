<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Father extends Model
{
            protected $fillable=[
        'name_myan',
        'name_eng',
        'ethnicity',
        'religion',
        'hometown',
        'township_state_region',
        'nrc_state',
        'nrc_township',
        'nrc_type',
        'nrc_number', 
        'job',
        'job_position_address',
        'local_foreign',
        'student_id',
    ];
}
