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
        Schema::table('course_semesters', function (Blueprint $table) {
            $table->double('credit_unit')->after('is_elective')->default(0.00);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_semesters', function (Blueprint $table) {
            $table->dropColumn('credit_unit');
        });
    }
};

 
