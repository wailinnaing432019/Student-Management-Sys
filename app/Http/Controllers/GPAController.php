<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Major;
use App\Models\Semester;
use App\Models\StudentEnrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GPAController extends Controller
{
    public function index(Request $request)
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
    
        return Inertia::render('GPA/Index', [
            'academicYears' => $academicYears,
            'majors' => $majors,
            'selectedMajorId' => $selectedMajorId,
            'selectedAcademicYearId' => $selectedAcademicYearId,
            'semesters' => $semesters,
            'selectedSemesterId' => $selectedSemesterId,
            'enrollStudents' => $enrollStudents,
        ]);
    }

    // public function show(string $id)
    // { 
        
    //     $enrollment = StudentEnrollment::with([
    //         'student',
    //         'studentSemesterProfile',
    //         'semester',
    //         'academicYear',
    //         'studentCourses.course',
    //         'studentCourses.mark',
    //     ])->findOrFail($id);

    //     // Attach is_elective from course_semesters table
    //     $studentCourses = $enrollment->studentCourses 
    //         ->map(function ($sc) use ($enrollment) {
    //             // Find the course_semester row for this course + enrollment's semester
    //             $courseSemester = \App\Models\CourseSemester::where('course_id', $sc->course_id)
    //                 ->where('semester_id', $enrollment->semester_id)
    //                 ->first();

    //             return [
    //                 'id' => $sc->id,
    //                 'student_enrollment_id' => $sc->student_enrollment_id,
    //                 'course_id' => $sc->course_id,
    //                 'course' => [
    //                     'id' => $sc->course->id,
    //                     'name' => $sc->course->name,
    //                     'code' => $sc->course->code,
    //                     'is_elective' => $courseSemester?->is_elective, // ✅ from pivot
    //                     'credit_unit'=>$courseSemester?->credit_unit, // ✅ from pivot
    //                 ],
    //                 'mark' => $sc->mark ? [
    //                     'id' => $sc->mark->id,
    //                     'mark' => $sc->mark->mark,
    //                     'grade' => $sc->mark->grade,
    //                     'remark' => $sc->mark->remark,
    //                 ] : null,
    //             ];
    //         })->values();
 
    //         return Inertia::render('GPA/Show', [
    //         'student_enrollment_id' => $enrollment->id,
    //         'student' => [
    //             'id' => $enrollment->student->id,
    //             'name' => $enrollment->student->name_eng,
    //             'roll_no' => $enrollment->studentSemesterProfile->roll_no,
    //             'major'=>$enrollment->major->name,
    //         ],
    //         'semester'=>[
    //             'semester_number' => $enrollment->semester->semester_number,
    //             'year_name' => $enrollment->semester->year_name,
    //             'academicYear'=>$enrollment->academicYear->name,
    //         ],
    //         'student_courses' => $studentCourses,
    //     ]);
    // }


