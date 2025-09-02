<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Major;
use App\Models\Mark;
use App\Models\Semester;
use App\Models\StudentCourseEnrollment;
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
    $request->validate([
        'marks' => 'required|array',
        'marks.*.student_course_enrollment_id' => 'required|exists:student_course_enrollments,id',
        'marks.*.mark' => 'nullable|numeric|min:0|max:100', // ✅ allow null
    ], [
        'marks.required' => 'အမှတ်များကိုထည့်ရန် လိုအပ်ပါသည်။',
        'marks.array' => 'အမှတ်များသည် စာရင်းပုံစံဖြင့် ရှိရမည်။',
        'marks.*.mark.numeric' => 'အမှတ်သည် နံပါတ်ပုံစံဖြင့် ရှိရမည်။',
        'marks.*.mark.min' => 'အမှတ်သည် ၀ ထက် မနည်းနိုင်ပါ။',
        'marks.*.mark.max' => 'အမှတ်သည် ၁၀၀ ထက် မပိုနိုင်ပါ။',
    ]); 

    try {
        $academicYears = null;
        $semesters = null;
        $majors = null;

        foreach ($request->marks as $markData) {
            $markValue = $markData['mark'];

            // ✅ Skip if mark is null or empty
            if ($markValue === null || $markValue === '') {
                continue;
            }

            // Determine grade based on mark value
            if ($markValue >= 90) {
                $grade = 'A+';
            } elseif ($markValue >= 80) {
                $grade = 'A';
            } elseif ($markValue >= 75) {
                $grade = 'A-';
            } elseif ($markValue >= 70) {
                $grade = 'B+';
            } elseif ($markValue >= 65) {
                $grade = 'B';
            } elseif ($markValue >= 60) {
                $grade = 'B-';
            } elseif ($markValue >= 55) {
                $grade = 'C+';
            } elseif ($markValue >= 50) {
                $grade = 'C';
            } elseif ($markValue >= 40) {
                $grade = 'D';
            } else {
                $grade = 'F';
            }

            // Get related info for redirect
            $studentCourseEnrollment = StudentCourseEnrollment::with('studentEnrollment')
                ->where('id', $markData['student_course_enrollment_id']) 
                ->first(); 

            $academicYears = $studentCourseEnrollment->studentEnrollment->academic_year_id;
            $semesters = $studentCourseEnrollment->studentEnrollment->semester_id;
            $majors = $studentCourseEnrollment->studentEnrollment->major_id;

            // Create or update mark
            Mark::updateOrCreate(
                ['student_course_enrollment_id' => $markData['student_course_enrollment_id']],
                [
                    'mark' => $markValue,
                    'grade' => $grade,
                    'remark' => $markData['remark'] ?? null,
                ]
            );
        }

        return to_route('studentMarks.show', [
            'academic_year_id' => $academicYears,
            'semester_id' => $semesters,
            'major_id' => $majors,
        ])->with('success', 'အမှတ်များအား ထည့်သွင်းခြင်းအောင်မြင်ပါသည်။');

    } catch (\Exception $e) {
        dd($e);
    }
}

