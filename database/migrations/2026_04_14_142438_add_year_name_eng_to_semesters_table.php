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
        Schema::table('semesters', function (Blueprint $table) {
            $table->string('year_name_eng')->nullable()->after('year_name'); 
            $table->boolean('is_final_year')->default(false)->after('semester_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('semesters', function (Blueprint $table) {
            $table->dropColumn('year_name_eng'); 
            $table->dropColumn('is_final_year');
        });
    }
};
