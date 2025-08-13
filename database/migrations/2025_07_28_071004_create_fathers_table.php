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
        Schema::create('fathers', function (Blueprint $table) {
           $table->id();
            $table->string('name_myan');
            $table->string('name_eng');
            $table->string('ethnicity');
            $table->string('religion');
            $table->string('hometown');
            $table->string('township_state_region');
            $table->string('nrc_state');        
            $table->string('nrc_township');
            $table->string('nrc_type');
            $table->string('nrc_number');
            $table->string('job');
            $table->string('job_position_address')->nullable();
            $table->string('local_foreign');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fathers');
    }
};
