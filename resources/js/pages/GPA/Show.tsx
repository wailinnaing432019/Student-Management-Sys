import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

import { getSemesterRoman, getSemesterText } from '@/Utils/SemesterText';
import { getGradeScore } from '@/Utils/GetGradeScore';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTranscriptDate, today } from '@/Utils/GetToday';
import { useState } from 'react';
import { toEnglishDigits } from '@/Utils/ChnageMyanToEngNum';

interface Course {
    id: number;
    name: string;
    code: string;
    is_elective: number | boolean;
    credit_unit: number;
}

interface StudentCourse {
    id: number;
    student_enrollment_id: number;
    course_id: number;
    course: Course;
    mark?: {
        id: number;
        mark: number;
        grade: string;
        remark: string;
        course_name: string;
        course_code: string;
        is_elective: number | boolean;
        credit_unit: number;
    };
}

interface Props {
    student_enrollment_id: number;
    student: { id: number; name: string; roll_no: string | null, major: string };
    semester: { semester_number: number; year_name_eng: string; academicYear: string };
    student_courses: StudentCourse[];
    semester_gpas: [];
    show_overall: boolean;
    overall_gpa: string;
    cumulative_gpa: string;
    is_final_year_s1: boolean;
    is_final_year_s2: boolean;
}

export default function Show({
    student_enrollment_id,
    student,
    semester,
    student_courses,
    semester_gpas,
    show_overall,
    overall_gpa,
    cumulative_gpa,
    is_final_year_s1,
    is_final_year_s2,
}: Props) {
    const data = {
        marks: student_courses.map((sc) => ({
            student_course_enrollment_id: sc.id,
            mark: sc.mark?.mark || '',
            grade: sc.mark?.grade || '',
            remark: sc.mark?.remark || '',
            course_name: sc.course.name,
            course_code: sc.course.code,
            is_elective: sc.course.is_elective,
            credit_unit: sc.course.credit_unit,
        })),
    };



    // for gpa



    // Grading scale data
    const gradingScale = [
        { mark: '90-100', letterGrade: 'A+', gradeScore: 4 },
        { mark: '80-89', letterGrade: 'A', gradeScore: 4 },
        { mark: '75-79', letterGrade: 'A-', gradeScore: 3.67 },
        { mark: '70-74', letterGrade: 'B+', gradeScore: 3.33 },
        { mark: '65-69', letterGrade: 'B', gradeScore: 3 },
        { mark: '60-64', letterGrade: 'B-', gradeScore: 2.67 },
        { mark: '55-59', letterGrade: 'C+', gradeScore: 2.33 },
        { mark: '50-54', letterGrade: 'C', gradeScore: 2 },
        { mark: '40-49', letterGrade: 'D', gradeScore: 1 },
        { mark: '<40', letterGrade: 'F', gradeScore: 0 },
    ];

    let totalCredit = 0;
    let totalPoint: number = 0;

    // props ထဲမှာ semester_gpas ပါလာမယ်
    // const gpas = Object.values(semester_gpas); // [3.95, 3.80] စသဖြင့် ရလာမယ်

    // let overallGPA = "0.00";

    // if (gpas.length === 2) {
    //     // Semester 1 နှင့် 2 ရှိလျှင် ပေါင်းပြီး ၂ နှင့်စား
    //     overallGPA = ((gpas[0] + gpas[1]) / 2).toFixed(2);
    // } else if (gpas.length === 1) {
    //     // Semester တစ်ခုတည်းရှိလျှင် ၎င်း GPA ကိုသာယူ
    //     overallGPA = "";
    // }
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    if (is_final_year_s1) {
        return (
            <AppLayout breadcrumbs={[{ name: "ဘာသာရပ်များ အတွက် အမှတ်များ သတ်မှတ်ခြင်း" }]}>
                <Head title="" />
                <div className="flex items-center justify-center min-h-[400px] text-center p-10 bg-white shadow rounded-lg">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Transcript Not Available</h2>
                        <p className="text-gray-600">
                            နောက်ဆုံးနှစ် အတွက် GPA ကို  <br />
                            Semester VII နှင့် VIII ဘာသာရပ်များအားလုံး စုပေါင်း၍ ထုတ်ပေးမည်ဖြစ်ပါသည်။
                        </p>
                        <p className="mt-4 font-semibold text-red-600">Semester VIII တွင်သာ GPA ကို ထုတ်ပေးမည်ဖြစ်ပါသည်။</p>
                        <button
                            onClick={() => window.history.back()}
                            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                            နောက်သို့ ပြန်သွားမည်
                        </button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // ၂။ အမှတ်စာရင်း လုံးဝမရှိသေးတဲ့ အခြေအနေ (Elective မရွေးရသေးတာ သို့မဟုတ် Mark မထည့်ရသေးတာ)
    if (!student_courses || student_courses.length === 0) {
        return (
            <AppLayout breadcrumbs={[{ name: "GPA ကြည့်ရှုရန်", href: '/gpa' }]}>
                <Head title=" " />
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 rounded-lg border border-red-200 p-10 text-center">
                    <div className="bg-red-100 p-3 rounded-full mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-700">အမှတ်စာရင်းများ မရှိသေးပါ</h2>
                    <p className="text-red-600 mt-2">
                        ဤကျောင်းသားအတွက် ဘာသာရပ်အလိုက် အမှတ် (Marks) များ ထည့်သွင်းထားခြင်း မရှိသေးပါ။ <br />
                        Transcript မထုတ်မီ အမှတ်များကို အရင်ဆုံး ထည့်သွင်းပေးပါ။
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        နောက်သို့ ပြန်သွားမည်
                    </button>
                </div>
            </AppLayout>
        );
    }
    return (
        <AppLayout breadcrumbs={[{ name: "GPA ကြည့်ရှုရန်", href: '/gpa' }, { name: student.name }]}>
            <Head title="Assign Marks" />
            <div className="fixed bottom-10 right-10 print:hidden">
                <div className='mb-3'>
                    {/* selectedDate ကို query string အနေနဲ့ ပို့လိုက်မယ် */}
                    <a href={route("gpa-print", {
                        id: student_enrollment_id,
                        issue_date: selectedDate
                    })}>
                        <Button variant="outline" size="lg" className="w-full bg-blue-600 text-white px-6 p-6 rounded-full shadow-lg hover:bg-blue-700 transition">
                            <Printer className="" />
                        </Button>
                    </a>
                </div>
            </div>
            <div className="text-center space-y-2  font-semibold">
                <h5 className="text-md      ">University Of Computer Studies (Meiktila)</h5>
                <h5 className="text-md ">
                    {toEnglishDigits(semester.academicYear)} Academic Year, {semester.year_name_eng}
                </h5>
                <h5 className='text-md'>Academic Record</h5>
            </div>
            <div className='text-md'>
                <div className="bg-white p-8 min max-w-7xl mx-auto font-sans   print:p-0 print:m-0 print:w-full">
                    {/* Header Section */}
                    <div className="flex flex-wrap   gap-x-24 gap-y-1 mb-8">
                        <div className="flex-1 min-w-[300px]">
                            <div className="flex leading-tight">
                                <span className="w-[140px]">Roll No</span>
                                <span>: <span className="">{student.roll_no ?? 'N/A'}</span></span>
                            </div>
                            <div className="flex leading-tight">
                                <span className="w-[140px]">Student Name</span>
                                <span>: <span className="">{student.name}</span></span>
                            </div>
                            <div className="flex leading-tight">
                                <span className="w-[140px]">Degree Program</span>
                                <span>: <span className="">{student.major == 'CST' ? 'B.C.Sc./B.C.Tech.' : student.major == 'CS' ? "B.C.Sc." : "B.C.Tech."}</span></span>
                            </div>
                            <div className="flex leading-tight">
                                <span className="w-[140px]">Academic Year</span>
                                <span>: <span className="">{toEnglishDigits(semester.academicYear)}</span></span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-[300px] mt-10">
                            <div className="flex leading-tight">
                                <span className="w-[140px]">Specialization</span>
                                <span>: <span className="">{student.major == 'CST' ? 'N/A' : student.major}</span></span>
                            </div>
                            <div className="flex leading-tight">
                                <span className="w-[140px]">Semester</span>
                                <span>: <span className="">{is_final_year_s2 ? 'VII & VIII' : getSemesterRoman(semester.semester_number)}</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Main Grades Table */}
                    <table className="w-full border-collapse border border-gray-900 mb-6 text-center">
                        <thead>
                            <tr className="[&>th]:border [&>th]:border-gray-900 [&>th]:px-2 [&>th]:py-1 [&>th]:font-normal">
                                <th className="w-[5%]">Sr.</th>
                                <th className="w-[45%]">Course Name</th>
                                <th className="w-[12.5%]">Academic<br />Credit<br />Unit</th>
                                <th className="w-[12.5%]">Grade<br />Obtained</th>
                                <th className="w-[12.5%]">Grade<br />Score</th>
                                <th className="w-[12.5%]">Grade<br />Point</th>
                            </tr>
                        </thead>
                        <tbody className="[&>tr>td]:border [&>tr>td]:border-gray-900 [&>tr>td]:px-2 [&>tr>td]:py-1">

                            {data.marks.map((sc, index) => {

                                // Grade Score ကို တွက်ယူခြင်း
                                const gradeScore = getGradeScore(sc.grade);

                                // Grade Point ကို တွက်ယူခြင်း (Credit Unit * Grade Score)
                                // .toFixed(2) က ဒသမ ၂ နေရာအထိ ဖြတ်ပေးဖို့ပါ
                                const gradePoint = (sc.credit_unit * gradeScore).toFixed(2);

                                totalCredit += parseFloat(String(sc.credit_unit));

                                totalPoint += parseFloat(gradePoint);
                                return <tr key={sc.student_course_enrollment_id}>
                                    <td>{index + 1}</td>
                                    <td className="text-left"><span className="">{sc.course_name}</span></td>
                                    <td className="">{sc.credit_unit}</td>
                                    <td className="">{sc.grade}</td>
                                    <td className="">{gradeScore}</td>
                                    <td className="">{gradePoint}</td>
                                </tr>
                            }
                            )}
                            {/* Summary rows */}
                            <tr className="">
                                <td colSpan={2} className="border-t-0 text-left px-2 py-1">Total Academic Credit Unit Earned</td>
                                <td className=" font-medium px-2 py-1">{totalCredit}</td>
                                <td className="text-left px-2 py-1" colSpan={2}>Toal Grade Point</td>
                                <td className=" font-medium px-2 py-1">{(totalPoint).toFixed(2)}</td>
                            </tr>
                            <tr className="">
                                <td colSpan={3} className="border-t-0 px-2 py-1"></td>
                                <td colSpan={2} className="text-left px-2 py-1">Cumulative GPA</td>
                                <td className=" font-medium px-2 py-1">{cumulative_gpa}</td>
                            </tr>
                            <tr className="">
                                <td colSpan={3} className="border-t-0 px-2 py-1"></td>
                                <td colSpan={2} className="text-left px-2 py-1">Overall GPA</td>
                                <td className="px-2 py-1">{show_overall ? overall_gpa : null}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Grading Scale Section */}
                    <div className="mb-10 max-w-lg">
                        <h3 className=" font-normal tracking-wide leading-tight mb-2">
                            GRADING SCALE
                        </h3>
                        <table className="w-full  leading-tight">
                            <thead>
                                <tr className="font-normal [&>th]:font-normal [&>th]:pb-2">
                                    <th className="text-left w-1/3">MARK</th>
                                    <th className="text-center w-1/3">LETTER GRADE</th>
                                    <th className="text-center w-1/3">GRADE SCORE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gradingScale.map((scale, index) => (
                                    <tr key={index}>
                                        <td className="text-left">{scale.mark}</td>
                                        <td className="text-center">{scale.letterGrade}</td>
                                        <td className="text-center">{scale.gradeScore}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Date and Signature */}
                    <div className="mt-12 text-md">
                        <div>
                            ISSUE DATE: <span className="">{formatTranscriptDate(selectedDate)}</span>
                        </div>

                        <div className="mt-16 text-center leading-tight max-w-sm ml-auto mr-12 print:mr-0">
                            <p className="font-medium">REGISTRAR</p>
                            <p>Academic Department</p>
                            <p>University of Computer Studies (Meiktila)</p>
                        </div>
                    </div>
                    <div className="mb-4 p-4 bg-blue-50 rounded print:hidden no-print">
                        <label className="block text-sm font-medium mb-1">Issue Date ရွေးချယ်ရန်:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border rounded px-3 py-2 text-black"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