public function show(string $id)
{ 
    $enrollment = StudentEnrollment::with([
        'student', 'studentSemesterProfile', 'semester', 'academicYear', 'major', 'studentCourses.course', 'studentCourses.mark',
    ])->findOrFail($id);

    $currentSemNumber = $enrollment->semester->semester_number;
    $isFinalYear=$enrollment->semester->is_final_year;

    $studentId = $enrollment->student_id;
    $academicYearId = $enrollment->academic_year_id;

    // ၁။ ယခုနှစ်ထဲက Enrollment အားလုံးကို ရှာမယ်
    $allEnrollmentsInYear = StudentEnrollment::where('student_id', $studentId)
        ->where('academic_year_id', $academicYearId)
        ->with(['studentCourses.course', 'studentCourses.mark', 'semester'])
        ->get();

    $allYearCourses = collect();
    $allYearTotalCredits = 0;
    $allYearTotalPoints = 0;
    $semesterGpas = [];

    foreach ($allEnrollmentsInYear as $en) {
        $semCredits = 0;
        $semPoints = 0;

        foreach ($en->studentCourses as $sc) {
            // ✅ အမှတ်ရှိတဲ့ ဘာသာရပ်ကိုပဲ ယူမယ် (Elective တွေအတွက်ပါ အဆင်ပြေအောင်)
            if ($sc->mark && $sc->mark->grade) {
                $courseSemester = \App\Models\CourseSemester::where('course_id', $sc->course_id)
                    ->where('semester_id', $en->semester_id)
                    ->first();

                $credit = $courseSemester?->credit_unit ?? 0;
                $score = $this->getGradeScore($sc->mark->grade);

                // Yearly totals
                $allYearTotalCredits += $credit;
                $allYearTotalPoints += ($credit * $score);

                // Semester totals
                $semCredits += $credit;
                $semPoints += ($credit * $score);

                // ✅ တစ်နှစ်လုံးစာ ဘာသာရပ်အားလုံးကို Format ချပြီး သိမ်းမယ်
                $allYearCourses->push([
                    'id' => $sc->id,
                    'course' => [
                        'name' => $sc->course->name,
                        'code' => $sc->course->code,
                        'is_elective' => $courseSemester?->is_elective,
                        'credit_unit' => $credit,
                    ],
                    'mark' => [
                        'mark' => $sc->mark->mark,
                        'grade' => $sc->mark->grade,
                        'remark' => $sc->mark->remark,
                    ]
                ]);
            }
        }
        $semesterGpas[$en->semester->semester_number] = $semCredits > 0 ? ($semPoints / $semCredits) : 0;
    }

    // ၂။ Logic သတ်မှတ်ချက်များ
    if($isFinalYear){
        $isFinalYearS1=($currentSemNumber % 2 != 0); // Final Year S1 ဆိုရင် Semester Number က odd ဖြစ်မယ်
        $isFinalYearS2=($currentSemNumber % 2 == 0); // Final Year S2 ဆိုရင် Semester Number က even ဖြစ်မယ်
    } else {
        $isFinalYearS1=false;
        $isFinalYearS2=false;
    }
  
    $showOverall = ($currentSemNumber % 2 == 0); // Semester 2, 4, 6, 8 ကျမှ overall ပြမယ်

    // ၃။ GPA သတ်မှတ်ချက်
    if ($isFinalYear && $currentSemNumber % 2 == 0) {
        // Final Year S2 ဆိုရင် ၆ ဘာသာပေါင်း GPA ကိုပြမယ်
        $cumulativeGpa = $allYearTotalCredits > 0 ? ($allYearTotalPoints / $allYearTotalCredits) : 0;
        $overallGpa = number_format($cumulativeGpa, 2);
    } else {
        // တခြား semester များအတွက် လက်ရှိ semester ရဲ့ GPA ပဲပြမယ်
        $cumulativeGpa = $semesterGpas[$currentSemNumber] ?? 0;
        $overallGpa = $allYearTotalCredits > 0 ? number_format($allYearTotalPoints / $allYearTotalCredits, 2) : "0.00";
        // return ($allYearTotalPoints.'/'.$allYearTotalCredits.'='.$overallGpa);
    }

    // ၄။ လက်ရှိ Semester တစ်ခုတည်းအတွက်ပဲ ပြရမယ့် List (General Years အတွက်)
    $currentSemesterCourses = $allYearCourses->filter(function($item) use ($enrollment) {
        // အပေါ်က push လုပ်ထားတဲ့ list ထဲကမှ လက်ရှိ enrollment ထဲမှာပါတဲ့ course တွေကိုပဲ filter ပြန်လုပ်တာပါ
        return $enrollment->studentCourses->contains('id', $item['id']);
    })->values();
    return Inertia::render('GPA/Show', [
        'student_enrollment_id' => $enrollment->id,
        'student' => [
            'id' => $enrollment->student->id,
            'name' => $enrollment->student->name_eng,
            'roll_no' => $enrollment->studentSemesterProfile->roll_no,
            'major' => $enrollment->major->name,
        ],
        'semester' => [
            'semester_number' => $currentSemNumber,
            'year_name_eng' => $enrollment->semester->year_name_eng,
            'academicYear' => $enrollment->academicYear->name,
        ],
        // Final Year S2 ဆိုရင် ၆ ဘာသာလုံးပို့မယ်၊ မဟုတ်ရင် လက်ရှိ semester ဘာသာပဲပို့မယ်
        'student_courses' => ($isFinalYearS2) ? $allYearCourses : $currentSemesterCourses,
        'cumulative_gpa' => number_format($cumulativeGpa, 2),
        'overall_gpa' => $overallGpa,
        'show_overall' => $showOverall,
        'is_final_year_s1' => $isFinalYearS1,
        'is_final_year_s2' => $isFinalYearS2,
    ]);
}

    public function print(Request $request,string $id)
    { 
        $issueDate = $request->query('issue_date');
        $enrollment = StudentEnrollment::with([
        'student', 'studentSemesterProfile', 'semester', 'academicYear', 'major', 'studentCourses.course', 'studentCourses.mark',
    ])->findOrFail($id);

    $currentSemNumber = $enrollment->semester->semester_number;
    $isFinalYear=$enrollment->semester->is_final_year;
    $studentId = $enrollment->student_id;
    $academicYearId = $enrollment->academic_year_id;

    // ၁။ ယခုနှစ်ထဲက Enrollment အားလုံးကို ရှာမယ်
    $allEnrollmentsInYear = StudentEnrollment::where('student_id', $studentId)
        ->where('academic_year_id', $academicYearId)
        ->with(['studentCourses.course', 'studentCourses.mark', 'semester'])
        ->get();

    $allYearCourses = collect();
    $allYearTotalCredits = 0;
    $allYearTotalPoints = 0;
    $semesterGpas = [];

    foreach ($allEnrollmentsInYear as $en) {
        $semCredits = 0;
        $semPoints = 0;

        foreach ($en->studentCourses as $sc) {
            // ✅ အမှတ်ရှိတဲ့ ဘာသာရပ်ကိုပဲ ယူမယ် (Elective တွေအတွက်ပါ အဆင်ပြေအောင်)
            if ($sc->mark && $sc->mark->grade) {
                $courseSemester = \App\Models\CourseSemester::where('course_id', $sc->course_id)
                    ->where('semester_id', $en->semester_id)
                    ->first();

                $credit = $courseSemester?->credit_unit ?? 0;
                $score = $this->getGradeScore($sc->mark->grade);

                // Yearly totals
                $allYearTotalCredits += $credit;
                $allYearTotalPoints += ($credit * $score);

                // Semester totals
                $semCredits += $credit;
                $semPoints += ($credit * $score);

                // ✅ တစ်နှစ်လုံးစာ ဘာသာရပ်အားလုံးကို Format ချပြီး သိမ်းမယ်
                $allYearCourses->push([
                    'id' => $sc->id,
                    'course' => [
                        'name' => $sc->course->name,
                        'code' => $sc->course->code,
                        'is_elective' => $courseSemester?->is_elective,
                        'credit_unit' => $credit,
                    ],
                    'mark' => [
                        'mark' => $sc->mark->mark,
                        'grade' => $sc->mark->grade,
                        'remark' => $sc->mark->remark,
                    ]
                ]);
            }
        }
        $semesterGpas[$en->semester->semester_number] = $semCredits > 0 ? ($semPoints / $semCredits) : 0;
    }

    // ၂။ Logic သတ်မှတ်ချက်များ
    $isFinalYearS1 = ($currentSemNumber == 7);
    $isFinalYearS2 = ($currentSemNumber == 8);
    $showOverall = ($currentSemNumber % 2 == 0); // Semester 2, 4, 6, 8 ကျမှ overall ပြမယ်

    // ၃။ GPA သတ်မှတ်ချက်
    if ($isFinalYearS2) {
        // Final Year S2 ဆိုရင် ၆ ဘာသာပေါင်း GPA ကိုပြမယ်
        $cumulativeGpa = $allYearTotalCredits > 0 ? ($allYearTotalPoints / $allYearTotalCredits) : 0;
        $overallGpa = number_format($cumulativeGpa, 2);
    } else {
        // တခြား semester များအတွက် လက်ရှိ semester ရဲ့ GPA ပဲပြမယ်
        $cumulativeGpa = $semesterGpas[$currentSemNumber] ?? 0;
        $overallGpa = $allYearTotalCredits > 0 ? number_format($allYearTotalPoints / $allYearTotalCredits, 2) : "0.00";
        // return ($allYearTotalPoints.'/'.$allYearTotalCredits.'='.$overallGpa);
    }

    // ၄။ လက်ရှိ Semester တစ်ခုတည်းအတွက်ပဲ ပြရမယ့် List (General Years အတွက်)
    $currentSemesterCourses = $allYearCourses->filter(function($item) use ($enrollment) {
        // အပေါ်က push လုပ်ထားတဲ့ list ထဲကမှ လက်ရှိ enrollment ထဲမှာပါတဲ့ course တွေကိုပဲ filter ပြန်လုပ်တာပါ
        return $enrollment->studentCourses->contains('id', $item['id']);
    })->values();
    return Inertia::render('GPA/Print', [
        'student_enrollment_id' => $enrollment->id,
        'student' => [
            'id' => $enrollment->student->id,
            'name' => $enrollment->student->name_eng,
            'roll_no' => $enrollment->studentSemesterProfile->roll_no,
            'major' => $enrollment->major->name,
        ],
        'semester' => [
            'semester_number' => $currentSemNumber,
            'year_name_eng' => $enrollment->semester->year_name_eng,
            'academicYear' => $enrollment->academicYear->name,
        ],
        // Final Year S2 ဆိုရင် ၆ ဘာသာလုံးပို့မယ်၊ မဟုတ်ရင် လက်ရှိ semester ဘာသာပဲပို့မယ်
        'student_courses' => ($isFinalYearS2) ? $allYearCourses : $currentSemesterCourses,
        'cumulative_gpa' => number_format($cumulativeGpa, 2),
        'overall_gpa' => $overallGpa,
        'show_overall' => $showOverall,
        'is_final_year_s1' => $isFinalYearS1,
        'is_final_year_s2' => $isFinalYearS2,
        'issue_date' => $issueDate,
    ]);
    }
    // public function print(Request $request,string $id)
    // { 
    //     $issueDate = $request->query('issue_date');
    //     $enrollment = StudentEnrollment::with([
    //         'student',
    //         'studentSemesterProfile',
    //         'semester',
    //         'academicYear',
    //         'studentCourses.course',
    //         'studentCourses.mark',
    //     ])->findOrFail($id);

    //     // Attach is_elective from course_semesters table
    //     $studentCourses = $enrollment->studentCourses 
    //         ->map(function ($sc) use ($enrollment) {
    //             // Find the course_semester row for this course + enrollment's semester
    //             $courseSemester = \App\Models\CourseSemester::where('course_id', $sc->course_id)
    //                 ->where('semester_id', $enrollment->semester_id)
    //                 ->first();

    //             return [
    //                 'id' => $sc->id,
    //                 'student_enrollment_id' => $sc->student_enrollment_id,
    //                 'course_id' => $sc->course_id,
    //                 'course' => [
    //                     'id' => $sc->course->id,
    //                     'name' => $sc->course->name,
    //                     'code' => $sc->course->code,
    //                     'is_elective' => $courseSemester?->is_elective, // ✅ from pivot
    //                     'credit_unit'=>$courseSemester?->credit_unit, // ✅ from pivot
    //                 ],
    //                 'mark' => $sc->mark ? [
    //                     'id' => $sc->mark->id,
    //                     'mark' => $sc->mark->mark,
    //                     'grade' => $sc->mark->grade,
    //                     'remark' => $sc->mark->remark,
    //                 ] : null,
    //             ];
    //         })->values();
 
    //         return Inertia::render('GPA/Print', [
    //         'student_enrollment_id' => $enrollment->id,
    //         'student' => [
    //             'id' => $enrollment->student->id,
    //             'name' => $enrollment->student->name_eng,
    //             'roll_no' => $enrollment->studentSemesterProfile->roll_no,
    //             'major'=>$enrollment->major->name,
    //         ],
    //         'semester'=>[
    //             'semester_number' => $enrollment->semester->semester_number,
    //             'year_name' => $enrollment->semester->year_name,
    //             'academicYear'=>$enrollment->academicYear->name,
    //         ],
    //         'student_courses' => $studentCourses,
    //         'issue_date' => $issueDate,
    //     ]);
    // }

    // Grade Score တွက်ပေးမယ့် Helper function (Controller ထဲမှာ ထည့်ထားပါ)
    private function getGradeScore($grade) {
        $scale = [
            'A+' => 4, 'A' => 4, 'A-' => 3.67, 'B+' => 3.33, 'B' => 3,
            'B-' => 2.67, 'C+' => 2.33, 'C' => 2, 'D' => 1, 'F' => 0
        ];
        return $scale[$grade] ?? 0;
    }
}
