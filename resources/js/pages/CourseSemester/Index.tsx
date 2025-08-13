"use client";

import React, { FormEventHandler, useRef, useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import TextLink from "@/components/text-link";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { LoaderCircle } from "lucide-react";
import { getSemesterText } from "@/Utils/SemesterText";

type Semester = {
    id: number;
    semester_number: number;
};

type Major = {
    id: number;
    name: string;
};

type Course = {
    id: number;
    name: string;
    code: string;
    is_elective: boolean;
};

type Props = {
    semesters: Semester[];
    majors: Major[];
    selected_semester_id: number;
    selected_major_id: number;
    assigned_courses: Course[];
};

export default function CourseSemesterIndex({
    academicYears,
    selectedAcademicYearId,
    semesters,
    majors,
    selected_semester_id,
    selected_major_id,
    assigned_courses,
}: any) {
    const [selectedSemesterId, setSelectedSemesterId] = useState(selected_semester_id);
    const [selectedMajorId, setSelectedMajorId] = useState(selected_major_id);


    // Change semester filter and reload page with filters
    const handleSemesterChange = (value: string) => {
        setSelectedSemesterId(Number(value));
        router.get(
            route("course-semesters.index"),
            { semester_id: value, major_id: selectedMajorId, academic_year_id: selectedAcademicYearId },
            { preserveState: true }
        );
    };

    // Change major filter and reload page with filters
    const handleMajorChange = (value: string) => {
        setSelectedMajorId(Number(value));
        router.get(
            route("course-semesters.index"),
            { semester_id: selectedSemesterId, major_id: value, academic_year_id: selectedAcademicYearId },
            { preserveState: true }
        );
    };
    const handleAcademicYearChange = (value) => {
        router.get(route("course-semesters.index"), {
            academic_year_id: value,
        })
    }

    // Unassign course from semester
    const handleUnassign = (courseId: number) => {
        router.post(
            route("course-semesters.unassign", {
                semester_id: selectedSemesterId,
                course_id: courseId,
            }),
            {},
            { preserveScroll: true }
        );
    };

    return (
        <AppLayout title="သင်တန်းကာလများ အလိုက် ဘာသာရပ်များ" breadcrumbs={[
            { name: "သင်တန်းကာလများ အလိုက် ဘာသာရပ်များ" }
        ]}>
            <Head title="သင်တန်းကာလများ အလိုက် ဘာသာရပ်များ" />

            <div className="max-w-7xl mx-auto mt-6 space-y-6 p-4 sm:p-6 shadow rounded-xl">
                {/* Filters and assign button */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div className="flex flex-wrap gap-6">
                        {/* Academic Year Filter */}
                        <div>
                            <Label className="mb-1 block text-sm">ပညာသင်နှစ် ရွေးချယ်ပါ</Label>
                            <Select value={String(selectedAcademicYearId)} onValueChange={handleAcademicYearChange}>
                                <SelectTrigger className="w-full">
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
                        </div>

                        {/* Semester Filter */}
                        <div>
                            <Label className="mb-1 block text-sm">သင်တန်းကာလ ‌ရွေးချယ်ပါ</Label>
                            <Select value={String(selectedSemesterId)} onValueChange={handleSemesterChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="သင်တန်းကာလ ‌ရွေးချယ်ပါ" />
                                </SelectTrigger>
                                <SelectContent>
                                    {semesters.length > 0 ? semesters.map((sem) => (
                                        <SelectItem key={sem.id} value={String(sem.id)}>
                                            {getSemesterText(sem.semester_number)}
                                        </SelectItem>
                                    )) : (
                                        <div className="px-4 py-2 text-gray-500 text-sm">သင်တန်းကာလများ မရှိသေးပါ။</div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Major Filter */}
                        <div>
                            <Label className="mb-1 block text-sm">အထူးပြုဘာသာရပ် ရွေးချယ်ပါ</Label>
                            <Select value={String(selectedMajorId)} onValueChange={handleMajorChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="အထူးပြုဘာသာရပ် ရွေးချယ်ပါ" />
                                </SelectTrigger>
                                <SelectContent>
                                    {majors.length > 0 ? majors.map((major) => (
                                        <SelectItem key={major.id} value={String(major.id)}>
                                            {major.name}
                                        </SelectItem>
                                    )) : (
                                        <div className="px-4 py-2 text-gray-500 text-sm">အထူးပြုဘာသာရပ်များ  မရှိသေးပါ။</div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <TextLink href={route("course-semesters.create")}>
                        <Button className="bg-green-500 hover:bg-green-600 text-white">
                            + သင်တန်းကာလများ အတွက် ဘာသာရပ်များ သတ်မှတ်မည်
                        </Button>
                    </TextLink>
                </div>

                {/* Assigned courses table */}
                <div className="border rounded-lg overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className=" ">
                                <TableHead className="text-center w-10">#</TableHead>
                                <TableHead>ဘာသာရပ် အမည်</TableHead>
                                <TableHead>ဘာသာရပ် ကုဒ်</TableHead>
                                <TableHead className="text-center w-24">ရွေးချယ်ဘာသာရပ်</TableHead>
                                <TableHead className="text-center w-32">လုပ်ဆောင်ချက်များ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assigned_courses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                                        ‌ရွေးချယ်ထားသော အထူးပြုဘာသာ အတွက် ဘာသာရပ်များ မရှိသေးပါ။
                                    </TableCell>
                                </TableRow>
                            ) : (
                                assigned_courses.map((course, index) => (
                                    <TableRow key={course.id} className="hover:bg-muted/50">
                                        <TableCell className="text-center">{index + 1}</TableCell>
                                        <TableCell>{course.name}</TableCell>
                                        <TableCell>{course.code}</TableCell>
                                        <TableCell className="text-center">
                                            {course.is_elective ? (
                                                <span className="text-green-600 font-medium">Yes</span>
                                            ) : (
                                                <span className="text-gray-500">No</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleUnassign(course.id)}
                                            >
                                                Unassign
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}