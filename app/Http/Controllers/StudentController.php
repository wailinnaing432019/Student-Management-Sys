<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentRequest;
use App\Models\AcademicYear;
use App\Models\Course;
use App\Models\CourseSemester;
use App\Models\Donor;
use App\Models\ExamsTaken;
use App\Models\Father;
use App\Models\Major;
use App\Models\Mother;
use App\Models\RegistrationAgreement;
use App\Models\Semester;
use App\Models\Student;
use App\Models\StudentCourseEnrollment;
use App\Models\StudentEnrollment;
use App\Models\StudentSemesterProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Mpdf\Config\ConfigVariables;
use Mpdf\Config\FontVariables;
use Mpdf\Mpdf;

class StudentController extends Controller
{
public function index(Request $request)
{
    $academicYears = AcademicYear::orderBy('start_date', 'desc')->get(); 

    $selectedAcademicYearId = $request->input('academic_year_id', $academicYears->first()?->id);
    $semesters = Semester::where('academic_year_id', $selectedAcademicYearId)
        ->orderBy('start_date', 'desc')
        ->get();
    $selectedSemesterId = $request->input('semester_id', $semesters->first()?->id ?? null); 

    $search = $request->input('search');

    $enrollStudents = StudentEnrollment::with([
            'student',
            'studentSemesterProfile',
            'semester',
            'major',
            'academicYear'
        ])
    ->when($selectedAcademicYearId, fn($q) =>
        $q->where('academic_year_id', $selectedAcademicYearId)
    )
    ->when($selectedSemesterId, fn($q) =>
        $q->where('semester_id', $selectedSemesterId)
    ) 
    ->when($search, function ($q) use ($search) {
        $q->where(function ($query) use ($search) {
            $query->whereHas('studentSemesterProfile', function ($sub) use ($search) {
                $sub->where('roll_no', 'like', "%{$search}%");
            })
            ->orWhereHas('student', function ($sub) use ($search) {
                $sub->where('name_myan', 'like', "%{$search}%")
                    ->orWhere('name_eng', 'like', "%{$search}%");
            });
        });
    })
    ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('Students/Index', [
        'academicYears' => $academicYears,
        'selectedAcademicYearId' => $selectedAcademicYearId,
        'semesters' => $semesters,
        'selectedSemesterId' => $selectedSemesterId,  
        'enrollStudents' => $enrollStudents
    ]);
}



    public function enrollStudents(Request $request){
        $academicYears = AcademicYear::orderBy('start_date', 'desc')->get();

        $selectedAcademicYearId = $request->input('academic_year_id', $academicYears->first()->id);

        // Filter semesters based on academic year
        $semesters = Semester::where('academic_year_id', $selectedAcademicYearId)
            ->orderBy('start_date', 'desc')
            ->get();

        // Get selected semester (fallback to first semester in list)
        $selectedSemesterId = $request->input('semester_id', $semesters->first()->id ?? null);
        $enrollStudents = collect();
        if ($selectedSemesterId) {
            $enrollStudents = StudentEnrollment::with([
                    'student', 'studentSemesterProfile', 'semester', 'major', 'academicYear'
                ])
                ->where('semester_id', $selectedSemesterId)
                ->get();
        }
        // Fetch enrollments filtered by semester
        // $enrollStudents = StudentEnrollment::with(['student', 'studentSemesterProfile', 'semester', 'major', 'academicYear'])
        //     ->when($selectedSemesterId, fn ($q) => $q->where('semester_id', $selectedSemesterId))
        //     ->get();

        // return $enrollStudents;

        return Inertia::render('Students/EnrolledStudents', [
            'academicYears' => $academicYears,
            'selectedAcademicYearId' => $selectedAcademicYearId,
            'semesters' => $semesters,
            'selectedSemesterId' => $selectedSemesterId,
            'enrollStudents' => $enrollStudents,
        ]);
    }

    public function stuCourses( ){
   $enrollment = StudentEnrollment::with([
        'student.father',
        'student.mother', 
        'student.examsTaken',
        'studentSemesterProfile',
        'semester',
        'major',
        'academicYear'
    ])->findOrFail(5);

    return Inertia::render('Students/test', [
        'studentEnrollment' => $enrollment,
    ]);

    }

    public function create()
    { 
        $academic_years=AcademicYear::with('semesters')->get();
        $majors=Major::all();
        // dd ($academic_years);
    return Inertia::render('Students/Create', compact(['academic_years','majors']));
    }


