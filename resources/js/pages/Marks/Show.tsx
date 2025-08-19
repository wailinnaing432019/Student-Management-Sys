import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import { LucideEye, PencilIcon, PenIcon, ScanEye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getSemesterText } from '@/Utils/SemesterText';

function downloadAllMarksAsCSV(data, courseList) {
    const headers = ['No', 'Student Name', 'Roll No', ...courseList];

    const rows = data.map((enroll, index) => {
        const name = enroll.student.name_eng;
        const rollNo = enroll.student_semester_profile.roll_no;

        const marks = courseList.map((code) => {
            const studentCourse = enroll.student_courses.find(
                (sc) => sc.course.code === code
            );
            return studentCourse?.mark?.mark ?? '';
        });

        return [index + 1, name, rollNo, ...marks];
    });

    const csvContent = [headers, ...rows]
        .map((row) => row.map((val) => `"${val}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_marks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
export default function EnrolledStudents({
    academicYears = [],
    majors = [],
    selectedMajorId = null,
    selectedAcademicYearId = null,
    semesters = [],
    selectedSemesterId = null,
    enrollStudents = [],
}) {
    // Unique course codes
    const courseSet = new Set();
    enrollStudents.forEach((enroll) => {
        enroll.student_courses?.forEach((sc) => {
            if (sc.course?.code) courseSet.add(sc.course.code);
        });
    });
    const courseList = Array.from(courseSet);

    // Marks and grades state keyed by student_course_enrollment_id
    const [marks, setMarks] = useState({});
    const [grades, setGrades] = useState({});

    useEffect(() => {
        const initialMarks = {};
        const initialGrades = {};
        enrollStudents.forEach((enroll) => {
            enroll.student_courses?.forEach((sc) => {
                initialMarks[sc.id] = sc.mark?.mark ?? '';
                initialGrades[sc.id] = sc.mark?.grade ?? '';
            });
        });
        setMarks(initialMarks);
        setGrades(initialGrades);
    }, [enrollStudents]);

    // Handle mark input change
    const handleInputChange = (id, value) => {
        setMarks((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = Object.entries(marks).map(([id, mark]) => ({
            student_course_enrollment_id: parseInt(id, 10),
            mark: mark === '' ? null : Number(mark),
        }));

        router.post(route('marks.store'), { marks: payload }, { preserveScroll: true });
    };

    // Filters handlers (same as before)
    const handleAcademicYearChange = (value) => {
        router.get(
            route('studentMarks.show'),
            {
                academic_year_id: value,
                semester_id: selectedSemesterId,
                major_id: selectedMajorId,
            },
            { preserveState: true }
        );
    };

    const handleMajorChange = (value) => {
        router.get(
            route('studentMarks.show'),
            {
                academic_year_id: selectedAcademicYearId,
                semester_id: selectedSemesterId,
                major_id: value,
            },
            { preserveState: true }
        );
    };

    const handleSemesterChange = (value) => {
        router.get(
            route('studentMarks.show'),
            {
                academic_year_id: selectedAcademicYearId,
                semester_id: value,
                major_id: selectedMajorId,
            },
            { preserveState: true }
        );
    };

    const breadcrumbs = [{ name: 'ကျောင်းသားများ၏ အမှတ်များ' }];

    const selectedAcademicYear = academicYears.find(y => y.id === Number(selectedAcademicYearId));
    const selectedSemester = semesters.find(s => s.id === Number(selectedSemesterId));
    const selectedMajor = majors.find(m => m.id === Number(selectedMajorId));


    // const tableTitleAcademicYear = `${selectedAcademicYear?.name ?? ''}  / ${selectedSemester?.name ?? ''} / ${selectedMajor?.name ?? ''} အမှတ်များ`;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ကျောင်းသားများ၏ အမှတ်များ" />

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end print-area">
                <div className="space-y-1 no-print">
                    <label className="text-sm font-medium text-gray-700">ပညာသင်နှစ်</label>
                    <Select
                        value={String(selectedAcademicYearId ?? '')}
                        onValueChange={handleAcademicYearChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="ပညာသင်နှစ် ရွေးချယ်ပါ" />
                        </SelectTrigger>
                        <SelectContent>
                            {academicYears.length > 0 ? (
                                academicYears.map((year) => (
                                    <SelectItem key={year.id} value={String(year.id)}>
                                        {year.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-gray-500 text-sm">
                                    ပညာသင်နှစ်များ မရှိသေးပါ။
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1 no-print">
                    <label className="text-sm font-medium text-gray-700">သင်တန်းကာလ</label>
                    <Select
                        value={String(selectedSemesterId ?? '')}
                        onValueChange={handleSemesterChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="သင်တန်းကာလ ရွေးချယ်ပါ" />
                        </SelectTrigger>
                        <SelectContent>
                            {semesters.length > 0 ? (
                                semesters.map((semester) => (
                                    <SelectItem key={semester.id} value={String(semester.id)}>
                                        {semester.year_name} - {getSemesterText(semester.semester_number)}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-gray-500 text-sm">
                                    သင်တန်းကာလများ မရှိသေးပါ။
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1 no-print">
                    <label className="text-sm font-medium text-gray-700">အထူးပြုဘာသာ</label>
                    <Select
                        value={String(selectedMajorId ?? '')}
                        onValueChange={handleMajorChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="အထူးပြုဘာသာ" />
                        </SelectTrigger>
                        <SelectContent>
                            {majors.length > 0 ? (
                                majors.map((major) => (
                                    <SelectItem key={major.id} value={String(major.id)}>
                                        {major.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-gray-500 text-sm">
                                    အထူးပြုဘာသာရပ်များ မရှိသေးပါ။
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full no-print space-y-2">
                    <label className="text-sm font-medium text-gray-700">ကြည့်ရှုရန်</label>
                    <Select
                        onValueChange={(value) => {
                            const params = new URLSearchParams({
                                academic_year_id: String(selectedAcademicYearId ?? ''),
                                semester_id: String(selectedSemesterId ?? ''),
                                major_id: String(selectedMajorId ?? ''),
                            });

                            if (value === 'marks') {
                                params.set('viewBy', 'marks');
                                window.open(route('marksBySemester.view') + '?' + params.toString(), '_blank');
                            } else if (value === 'grade') {
                                params.set('viewBy', 'grade');
                                window.open(route('marksBySemester.view') + '?' + params.toString(), '_blank');
                            } else if (value === 'csv') {
                                downloadAllMarksAsCSV(enrollStudents, courseList);
                            }
                        }}
                        defaultValue=""
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="ရွေးချယ်ပါ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="marks">အမှတ်များဖြင့် ကြည့်မည်</SelectItem>
                            <SelectItem value="grade">Grade ကြည့်မည်</SelectItem>
                            <SelectItem value="csv">Excel File ဒေါင်းလုပ်မည်</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            </div>

            {(selectedAcademicYear || selectedSemester || selectedMajor) && (
                <div className='justify-center mx-auto text-center'>
                    <h2 className="text-lg font-semibold  text-center ">
                        {selectedAcademicYear?.name} ပညာသင်နှစ်
                    </h2>
                    <h5 className="text-lg font-semibold  text-center ">
                        {selectedSemester?.year_name}    {selectedSemester && "-" + getSemesterText(selectedSemester?.semester_number)}
                    </h5>
                    <h6 className="text-lg font-semibold  text-center ">
                        {selectedMajor.name} ၏ ရမှတ်များ
                    </h6>
                </div>
            )}

            {/* Editable Marks Table */}
            <form onSubmit={handleSubmit}>
                <div className="rounded-xl border shadow-sm overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40px] text-center">#</TableHead>
                                <TableHead className="min-w-[150px]">ကျောင်းသားအမည်</TableHead>
                                <TableHead className="min-w-[150px]">ခုံနံပါတ်</TableHead>
                                {courseList.map((courseCode, index) => (
                                    <TableHead
                                        key={index}
                                        className="text-center whitespace-nowrap"
                                    >
                                        {courseCode}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {enrollStudents.map((enroll, rowIndex) => (
                                <TableRow key={enroll.id} className="hover:bg-gray-50">
                                    <TableCell className="text-center">{rowIndex + 1}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div>{enroll.student.name_myan}</div>
                                        <div className="text-xs text-gray-500">{enroll.student.uid}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className=" ">{enroll.student_semester_profile.roll_no}</div>
                                    </TableCell>
                                    {courseList.map((courseCode, i) => {
                                        const studentCourse = enroll.student_courses?.find(
                                            (sc) => sc.course.code === courseCode
                                        );

                                        const markValue = studentCourse
                                            ? marks[studentCourse.id] ?? ''
                                            : null;

                                        return (
                                            <TableCell key={i} className="text-center">
                                                {studentCourse ? (
                                                    <div className="flex flex-col items-center">
                                                        {/* <Input
                                                            type="number"
                                                            className="w-20 print:border-none print:outline-none print:shadow-none print:ring-0 print:bg-transparent"
                                                            value={markValue}
                                                            onChange={(e) =>
                                                                handleInputChange(studentCourse.id, e.target.value)
                                                            }
                                                            min={0}
                                                            max={100}
                                                            step={1}
                                                        /> */}
                                                        <div>
                                                            {markValue}
                                                        </div>
                                                        <div className="text-xs mt-1 text-gray-600">
                                                            Grade: {grades[studentCourse.id] ?? '-'}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    '—'
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell className=''>
                                        <div className='flex gap-3 text-sm items-center justify-center not-print'>
                                            {/* Check if any course mark is missing */}
                                            {courseList.some((courseCode) => {
                                                const studentCourse = enroll.student_courses?.find(
                                                    (sc) => sc.course.code === courseCode
                                                );
                                                return studentCourse?.mark?.mark || studentCourse?.mark?.mark === 0;
                                            }) ? (

                                                <PencilIcon
                                                    className="text-gray-400 cursor-not-allowed"
                                                    title="All marks already assigned"
                                                />
                                            ) : (
                                                <Link href={route("assign-marks", enroll.id)} title="Assign Marks">
                                                    <PencilIcon className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                                                </Link>
                                            )}
                                            <a href={route("marks.show", enroll.id)} title="View Marks" target='_blank'>
                                                <LucideEye className="text-gray-600 hover:text-black" />
                                            </a>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* <div className="mt-6 no-print">
                    <Button type="submit">Save All Marks</Button>
                </div> */}
            </form>
        </AppLayout>
    );
}
