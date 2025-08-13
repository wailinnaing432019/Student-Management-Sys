<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseSemesterController;
use App\Http\Controllers\EnrollStudentController;
use App\Http\Controllers\MajorController;
use App\Http\Controllers\MarkController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return to_route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::resource('/academic-years',AcademicYearController::class);
    Route::resource('/semesters',SemesterController::class);
    Route::resource('/majors',MajorController::class);
    Route::resource('/courses',CourseController::class);
    Route::resource('/course-semesters',CourseSemesterController::class);

        // Route::get('/course-semester', [CourseSemesterController::class, 'index'])->name('course-semester.index');
//     Route::get('/course-semester/create', [CourseSemesterController::class, 'create'])->name('course-semester.create');
// Route::post('/course-semester', [CourseSemesterController::class, 'store'])->name('course-semester.store');
Route::post('/course-semester/unassign', [CourseSemesterController::class, 'unassign'])->name('course-semesters.unassign');

    Route::resource('/students',StudentController::class);

    Route::get('/assign-mark/{id}',[MarkController::class,'assignMark'])->name('assign-marks');
    Route::get('/marks/show',[MarkController::class,'showMarks'])->name('studentMarks.show');
    Route::resource('/marks',MarkController::class);

    Route::get('/student-course',[StudentController::class,'stuCourses'])->name('stuCourses');
    // Route::get('/enroll-students',[StudentController::class,'enrollStudents'])->name('enrollStudents');
    Route::resource('/enroll-students',EnrollStudentController::class);
    Route::get('/enroll-students/{id}/reregister',[EnrollStudentController::class,'reregister'])->name('enroll-students.reregister');
    Route::post('/enroll-students/{id}/reregister',[EnrollStudentController::class,'updateRegister'])->name('enroll-students.reregister');
    Route::get('/student-enrollments/{id}/pdf', [EnrollStudentController::class, 'downloadPdf'])->name('student-enrollments.download-pdf');
    Route::get('/students/{student}/download-pdf', [EnrollStudentController::class, 'downloadPdfTest'])->name('students.download-pdf');

    Route::get('/students/{studentId}/view-pdf', [EnrollStudentController::class, 'generateAndStorePdf'])->name('students.view-pdf');
    Route::get('/students/{id}/download-register-form-pdf', [EnrollStudentController::class, 'download'])->name('students.download-register-pdf');

Route::post('/enroll-students/{enrollment}/update-status', [EnrollStudentController::class, 'updateStatus'])->name('enroll-students.update-status');
Route::get('/enroll-students/{id}/print', [EnrollStudentController::class, 'print'])->name('enroll-students.print');

});

Route::resource('/students-register',StudentController::class);
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