        public function store(StudentRequest $request)
    {  

        DB::beginTransaction();

        try {
            // Create Student
            $file = $request->file('image');
            $filePath=$file->store('students','public');
            $student = Student::create([
                'name_myan'=>$request->name_myan,
                'name_eng'=>$request->name_eng,
                // 'academic_year'=>$request->academic_year,
                // 'semester_id'=>$request->semester_id,
                // 'major'=>$request->major,
                // 'roll_no'=>$request->roll_no,
                'uid'=> $request->uid,
                'entried_year'=>$request->entried_year, 
                'nrc_state'=>$request->nrc_state,
                'nrc_township'=>$request->nrc_township,
                'nrc_type'=>$request->nrc_type,
                'nrc_number'=>$request->nrc_number,
                'dob'=>$request->dob, 
                'gender'=>$request->gender, 
                'ethnicity'=>$request->ethnicity, 
                'religion'=>$request->religion, 
                'hometown'=>$request->hometown,
                'township_state_region'=>$request->township_state_region, 
                'local_foreign'=>$request->local_foreign,
                'matriculation_passed_year'=>$request->matriculation_passed_year,
                'matriculation_passed_roll_no'=>$request->matriculation_passed_roll_no,
                'examination_center'=>$request->examination_center,
                // 'permanent_address'=>$request->permanent_address,
                // 'temporary_address'=>$request->temporary_address,
                // 'phone'=>$request->phone, 
                // 'email'=>$request->email,
                // 'image'=>$filePath,
            ]);
            $studentProfile=StudentSemesterProfile::create([
                'student_id'=>$student->id,
                'academic_year_id'=> $request->academic_year_id,
                'semester_id'=>$request->semester_id,
                'major_id'=>$request->major_id,
                'roll_no'=>$request->roll_no,
                'permanent_address'=>$request->permanent_address,
                'temporary_address'=>$request->temporary_address,
                'phone'=>$request->phone,
                'email'=>$request->email,
                'image'=>$filePath,
            ]);

            $studentEnrollment=StudentEnrollment::create([
                'student_id'=>$student->id,
                'student_semester_profile_id'=>$studentProfile->id, 
                'semester_id'=>$request->semester_id, 
                'major_id'=>$request->major_id, 
                'academic_year_id'=>$request->academic_year_id,
                'registration_date'=>Carbon::now(),
                
            ]);


        $selectedSemesterId=$request->semester_id;
        $selectedMajorId=$request->major_id;
        $semester = Semester::with(['courses' => function ($query) use ($selectedMajorId) {
        if ($selectedMajorId) {
            $query->whereHas('majors', function ($q) use ($selectedMajorId) {
                $q->where('majors.id', $selectedMajorId);
            });
        }
    }])->findOrFail($selectedSemesterId);

           
            
            // stud course enrollment
            // foreach ($semester->courses as $course) {  
            //     StudentCourseEnrollment::create([
            //         'student_enrollment_id'=>$studentEnrollment->id, 
            //         'course_id'=>$course->id
            //     ]);
            // }

            // Create Father
            $father = Father::create([
                'student_id' => $student->id,
                'name_myan'=>$request->father_name_myan,
                'name_eng'=>$request->father_name_eng,
                'ethnicity'=>$request->father_ethnicity,
                'religion'=>$request->father_religion,
                'hometown'=>$request->father_hometown,
                'township_state_region'=>$request->father_township_state_region,
                'nrc_state'=>$request->nrc_state,
                'nrc_township'=>$request->nrc_township,
                'nrc_type'=>$request->nrc_type,
                'nrc_number'=>$request->nrc_number,
                'job'=>$request->father_job,
                'job_position_address'=>$request->father_job_position_address,
                'local_foreign'=>$request->father_local_foreign,
            ]);

            // Create Mother
            $mother = Mother::create([
                'student_id' => $student->id,
                'name_myan'=>$request->mother_name_myan,
                'name_eng'=>$request->mother_name_eng,
                'ethnicity'=>$request->mother_ethnicity,
                'religion'=>$request->mother_religion,
                'hometown'=>$request->mother_hometown,
                'township_state_region'=>$request->mother_township_state_region,
                'nrc_state'=>$request->nrc_state,
                'nrc_township'=>$request->nrc_township,
                'nrc_type'=>$request->nrc_type,
                'nrc_number'=>$request->nrc_number,
                'job'=>$request->mother_job,
                'job_position_address'=>$request->mother_job_position_address,
                'local_foreign'=>$request->mother_local_foreign,
            ]);

            // Donor table  
            $donor=Donor::create([
                'name'=>$request->donor_name,
                'relationship'=>$request->donor_relationship,
                'job'=>$request->donor_job, 
                'phone'=>$request->donor_phone,
                'status'=>$request->donor_status,
                'student_semester_profile_id'=>$studentProfile->id,
            ]);

            // create exams_taken 
            if($request->exam_records!== null){
            foreach ($request->exam_records as $record) { 
                              // Skip if any required field is null
        if (
            !empty($record['exam_name']) &&
            !empty($record['exam_major']) &&
            !empty($record['exam_roll_no']) &&
            !empty($record['exam_year']) &&
            isset($record['exam_pass_fail']) // could be 0 or 1, so use isset
        ) {
            ExamsTaken::create([
                'exam_name'   => $record['exam_name'],
                'major'       => $record['exam_major'],
                'roll_no'     => $record['exam_roll_no'],
                'year'        => $record['exam_year'],
                'pass_fail'   => $record['exam_pass_fail'],
                'student_id'  => $student->id,
            ]);
        }
            }
            }
            
            RegistrationAgreement::create([
                'student_semester_profile_id'=>$studentProfile->id,
                'name'=>$request->name,
                'gender'=>$request->gender,
                'examed_year'=>$request->examed_year,
                'examed_month'=>$request->examed_month,
                'examed_name'=>$request->examed_name,
                'examed_roll_no'=>$request->examed_roll_no,
                'examed_status'=>$request->examed_status,
                'class'=>$request->class,
                'fee'=>$request->fee,
                'guardian'=>$request->guardian,
                'nrc_state'=>$request->g_nrc_state,
                'nrc_township'=>$request->g_nrc_township,
                'nrc_type'=>$request->g_nrc_type,
                'nrc_number'=>$request->g_nrc_number,
                'agreed'=>$request->agreed,
            ]);
            
            // return Semester::with('courses')->get();
         $fullPath=$this->generateAndStorePdf($student->id,$request->semester_id);
            $studentEnrollment->update([
                'pdf_path'=>$fullPath
            ]);

            DB::commit();

            return redirect()->route('enroll-students.index')->with('success', 'Student registered successfully.');
        } catch (\Exception $e) {
            dd($e->getMessage());
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to register student. ' . $e->getMessage()])->withInput();
        }
    }

