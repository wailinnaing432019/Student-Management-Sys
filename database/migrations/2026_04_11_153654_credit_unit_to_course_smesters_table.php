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
            $table->decimal('credit_unit', 4, 2)->after('is_elective')->default(3.00);
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

 
