<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name_myan');
            $table->string('name_eng');

            $table->string('uid')->nullable();
            $table->string('entried_year');
            $table->string('nrc_state');        
            $table->string('nrc_township');
            $table->string('nrc_type');
            $table->string('nrc_number');
            $table->date('dob');
            $table->string('ethnicity');
            $table->string('religion');
            $table->string('hometown');
            $table->string('township_state_region')->nullable();
            $table->string('local_foreign');
            $table->string('matriculation_passed_year');
            $table->string('matriculation_passed_roll_no');
            $table->string('examination_center');


            $table->enum('gender', ['Male', 'Female'])->nullable();   

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
