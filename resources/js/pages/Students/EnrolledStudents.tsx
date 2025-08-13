import { Head, Link, router, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { DataTable } from "./data-table" // your wrapper component
import { columns, getColumns } from "./columns" // adjust path if needed
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { SharedData } from "@/types"
import { getSemesterText } from "@/Utils/SemesterText"


export default function EnrolledStudents({
    academicYears,
    selectedAcademicYearId,
    semesters,
    selectedSemesterId,
    enrollStudents,
    selectedMajorId,
    majors,
    filters = {},
}) {
    const [search, setSearch] = useState(filters.search ?? "")
    const [selected_majorId, setSelectedMajorId] = useState(selectedMajorId);


    const handleAcademicYearChange = (value) => {
        router.get(route("enroll-students.index"), {
            academic_year_id: value,
            // semester_id: selectedSemesterId,
            major_id: selectedMajorId,
        }, {
            preserveState: true,
            replace: true,
        })
    }

    const handleSemesterChange = (value) => {
        router.get(route("enroll-students.index"), {
            academic_year_id: selectedAcademicYearId,
            semester_id: value,
            major_id: selectedMajorId,
        }, {
            preserveState: true,
            replace: true,
        })
    }

    // Change major filter and reload page with filters
    const handleMajorChange = (value) => {
        setSelectedMajorId(Number(value));
        router.get(
            route("enroll-students.index"),
            { semester_id: selectedSemesterId, major_id: value, academic_year_id: selectedAcademicYearId },
            { preserveState: true }
        );
    };

    const { auth } = usePage<SharedData>().props;

    const userRole = auth?.user?.role || 'staff';
    const enrolledStudentColumns = getColumns(selectedAcademicYearId, selectedSemesterId, selectedMajorId, userRole);


    return (
        <AppLayout breadcrumbs={[{ name: "ကျောင်းအပ်ပြီးသားကျောင်းသားများ" }]}>
            <Head title="ကျောင်းသားများ" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-end items-center mb-6">
                    {/* <h1 className="text-2xl font-semibold">ကျောင်းသားများ</h1> */}
                    <Link href={route('enroll-students.create')}>
                        <Button>ကျောင်းသားအသစ်ထည့်မည်</Button>
                    </Link>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end ">
                    <div className="space-y-1 no-print">
                        <label className="text-sm font-medium  ">ပညာသင်နှစ်</label>
                        <Select value={String(selectedAcademicYearId)} onValueChange={handleAcademicYearChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="ပညာသင်နှစ် ရွေးပါ" />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYears.map((year) => (
                                    <SelectItem key={year.id} value={String(year.id)}>
                                        {year.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">သင်တန်းကာလ</label>
                        <Select value={String(selectedSemesterId)} onValueChange={handleSemesterChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="သင်တန်းကာလ ရွေးပါ" />
                            </SelectTrigger>
                            <SelectContent>
                                {semesters.map((semester) => (
                                    <SelectItem key={semester.id} value={String(semester.id)}>
                                        {semester.year_name} - {getSemesterText(semester.semester_number)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Major filter */}
                    <div>
                        <Label>အထူးပြုဘာသာရပ်</Label>
                        <Select value={String(selectedMajorId)} onValueChange={handleMajorChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="အဓိကဘာသာရပ် ရွေးပါ" />
                            </SelectTrigger>
                            <SelectContent>
                                {majors.map((major) => (
                                    <SelectItem key={major.id} value={String(major.id)}>
                                        {major.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-xl border   shadow-sm">
                    <DataTable columns={enrolledStudentColumns} data={enrollStudents} />
                </div>
            </div>
        </AppLayout>
    )
}