public function assignMark(string $id){
//    $enrollment = StudentEnrollment::with([
//         'student',
//         'semester',
//     'studentCourses.course',     // ✅ course belongs to StudentCourseEnrollment
//     'studentCourses.mark' 
//     ])->findOrFail($id);

    
//     return Inertia::render('Marks/AssignMarks', [
//         'student_enrollment_id' => $enrollment->id,
//         'student' => [
//             'id' => $enrollment->student->id,
//             'name' => $enrollment->student->name_eng,
//             'roll_no' => $enrollment->roll_no,
//         ],
//         'semester'=>[
//             'name'=>$enrollment->semester->name,
//             'year_name'=>$enrollment->semester->year_name,
//         ],
//         'student_courses' => $enrollment->studentCourses
//             ->sortBy(fn ($sc) => $sc->course->name)
//             ->map(function ($sc) {
//                 return [
//                     'id' => $sc->id,
//                     'student_enrollment_id' => $sc->student_enrollment_id,
//                     'course_id' => $sc->course_id,
//                     'course' => [
//                         'id' => $sc->course->id,
//                         'name' => $sc->course->name,
//                         'code' => $sc->course->code,
//                         'is_elective'=>$sc->course->is_elective,
//                     ],
//                     'mark' => $sc->mark ? [
//                         'id' => $sc->mark->id,
//                         'mark' => $sc->mark->mark,
//                         'grade' => $sc->mark->grade,
//                         'remark' => $sc->mark->remark,
//                     ] : null,
//                 ];
//             })->values(),
//     ]);

$enrollment = StudentEnrollment::with([
    'student',
    'semester',
    'studentCourses.course',
    'studentCourses.mark',
])->findOrFail($id);

// Attach is_elective from course_semesters table
$studentCourses = $enrollment->studentCourses 
    ->map(function ($sc) use ($enrollment) {
        // Find the course_semester row for this course + enrollment's semester
        $courseSemester = \App\Models\CourseSemester::where('course_id', $sc->course_id)
            ->where('semester_id', $enrollment->semester_id)
            ->first();

        return [
            'id' => $sc->id,
            'student_enrollment_id' => $sc->student_enrollment_id,
            'course_id' => $sc->course_id,
            'course' => [
                'id' => $sc->course->id,
                'name' => $sc->course->name,
                'code' => $sc->course->code,
                'is_elective' => $courseSemester?->is_elective, // ✅ from pivot
            ],
            'mark' => $sc->mark ? [
                'id' => $sc->mark->id,
                'mark' => $sc->mark->mark,
                'grade' => $sc->mark->grade,
                'remark' => $sc->mark->remark,
            ] : null,
        ];
    })->values();
    return Inertia::render('Marks/AssignMarks', [
    'student_enrollment_id' => $enrollment->id,
    'student' => [
        'id' => $enrollment->student->id,
        'name' => $enrollment->student->name_myan,
        'roll_no' => $enrollment->roll_no,
    ],
    'semester'=>[
        'semester_number' => $enrollment->semester->semester_number,
        'year_name' => $enrollment->semester->year_name,
    ],
    'student_courses' => $studentCourses,
]);
}

   public function showMarks(Request $request)
{
    // Get academic years and majors
    $academicYears = AcademicYear::orderBy('start_date', 'desc')->get();
    $majors = Major::orderBy('name', 'asc')->get();

    // Handle empty academic years
        $selectedAcademicYearId = $request->input('academic_year_id', $academicYears->first()?->id);
    // $selectedAcademicYearId = $academicYears->first()?->id;

    // Filter semesters based on academic year, or empty collection
    $semesters = $selectedAcademicYearId 
        ? Semester::where('academic_year_id', $selectedAcademicYearId)
            ->orderBy('start_date', 'desc')
            ->get()
        : collect();

    $selectedSemesterId = $request->input('semester_id', $semesters->first()?->id);
    $selectedMajorId = $request->input('major_id', $majors->first()?->id);

    $enrollStudents = collect();
    if ($selectedSemesterId && $selectedMajorId) {
        $enrollStudents = StudentEnrollment::with([
                'student',
                'studentSemesterProfile',
                'studentCourses',
                'studentCourses.course',
                'studentCourses.mark'
            ])
            ->where('semester_id', $selectedSemesterId)
            ->where('major_id', $selectedMajorId)
            ->get();
    }
 
    return Inertia::render('Marks/Show', [
        'academicYears' => $academicYears,
        'majors' => $majors,
        'selectedMajorId' => $selectedMajorId,
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

public  function viewMarksByPdf(Request $request){
    // dd($request->all());
    // Load academic years & majors
        $academicYears = AcademicYear::orderBy('start_date', 'desc')->get();
        $majors = Major::orderBy('name', 'asc')->get();

        // Handle empty academic years
        $selectedAcademicYearId = $request->input('academic_year_id', $academicYears->first()?->id);

        // Get semesters by selected academic year
        $semesters = $selectedAcademicYearId
            ? Semester::where('academic_year_id', $selectedAcademicYearId)
                ->orderBy('start_date', 'desc')
                ->get()
            : collect();

        // Selected semester & major
        $selectedSemesterId = $request->input('semester_id', $semesters->first()?->id);
        $selectedMajorId = $request->input('major_id', $majors->first()?->id);

        // Students with marks
        $enrollStudents = collect();
        if ($selectedSemesterId && $selectedMajorId) {
            $enrollStudents = StudentEnrollment::with([
                    'student',
                    'studentSemesterProfile',
                    'studentCourses.course',
                    'studentCourses.mark',
                ])
                ->where('academic_year_id', $selectedAcademicYearId)
                ->where('semester_id', $selectedSemesterId)
                ->where('major_id', $selectedMajorId)
                ->get();
        }


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
    $html = view('pdfs.Marks', [
            'viewBy'=>$request->viewBy,
            'academicYears' => $academicYears,
            'majors' => $majors,
            'semesters' => $semesters,
            'selectedAcademicYearId' => $selectedAcademicYearId,
            'selectedSemesterId' => $selectedSemesterId,
            'selectedMajorId' => $selectedMajorId,
            'enrollStudents' => $enrollStudents,
        ])->render();
    $mpdf->WriteHTML($html);
    return $mpdf->Output('student_marks.pdf', \Mpdf\Output\Destination::INLINE);
        // return [
        //     'academicYears' => $academicYears,
        //     'majors' => $majors,
        //     'semesters' => $semesters,
        //     'selectedAcademicYearId' => $selectedAcademicYearId,
        //     'selectedSemesterId' => $selectedSemesterId,
        //     'selectedMajorId' => $selectedMajorId,
        //     'enrollStudents' => $enrollStudents,
        // ];
        return view('pdfs.Marks', [
            'academicYears' => $academicYears,
            'majors' => $majors,
            'semesters' => $semesters,
            'selectedAcademicYearId' => $selectedAcademicYearId,
            'selectedSemesterId' => $selectedSemesterId,
            'selectedMajorId' => $selectedMajorId,
            'enrollStudents' => $enrollStudents,
        ]);
}

}
