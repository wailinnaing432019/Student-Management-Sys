import React from 'react';
import { Head } from '@inertiajs/react';
import { getSemesterRoman, getSemesterText } from '@/Utils/SemesterText';
import { getGradeScore } from '@/Utils/GetGradeScore';
import { Button } from '@/components/ui/button';
import { Eye, Link } from 'lucide-react';
import { formatTranscriptDate, today } from '@/Utils/GetToday';
import { toEnglishDigits } from '@/Utils/ChnageMyanToEngNum';

// Types define လုပ်ခြင်း
interface Props {
    student: { name: string; roll_no: string | null; major: string };
    semester: { semester_number: number; year_name_eng: string; academicYear: string };
    student_courses: any[];
    student_enrollment_id: string;
    issue_date: string;
    show_overall: boolean;
    overall_gpa: string;
    cumulative_gpa: string;
    is_final_year_s1: boolean;
    is_final_year_s2: boolean;
}

export default function A4Transcript({ student, semester, student_courses, student_enrollment_id, issue_date, show_overall,
    overall_gpa,
    cumulative_gpa,
    is_final_year_s1,
    is_final_year_s2, }: Props) {

    // Data processing
    const marks = student_courses.map(sc => {
        const grade = sc.mark?.grade || '';
        const score = getGradeScore(grade);
        const credit = Number(sc.course.credit_unit) || 0;
        return {
            id: sc.id,
            name: sc.course.name,
            credit: credit,
            grade: grade,
            score: score,
            point: (credit * score).toFixed(2)
        };
    });

    const totalCredit = marks.reduce((sum, item) => sum + item.credit, 0);
    const totalPoint = marks.reduce((sum, item) => sum + parseFloat(item.point), 0).toFixed(2);
    const gpa = totalCredit > 0 ? (parseFloat(totalPoint) / totalCredit).toFixed(2) : "0.00";

    return (
        <div className="min-h-screen bg-gray-100 py-10 print:p-0 print:bg-white">

            <Head title={`Transcript - ${student.name}`} />

            {/* Print Logic: Navbar တွေ Sidebar တွေကို အတင်းဖျောက်ပြီး layout ပြင်တဲ့ CSS */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    /* Layout တခုလုံးရှိ မလိုအပ်သော components များဖျောက်ရန် */
                    nav, aside, header, footer, button, .print-hidden { 
                        display: none !important; 
                    }
                    
                    table, tr, td, th {
        page-break-inside: avoid !important;
    }
                    /* Main container များကို screen အပြည့်ယူစေရန် */
                    body, html, main, #app, .min-h-screen {
                        background: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        height: auto !important; 
                    }

                    /* A4 Size သတ်မှတ်ချက် */
                    @page {
                        size: A4; 
                        margin-left: 20mm; /* စာရွက်ဘေးဘောင် margin */
                        margin-right:15mm;
                        margin-top:10mm;
                    }

                    .a4-container {
                        box-shadow: none !important; 
                        margin: 0 !important;
                        width: 100% !important;
                        max-width: none !important;
                        padding: 0 !important;
                        page-break-inside: avoid;
        break-inside: avoid;
                    }
                }
            `}} />

            {/* A4 Paper Wrapper */}
            <div className="a4-container mx-auto  bg-white p-[10mm] shadow-2xl w-[210mm] h-[297mm] overflow-hidden text-sm print:shadow-none print:w-full print:h-auto">

                <div className="text-center mb-4 space-y-2  text-[13px] font-semibold ">
                    <h4 className="">University Of Computer Studies (Meiktila)</h4>
                    <p className="  ">
                        {toEnglishDigits(semester.academicYear)} Academic Year, {semester.year_name_eng}
                    </p>
                    <h5 className=''>Academic Record</h5>
                </div>
                {/* Header Information */}
                <div className="flex justify-between mb-4   text-[13px]">
                    <div className="space-y-1">
                        <div className="flex"><span className="w-32">Roll No</span>: <span className=" ml-1">{student.roll_no}</span></div>
                        <div className="flex"><span className="w-32">Student Name</span>: <span className=" ml-1">{student.name}</span></div>
                        <div className="flex"><span className="w-32">Degree Program</span>:
                            <span className=" ml-1">
                                {student.major === 'CST' ? 'B.C.Sc./B.C.Tech.' : (student.major === 'CS' ? 'B.C.Sc.' : 'B.C.Tech.')}
                            </span>
                        </div>
                        <div className="flex"><span className="w-32">Academic Year</span>: <span className=" ml-1">{toEnglishDigits(semester.academicYear)}</span></div>
                    </div>
                    <div className="space-y-1 mt-12 mr-6">
                        <div className="flex"><span className="w-32">Specialization</span>: <span className=" ml-1">{student.major === 'CST' ? 'N/A' : student.major}</span></div>
                        <div className="flex"><span className="w-32">Semester</span>: <span className=" ml-1">{is_final_year_s2 ? 'VII & VIII' : getSemesterRoman(semester.semester_number)}</span></div>
                    </div>
                </div>

                {/* Table Section */}
                <table className="  border-collapse border  border-black  text-[13px]">
                    <thead>
                        <tr className="[&>th]:border [&>th]:border-black [&>th]:py-2 [&>th]:px-1 [&>th]:font-normal text-center bg-gray-50 print:bg-transparent">
                            <th className="w-[5%]">Sr.</th>
                            <th className="w-[45%]">Course Name</th>
                            <th className="w-[12.5%] text-xs">Academic Credit Unit</th>
                            <th className="w-[12.5%] text-xs">Grade Obtained</th>
                            <th className="w-[12.5%] text-xs">Grade <br /> Score</th>
                            <th className="w-[12.5%] text-xs">Grade <br /> Point</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {marks.map((item, index) => (
                            <tr key={item.id} className="[&>td]:border [&>td]:border-black [&>td]:py-1.5">
                                <td>{index + 1}</td>
                                <td className="text-left px-3 ">{item.name}</td>
                                <td className="">{item.credit}</td>
                                <td className="">{item.grade}</td>
                                <td className="">{item.score}</td>
                                <td className="">{item.point}</td>
                            </tr>
                        ))}
                        {/* Summary Footer */}
                        <tr className="[&>td]:border [&>td]:border-black [&>td]:py-1.5">
                            <td colSpan={2} className="text-left px-3">Total Academic Credit Unit Earned</td>
                            <td className="">{totalCredit}</td>
                            <td colSpan={2} className="text-left px-3 border-l-0">Total Grade Point</td>
                            <td className="">{totalPoint}</td>
                        </tr>
                        <tr className="[&>td]:border [&>td]:border-black [&>td]:py-1.5">
                            <td colSpan={3} className="border-y-0"></td>
                            <td colSpan={2} className="text-left px-3">Cumulative GPA</td>
                            <td className="">{gpa}</td>
                        </tr>
                        <tr className="[&>td]:border [&>td]:border-black [&>td]:py-1.5">
                            <td colSpan={3} className="border-t-0"></td>
                            <td colSpan={2} className="text-left px-3">Overall GPA</td>
                            <td>{show_overall ? overall_gpa : ''}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Grading Scale & Footer */}
                <div className="flex justify-between items-start mt-8  text-[13px]">
                    <div className="w-1/2">
                        <h4 className="  mb-2 text-sm">GRADING SCALE</h4>
                        <table className="w-full text-[12px] leading-tight">
                            <thead>
                                <tr className="text-left [&>th]:font-normal">
                                    <th>MARK</th>
                                    <th className="text-center">LETTER GRADE</th>
                                    <th className="text-center">GRADE SCORE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { m: '90-100', l: 'A+', s: '4' },
                                    { m: '80-89', l: 'A', s: '4' },
                                    { m: '75-79', l: 'A-', s: '3.67' },
                                    { m: '70-74', l: 'B+', s: '3.33' },
                                    { m: '65-69', l: 'B', s: '3' },
                                    { m: '60-64', l: 'B-', s: '2.67' },
                                    { m: '55-59', l: 'C+', s: '2.33' },
                                    { m: '50-54', l: 'C', s: '2' },
                                    { m: '40-49', l: 'D', s: '1' },
                                    { m: '<40', l: 'F', s: '0' },
                                ].map((row, i) => (
                                    <tr key={i} className='[&>td]:py-0.5'>
                                        <td>{row.m}</td>
                                        <td className="text-center">{row.l}</td>
                                        <td className="text-center">{row.s}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                </div>
                <div className="text-left pt-2 pr-4  text-[13px]" >
                    <p className="mt-8 text-sm">ISSUE DATE: <span className="">{formatTranscriptDate(issue_date)}</span></p>

                </div>
                <div className="mt-8 text-[13px] text-center leading-tight max-w-sm ml-auto mr-0 print:mr-0">
                    <p className="font-medium">REGISTRAR</p>
                    <p>Academic Department</p>
                    <p>University of Computer Studies (Meiktila)</p>
                </div>

            </div>

            {/* Print Button (Screen မှာပဲ မြင်ရမယ်) */}
            <div className="fixed bottom-10 right-10 print:hidden">
                <div className='mb-3'>
                    <a href={route("gpa-show", student_enrollment_id)}>
                        <Button variant="outline" size="sm" className="bg-yellow-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-yellow-700 transition">
                            <Eye className="mr-2" />
                            Go Back
                        </Button>
                    </a>
                </div>
                <div>
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
                    >
                        Print Transcript (A4)
                    </button>
                </div>
            </div>
        </div>
    );
}