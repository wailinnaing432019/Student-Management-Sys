<?php

namespace App\Http\Controllers;

use App\Http\Requests\CourseSemesterRequest;
use App\Models\AcademicYear;
use App\Models\Course;
use App\Models\Major;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CourseSemesterController extends Controller
{
public function index(Request $request)
{
    $academicYears = AcademicYear::orderBy('start_date', 'desc')->get();

    // Return early if no academic years exist
    if ($academicYears->isEmpty()) {
        return inertia('CourseSemester/Index', [
            'academicYears' => [],
            'selectedAcademicYearId' => null,
            'semesters' => [],
            'majors' => [],
            'selected_semester_id' => null,
            'selected_major_id' => null,
            'assigned_courses' => [],
        ]);
    }

    $selectedAcademicYearId = $request->input('academic_year_id', $academicYears->first()->id);

    $semesters = Semester::orderBy('id')
        ->where('academic_year_id', $selectedAcademicYearId)
        ->get();

    // Return early if no semesters exist for the selected academic year
    if ($semesters->isEmpty()) {
        return inertia('CourseSemester/Index', [
            'academicYears' => $academicYears,
            'selectedAcademicYearId' => $selectedAcademicYearId,
            'semesters' => [],
            'majors' => [],
            'selected_semester_id' => null,
            'selected_major_id' => null,
            'assigned_courses' => [],
        ]);
    }

    $majors = Major::orderBy('name')->get();
    $selectedSemesterId = $request->input('semester_id', $semesters->first()->id);
    $selectedMajorId = $request->input('major_id', $majors->first()->id ?? null);

    $semester = Semester::with(['courses' => function ($query) use ($selectedMajorId) {
        if ($selectedMajorId) {
            $query->whereHas('majors', function ($q) use ($selectedMajorId) {
                $q->where('majors.id', $selectedMajorId);
            });
        }
    }])->findOrFail($selectedSemesterId);

    $courses = $semester->courses->map(function ($course) {
        return [
            'id' => $course->id,
            'name' => $course->name,
            'code' => $course->code,
            'is_elective' => $course->pivot->is_elective,
        ];
    });

    // return [
    //     'academicYears' => $academicYears,
    //     'selectedAcademicYearId' => $selectedAcademicYearId,
    //     'semesters' => $semesters,
    //     'majors' => $majors,
    //     'selected_semester_id' => $selectedSemesterId,
    //     'selected_major_id' => $selectedMajorId,
    //     'assigned_courses' => $courses,
    // ];
    return inertia('CourseSemester/Index', [
        'academicYears' => $academicYears,
        'selectedAcademicYearId' => $selectedAcademicYearId,
        'semesters' => $semesters,
        'majors' => $majors,
        'selected_semester_id' => $selectedSemesterId,
        'selected_major_id' => $selectedMajorId,
        'assigned_courses' => $courses,
    ]);
}



public function create()
{
    $academicYears = AcademicYear::with('semesters')->orderBy('start_date', 'desc')->get();
    $courses = Course::with('majors')->get();
    $majors = Major::all();
    
    $semesters = Semester::with('courses')->get();

    $courseSemesterMap = [];

    foreach ($semesters as $semester) {
        foreach ($semester->courses as $course) {
            $pivot = $course->pivot;
            if ($pivot) {
                $courseSemesterMap[$semester->id][$course->id] = [
                    'is_elective' => $pivot->is_elective,
                ];
            }
        }
    }

    
    return Inertia::render('CourseSemester/Create', [
        'academicYears' => $academicYears->map(fn ($year) => [
            'id' => $year->id,
            'name' => $year->name,
            'semesters' => $year->semesters->map(fn ($sem) => [
                'id' => $sem->id, 
                'semester_number'=>$sem->semester_number,
            ]),
        ]),
        'courses' => $courses,
        'majors' => $majors->map(fn ($m) => [
            'id' => $m->id,
            'name' => $m->name,
        ]),
        'courseSemesterMap' => $courseSemesterMap,
    ]);
}
  public function store(CourseSemesterRequest $request)
{
    // Validate incoming data
    $data = $request->validate([
        'semester_id' => 'required|exists:semesters,id',
        'courses' => 'required|array',
        'courses.*.id' => 'required|exists:courses,id',
        'courses.*.is_elective' => 'boolean',
    ]); 
    try {
        // We'll prepare an array to sync the pivot table with
        $syncData = [];

        foreach ($data['courses'] as $course) {
            $syncData[$course['id']] = [
                'is_elective' => $course['is_elective'] ?? false,
                'updated_at' => now(),
                'created_at' => now(),
            ];
        }

        // Find the semester
        $semester = \App\Models\Semester::findOrFail($data['semester_id']);

        // Sync courses with pivot data (this will update existing and add new)
        $semester->courses()->sync($syncData);

 

            return to_route('course-semesters.index', [
                'academic_year_id' => $semester->academicYear->id,
                'semester_id' => $data['semester_id'], 
            ])->with('success', 'ပညာသင်နှစ် နှင့် သင်ကြားမည့် ဘာသာ အားသတ်မှတ်ပြီးပါပြီ။');
    } catch (\Exception $e) {

        dd($e);
        // Optionally log error for debugging
        Log::error('Failed to assign courses to semester: ' . $e->getMessage());

        return back()->withErrors('ပညာသင်နှစ် နှင့် သင်ကြားမည့် ဘာသာ အားသတ်မှတ်ရာ တွင်အမှားအယွင်းဖြစ်ပေါ်နေပါသည်။' . $e->getMessage());
    }
}



    public function unassign(Request $request)
{
    $semester = Semester::findOrFail($request->semester_id);
    $semester->courses()->detach($request->course_id);

    return redirect()->back()->with('success', 'ပညာသင်နှစ် နှင့် သင်ကြားမည့် ဘာသာ ပြင်ဆင်ပြီးပါပြီ။');
}
}
