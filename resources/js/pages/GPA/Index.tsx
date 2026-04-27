import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from "@/layouts/app-layout";
import { getSemesterText } from '@/Utils/SemesterText';
import { Link, router } from "@inertiajs/react";
import { Eye, Printer } from 'lucide-react';

export default function Index({
    academicYears = [],
    majors = [],
    selectedMajorId = null,
    selectedAcademicYearId = null,
    semesters = [],
    selectedSemesterId = null,
    enrollStudents = [],
}) {


    // Filters handlers (same as before)
    const handleAcademicYearChange = (value) => {
        router.get(
            route('gpa.index'),
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
            route('gpa.index'),
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
            route('gpa.index'),
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


    return (<AppLayout
        breadcrumbs={[
            { name: "GPA များထုတ်ယူခြင်း" },
        ]}
    >
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
                    {selectedMajor.name} Major
                </h6>
            </div>
        )}



        <div className="rounded-xl border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40px] text-center">#</TableHead>
                        <TableHead className="min-w-[150px]">ကျောင်းသားအမည်</TableHead>
                        <TableHead className="min-w-[150px]">ခုံနံပါတ်</TableHead>
                        <TableHead className="min-w-[150px]">GPA</TableHead>
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
                            <TableCell>
                                <div className=''>
                                    <Link href={route("gpa-show", enroll.id)}>
                                        <Button variant="outline" size="sm" className="rounded-md bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100">
                                            <Eye className="mr-2" />
                                            GPA ကြည့်ရှုရန်
                                        </Button>
                                    </Link></div>
                                {/* <Link href={route("gpa-print", enroll.id)}>
                                    <Button variant="outline" size="sm" className="rounded-md ml-2 bg-green-50 border-green-300 text-green-700 hover:bg-green-100">
                                        <Printer className="mr-2" />
                                        GPA ထုတ်ယူရန်
                                    </Button>
                                </Link> */}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </AppLayout>);
}