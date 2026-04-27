import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CreateCourseDialog from "../Courses/CreateCourseDialog";
import { useState } from "react";
import { getSemesterText } from "@/Utils/SemesterText";
import { toast } from "sonner";


type Course = {
    id: number;
    name: string;
    code: string;
    majors: { id: number; name: string }[]; // pivot structure
};

type Semester = {
    id: number;
    semester_number: number;
    year_name: string;
};

type Major = {
    id: number;
    name: string;
};

type AcademicYear = {
    id: number;
    name: string;
    semesters: Semester[];
};

type Props = {
    academicYears: AcademicYear[];
    courses: Course[];
    majors: Major[];
    courseSemesterMap: Record<number, Record<number, Record<number, { is_elective: boolean; credit_unit: number | null }>>>;
};

export default function Create({
    academicYears,
    courses,
    majors,
    courseSemesterMap,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        academic_year_id: "",
        major_id: "",
        semester_id: "",
        courses: [] as { id: number; is_elective: boolean; credit_unit: number | null }[],
    });
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const selectedYear = academicYears.find((y) => String(y.id) === data.academic_year_id);
        if (selectedYear && selectedYear.semesters.length > 0) {
            setData("semester_id", String(selectedYear.semesters[0].id));
        }
    }, [data.academic_year_id]);

    useEffect(() => {
        const semesterCourses = courseSemesterMap?.[data.semester_id];
        if (semesterCourses) {
            const assigned = Object.entries(semesterCourses).map(
                ([courseId, info]) => ({
                    id: parseInt(courseId),
                    is_elective: info.is_elective,
                    credit_unit: info.credit_unit ?? null,
                })
            );
            setData("courses", assigned);
        } else {
            setData("courses", []);
        }
    }, [data.semester_id]);

    const isCourseSelected = (id: number) => {
        return Array.isArray(data.courses) && data.courses.some((c) => c.id === id);
    };

    const handleCourseToggle = (id: number) => {
        const currentCourses = data.courses ?? [];
        if (currentCourses.some((c) => c.id === id)) {
            setData("courses", currentCourses.filter((c) => c.id !== id));
        } else {
            setData("courses", [...currentCourses, { id, is_elective: false, credit_unit: null }]);
        }
    };

    const updateCreditUnit = (id: number, value: string) => {
        const currentCourses = data.courses ?? [];

        setData(
            "courses",
            currentCourses.map((c) =>
                c.id === id ? { ...c, credit_unit: value } : c
            )
        );
    };
    const toggleElective = (id: number) => {
        const currentCourses = data.courses ?? [];
        setData(
            "courses",
            currentCourses.map((c) =>
                c.id === id ? { ...c, is_elective: !c.is_elective } : c
            )
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const missingCredit = data.courses.some(
            (course) => course.credit_unit === null || course.credit_unit === ""
        );

        if (missingCredit) {
            toast.error("ရွေးထားသော ဘာသာရပ်များအတွက် Credit Unit မဖြစ်မနေ ထည့်ပေးပါ။");
            return;
        }
        post(route("course-semesters.store"));
    };

    // 🔍 Filter courses by selected major
    const filteredCourses = courses
        .filter((course) => {
            // If no major selected or 'all' selected, include all courses
            if (!data.major_id || data.major_id === "all") return true;
            // Otherwise, filter by major
            return course.majors.some((m) => String(m.id) === data.major_id);
        })
        .filter((course) =>
            course.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
    return (
        <AppLayout
            breadcrumbs={[
                { name: "သင်တန်းကာလများ အလိုက် ဘာသာရပ်များ", href: "/course-semesters" },
                { name: "သင်တန်းကာလများ အတွက်  ဘာသာရပ်များ သတ်မှတ်ခြင်း" },
            ]}
        >
            <Head title="Assign Courses to Semester and Major" />
            <CreateCourseDialog majors={majors} redirect="course-semesters.create" />
            <form onSubmit={submit} className="space-y-6 w-4/5 mx-auto p-6">
                <Card>
                    <CardContent className="space-y-4 pt-6">
                        {/* Academic Year */}
                        <div>
                            <Label>ပညာသင်နှစ် ရွေးချယ်ပါ</Label>
                            <Select
                                value={data.academic_year_id}
                                onValueChange={(value) => setData("academic_year_id", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="ပညာသင်နှစ် ရွေးချယ်ပါ" />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears.length > 0 ? academicYears.map((year) => (
                                        <SelectItem key={year.id} value={String(year.id)}>
                                            {year.name}
                                        </SelectItem>
                                    )) : (
                                        <div className="px-4 py-2 text-gray-500 text-sm">ပညာသင်နှစ်များ မရှိသေးပါ။</div>
                                    )}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.academic_year_id} />
                        </div>

                        {/* Semester */}
                        <div>
                            <Label>သင်တန်းကာလ ‌ရွေးချယ်ပါ</Label>
                            <Select
                                value={data.semester_id}
                                onValueChange={(value) => setData("semester_id", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="သင်တန်းကာလ ‌ရွေးချယ်ပါ" />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears
                                        .find((year) => String(year.id) === data.academic_year_id)
                                        ?.semesters.map((sem) => (
                                            <SelectItem key={sem.id} value={String(sem.id)}>
                                                {getSemesterText(sem.semester_number)} - {sem.year_name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.semester_id} />
                        </div>

                        {/* Major */}
                        <div>
                            <Label>အထူးပြုဘာသာရပ် ‌ရွေးချယ်ပါ</Label>
                            <Select
                                value={data.major_id}
                                onValueChange={(value) => setData("major_id", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="အထူးပြုဘာသာရပ် ‌ရွေးချယ်ပါ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">အားလုံး</SelectItem> {/* Add "All" option */}
                                    {majors.map((major) => (
                                        <SelectItem key={major.id} value={String(major.id)}>
                                            {major.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.major_id} />
                        </div>
                        {/* Course Search Box */}
                        <div className="flex justify-end m-2">
                            <input
                                type="text"
                                id="courseSearch"
                                className="w-64 border-b outline-none focus:border-blue-500 p-1"
                                placeholder="ရှာဖွေရန် ဘာသာရပ် ကုဒ်ရိုက်ထည့်ပါ....."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* Courses (filtered by major) */}


                        <div>
                            <Label className="mb-2 block">ဘာသာရပ်များ</Label>

                            {filteredCourses.length === 0 && (
                                <div className="text-sm text-red-500 italic">
                                    ‌ရွေးချယ်ထားသော အထူးပြုဘာသာ အတွက် ဘာသာရပ်များ မရှိသေးပါ။
                                </div>
                            )}

                            {filteredCourses.length > 0 && (
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="p-3 text-left w-16">ရွေးရန်</th>
                                                <th className="p-3 text-left">ဘာသာရပ်</th>
                                                <th className="p-3 text-left w-48">Credit Unit</th>
                                                <th className="p-3 text-left w-40">Elective</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredCourses.map((course) => {
                                                const assignedInfo = courseSemesterMap?.[data.semester_id]?.[course.id];
                                                const isSelected = isCourseSelected(course.id);
                                                const isAlreadyAssigned = !!assignedInfo;

                                                const elective = isSelected
                                                    ? data.courses.find((c) => c.id === course.id)?.is_elective ?? false
                                                    : assignedInfo?.is_elective ?? false;

                                                return (
                                                    <tr
                                                        key={course.id}
                                                        className={`border-t ${isAlreadyAssigned ? "bg-gray-100" : ""}`}
                                                    >
                                                        {/* Select Course */}
                                                        <td className="p-3">
                                                            <Checkbox
                                                                checked={isSelected}
                                                                disabled={isAlreadyAssigned}
                                                                onCheckedChange={() => handleCourseToggle(course.id)}
                                                            />
                                                        </td>

                                                        {/* Course Name */}
                                                        <td className={`p-3 ${isAlreadyAssigned ? "text-gray-400" : ""}`}>
                                                            {course.code} - {course.name}{" "}
                                                            {isAlreadyAssigned && "(ပြီးခဲ့သည်)"}
                                                        </td>

                                                        {/* Credit Unit */}
                                                        <td className="p-3">
                                                            {isSelected && (
                                                                <input
                                                                    type="number"
                                                                    step="0.5"
                                                                    min={0}
                                                                    placeholder="Credit Unit"
                                                                    className={`w-32 border rounded px-2 py-1 text-sm placeholder-gray-400
                                                                    ${isSelected &&
                                                                            (data.courses.find((c) => c.id === course.id)?.credit_unit === null)
                                                                            ? "border-red-500"
                                                                            : ""
                                                                        }`}
                                                                    value={
                                                                        data.courses.find((c) => c.id === course.id)?.credit_unit ??
                                                                        assignedInfo?.credit_unit ??
                                                                        ""
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateCreditUnit(course.id, e.target.value)
                                                                    }
                                                                />
                                                            )}
                                                        </td>

                                                        {/* Elective */}
                                                        <td className="p-3">
                                                            {(isSelected || isAlreadyAssigned) && (
                                                                <div className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        checked={!!elective}
                                                                        disabled={isAlreadyAssigned}
                                                                        onCheckedChange={() => toggleElective(course.id)}
                                                                    />
                                                                    <span className="text-gray-600 text-sm">
                                                                        Elective
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <InputError message={errors.courses} />
                        </div>
                        <Button type="submit" disabled={processing}>
                            {processing ? "သင်တန်းကာလအလိုက် ဘာသာရပ်များ သတ်မှတ်နေပါသည်.." : "သင်တန်းကာလအလိုက် ဘာသာရပ်များ သတ်မှတ်ရန်"}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </AppLayout>
    );
}
