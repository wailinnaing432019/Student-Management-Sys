<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Major;
use App\Models\Mark;
use App\Models\Semester;
use App\Models\StudentEnrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Mpdf\Config\ConfigVariables;
use Mpdf\Config\FontVariables;
use Mpdf\Mpdf;

class MarkController extends Controller
{
public function store(Request $request)
{
//     $rules = [
//         'marks' => 'required|array',
//         'marks.*.student_course_enrollment_id' => 'required|exists:student_course_enrollments,id',
//         'marks.*.mark' => 'required|numeric|min:0|max:100',
//         'marks.*.grade' => 'required|string',
//         'marks.*.remark' => 'nullable|string',
//         'marks.*.course_name' => 'required|string', // Needed for error messages only
//     ];



//     // Dynamically build custom attribute names
//     $attributes = [];
//     foreach ($request->input('marks', []) as $index => $mark) {
//         if (!empty($mark['course_name'])) {
//             $attributes["marks.$index.mark"] = "{$mark['course_name']} mark";
//             $attributes["marks.$index.grade"] = "{$mark['course_name']} grade";
//             $attributes["marks.$index.remark"] = "{$mark['course_name']} remark";
//         }
//     }

//     $request->validate($rules, [], $attributes); // ✅ Use $attributes for pretty field names
// dd($request);
    $request->validate([
    'marks' => 'required|array',
    'marks.*.student_course_enrollment_id' => 'required|exists:student_course_enrollments,id',
    'marks.*.mark' => 'required|numeric|min:0|max:100',
]);
// dd($request->all());
try{



foreach ($request->marks as $markData) {
    $markValue = $markData['mark'];

    // Determine grade based on mark value
    if ($markValue === null) {
        $grade = null;  // no grade if no mark
    } elseif ($markValue >= 80) {
        $grade = 'A';
    } elseif ($markValue >= 70) {
        $grade = 'B';
    } elseif ($markValue >= 60) {
        $grade = 'C';
    } elseif ($markValue >= 50) {
        $grade = 'D';
    } else {
        $grade = 'F';
    }

    Mark::updateOrCreate(
        ['student_course_enrollment_id' => $markData['student_course_enrollment_id']],
        [
            'mark' => $markValue,
            'grade' => $grade,
            'remark' => $markData['remark'] ?? null,
        ]
    );
}


    return to_route('studentMarks.show')->with('success', 'Marks saved successfully.');
}catch(\Exception $e){
    dd($e);
}
}

public function assignMark(string $id){
   $enrollment = StudentEnrollment::with([
        'student',
        'semester',
    'studentCourses.course',     // ✅ course belongs to StudentCourseEnrollment
    'studentCourses.mark' 
    ])->findOrFail($id);

    // return [
    //     'student_enrollment_id' => $enrollment->id,
    //     'student' => [
    //         'id' => $enrollment->student->id,
    //         'name' => $enrollment->student->name_eng,
    //         'roll_no' => $enrollment->roll_no,
    //     ],
    //     'semester'=>[
    //         'name'=>$enrollment->semester->name,
    //         'year_name'=>$enrollment->semester->year_name,
    //     ],
    //     'student_courses' => $enrollment->studentCourses
    //         ->sortBy(fn ($sc) => $sc->course->name)
    //         ->map(function ($sc) {
    //             return [
    //                 'id' => $sc->id,
    //                 'student_enrollment_id' => $sc->student_enrollment_id,
    //                 'course_id' => $sc->course_id,
    //                 'course' => [
    //                     'id' => $sc->course->id,
    //                     'name' => $sc->course->name,
    //                     'code' => $sc->course->code,
    //                     'is_elective'=>$sc->course->is_elective,
    //                 ],
    //                 'mark' => $sc->mark ? [
    //                     'id' => $sc->mark->id,
    //                     'mark' => $sc->mark->mark,
    //                     'grade' => $sc->mark->grade,
    //                     'remark' => $sc->mark->remark,
    //                 ] : null,
    //             ];
    //         })->values(),
    //     ];
    return Inertia::render('Marks/AssignMarks', [
        'student_enrollment_id' => $enrollment->id,
        'student' => [
            'id' => $enrollment->student->id,
            'name' => $enrollment->student->name_eng,
            'roll_no' => $enrollment->roll_no,
        ],
        'semester'=>[
            'name'=>$enrollment->semester->name,
            'year_name'=>$enrollment->semester->year_name,
        ],
        'student_courses' => $enrollment->studentCourses
            ->sortBy(fn ($sc) => $sc->course->name)
            ->map(function ($sc) {
                return [
                    'id' => $sc->id,
                    'student_enrollment_id' => $sc->student_enrollment_id,
                    'course_id' => $sc->course_id,
                    'course' => [
                        'id' => $sc->course->id,
                        'name' => $sc->course->name,
                        'code' => $sc->course->code,
                        'is_elective'=>$sc->course->is_elective,
                    ],
                    'mark' => $sc->mark ? [
                        'id' => $sc->mark->id,
                        'mark' => $sc->mark->mark,
                        'grade' => $sc->mark->grade,
                        'remark' => $sc->mark->remark,
                    ] : null,
                ];
            })->values(),
    ]);
}

