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


type Course = {
    id: number;
    name: string;
    code: string;
    majors: { id: number; name: string }[]; // pivot structure
};

type Semester = {
    id: number;
    semester_number: number;
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
    courseSemesterMap: Record<number, Record<number, Record<number, { is_elective: boolean }>>>;
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
        courses: [] as { id: number; is_elective: boolean }[],
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
            setData("courses", [...currentCourses, { id, is_elective: false }]);
        }
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
                                                {getSemesterText(sem.semester_number)}
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
                            <div className="space-y-2">
                                {filteredCourses.length === 0 && (
                                    <div className="text-sm text-red-500 italic">
                                        ‌ရွေးချယ်ထားသော အထူးပြုဘာသာ အတွက် ဘာသာရပ်များ မရှိသေးပါ။
                                    </div>
                                )}

                                {filteredCourses.map((course) => {
                                    const selected = isCourseSelected(course.id);
                                    const elective =
                                        data.courses.find((c) => c.id === course.id)?.is_elective ?? false;

                                    return (
                                        <div
                                            key={course.id}
                                            className="flex items-center justify-between border rounded-lg p-3"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    checked={selected}
                                                    onCheckedChange={() => handleCourseToggle(course.id)}
                                                />
                                                <span>{course.name} - {course.code}</span>
                                            </div>
                                            {selected && (
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        checked={elective}
                                                        onCheckedChange={() => toggleElective(course.id)}
                                                    />
                                                    <span className="text-sm text-gray-600">
                                                        ရွေးချယ်နိုင်သော ဘာသာရပ်
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
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
