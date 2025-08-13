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
        Schema::create('exams_takens', function (Blueprint $table) {
            $table->id();
            $table->string('exam_name');
            $table->string('major');
            $table->string('roll_no');
            $table->string('year');
            $table->string('pass_fail');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams_takens');
    }
};
