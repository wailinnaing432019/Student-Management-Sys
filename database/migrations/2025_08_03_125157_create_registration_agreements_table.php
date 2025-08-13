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
        Schema::create('registration_agreements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_semester_profile_id')->constrained('student_semester_profiles')->onDelete('cascade');
            $table->string('name');
            $table->enum('gender',['male','female']);
            $table->string('examed_year');
            $table->string('examed_month');
            $table->string('examed_name');
            $table->string('examed_roll_no');
            $table->string('examed_status');
            $table->string('class');
            $table->string('fee');
            $table->string('guardian');
            $table->string('nrc_state');
            $table->string('nrc_township');
            $table->string('nrc_type');
            $table->string('nrc_number');
            $table->string('agreed');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registration_agreements');
    }
};
