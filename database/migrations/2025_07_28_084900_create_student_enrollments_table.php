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
        Schema::create('student_enrollments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('student_id')->constrained()->onDelete('cascade');
        $table->foreignId('semester_id')->constrained()->onDelete('cascade');
        $table->foreignId('student_semester_profile_id')->constrained()->onDelete('cascade');
        $table->foreignId('major_id')->constrained('majors')->onDelete('cascade');
        $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
        $table->date('registration_date');
        $table->enum('status',['Pending','Accept','Reject'])->default('Pending');
         $table->string('pdf_path')->nullable();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_enrollments');
    }
};