    private function generateAndStorePdf($studentId,$semesterId)
{
    $stuEnrollment = StudentEnrollment::with([
    'student.father',
    'student.mother',
    'studentSemesterProfile.donor',
    'student.examsTaken',
    'studentSemesterProfile',
    'student',
    'semester',
    'major',
    'academicYear',
    'studentSemesterProfile.registrationAgreement'
])
->where('student_id', $studentId)
->where('semester_id', $semesterId)
->firstOrFail();

//  dd($stuEnrollment->toArray());
// return view('pdfs.DownloadStudent', ['stuEnrollment' => $stuEnrollment]);
    // ✅ Prepare mPDF
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

    $html = view('pdfs.DownloadStudent', ['stuEnrollment' => $stuEnrollment])->render();
    $mpdf->WriteHTML($html);

    // ✅ Build storage path: storage/app/public/registration_forms/{student_id}/{year}.pdf
    $year = $stuEnrollment->academicYear->name ?? date('Y');
    $semester=$stuEnrollment->semester->name;  
    $studentName=$stuEnrollment->student->name_eng; 
    $folderPath = "registration_forms/{$stuEnrollment->student_id}/{$year}/{$semester}";
    $fileName = "{$studentName}.pdf";
    $fullPath = "{$folderPath}/{$fileName}";

    // ✅ Save PDF to storage
    Storage::disk('public')->put($fullPath, $mpdf->Output('', 'S'));



    // ✅ Save DB record
    // StudentEnrollment::updateOrCreate(
    //     [
    //         'i' => $stuEnrollment->student_id,
    //         'academic_year' => $year,
    //     ],
    //     [
    //         'pdf_path' => $fullPath
    //     ]
    // );

    return $fullPath;
    return response()->json([
        'message' => 'PDF generated and stored successfully',
        'path' => $fullPath,
        // 'url' => Storage::disk('public')->url($fullPath)
    ]);
}

}