    public function showMarks(Request $request){
            $academicYears = AcademicYear::orderBy('start_date', 'desc')->get();
            $majors=Major::orderBy('name','asc')->get();
    $selectedAcademicYearId = $request->input('academic_year_id', $academicYears->first()->id);

    // Filter semesters based on academic year
    $semesters = Semester::where('academic_year_id', $selectedAcademicYearId)
        ->orderBy('start_date', 'desc')
        ->get();

        // $request->semester_id=2;
    // Get selected semester (fallback to first semester in list)
    $selectedSemesterId = $request->input('semester_id', $semesters->first()->id ?? null);
    // dd($selectedSemesterId);
    // $selectedSemesterId=2;

    $selectedMajorId = $request->input('major_id', $majors->first()->id ?? null);
// $selectedMajorId=3;
    $enrollStudents = collect();
    if ($selectedSemesterId) {
        $enrollStudents = StudentEnrollment::with([
                'student','studentSemesterProfile', 'studentCourses','studentCourses.course','studentCourses.mark'
            ])
            ->where('semester_id', $selectedSemesterId)
            ->where('major_id',$selectedMajorId)
            ->get();
    }
//  return [
//         'academicYears' => $academicYears,
//         'majors'=>$majors,
//         'selectedMajorId'=>$selectedMajorId,
//         'selectedAcademicYearId' => $selectedAcademicYearId,
//         'semesters' => $semesters,
//         'selectedSemesterId' => $selectedSemesterId,
//         'enrollStudents' => $enrollStudents,
//  ];
    return Inertia::render('Marks/Show', [
        'academicYears' => $academicYears,
        'majors'=>$majors,
        'selectedMajorId'=>$selectedMajorId,
        'selectedAcademicYearId' => $selectedAcademicYearId,
        'semesters' => $semesters,
        'selectedSemesterId' => $selectedSemesterId,
        'enrollStudents' => $enrollStudents,
    ]);
    }

public function show(string $mark)
{
    $enrollStudent = StudentEnrollment::with([
        'student',
        'studentSemesterProfile',
        'semester',
        'academicYear',
        'major',
        'studentCourses',
        'studentCourses.course',
        'studentCourses.mark'
    ])
    ->where('id', $mark)
    ->firstOrFail();
$defaultConfig = (new ConfigVariables())->getDefaults();
    $fontDirs = $defaultConfig['fontDir'];

    $defaultFontConfig = (new FontVariables())->getDefaults();
    $fontData = $defaultFontConfig['fontdata'];

    $mpdf = new Mpdf([
        'mode' => 'utf-8',
        'format' => 'A4',
        'fontDir' => array_merge($fontDirs, [
            storage_path('fonts'),
        ]),
        'fontdata' => $fontData + [
            'pyidaungsu' => [
                'R' => 'Pyidaungsu-2.5.3_Regular.ttf',
                'useOTL' => 0xFF,
                'useKashida' => 75,
            ],
        ],
        'default_font' => 'pyidaungsu',
        'autoScriptToLang' => true,
        'autoLangToFont' => true,
        'shaper' => 'disabled',
    ]); 
    $html = view('pdfs.MarkView', ['enrollStudent' => $enrollStudent])->render();
    $mpdf->WriteHTML($html);
    return $mpdf->Output('student_marks.pdf', \Mpdf\Output\Destination::INLINE);
    // return view('pdfs.MarkView', compact('enrollStudent'));
}


}
