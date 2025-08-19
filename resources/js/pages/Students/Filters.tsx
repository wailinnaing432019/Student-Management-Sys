import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { getSemesterText } from "@/Utils/SemesterText";

export default function Filters({
    academicYears,
    semesters,
    selectedAcademicYearId,
    selectedSemesterId,
    initialSearch = "",
}) {
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    // This will reload data whenever searchTerm changes
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route("students.index"),
                {
                    academic_year_id: selectedAcademicYearId,
                    semester_id: selectedSemesterId,
                    search: searchTerm,
                },
                { preserveState: true, replace: true }
            );
        }, 400); // debounce typing by 0.4s

        return () => clearTimeout(timeout);
    }, [searchTerm, selectedAcademicYearId, selectedSemesterId]);

    const handleAcademicYearChange = (value) => {
        router.get(
            route("students.index"),
            { academic_year_id: value, search: searchTerm },
            { preserveState: true, replace: true }
        );
    };

    const handleSemesterChange = (value) => {
        router.get(
            route("students.index"),
            { academic_year_id: selectedAcademicYearId, semester_id: value, search: searchTerm },
            { preserveState: true, replace: true }
        );
    };

    return (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
            {/* Academic Year */}
            <div className="space-y-1 no-print">
                <label className="text-sm font-medium">ပညာသင်နှစ်</label>
                <Select value={selectedAcademicYearId == null ? "" : String(selectedAcademicYearId)} onValueChange={handleAcademicYearChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="ပညာသင်နှစ် ရွေးပါ" />
                    </SelectTrigger>
                    <SelectContent>
                        {academicYears.map((year) => (
                            <SelectItem key={year.id} value={String(year.id)}>
                                {year.name}
                            </SelectItem>
                        ))}
                        {selectedAcademicYearId == null && (
                            <div className="text-red-500">သင်တန်းကာလမရှိပါ။</div>
                        )}
                    </SelectContent>
                </Select>
            </div>

            {/* Semester */}
            <div className="space-y-1 no-print">
                <label className="text-sm font-medium">သင်တန်းကာလ</label>
                <Select value={selectedSemesterId == null ? "" : String(selectedSemesterId)} onValueChange={handleSemesterChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="သင်တန်းကာလ ရွေးပါ" />
                    </SelectTrigger>
                    <SelectContent>
                        {semesters.map((semester) => (
                            <SelectItem key={semester.id} value={String(semester.id)}>
                                {semester.year_name} - {getSemesterText(semester.semester_number)}
                            </SelectItem>
                        ))}
                        {selectedSemesterId == null && (
                            <div className="text-red-500">သင်တန်းကာလမရှိပါ။</div>
                        )}
                    </SelectContent>
                </Select>
            </div>

            {/* Search Box */}
            <div className="space-y-1 no-print">
                <label className="text-sm font-medium">ရှာဖွေပါ</label>
                <input
                    type="text"
                    placeholder="ကျောင်းသားအမည် (သို့) ခုံအမှတ် ဖြင့် ရှာဖွေပါ"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
            </div>
        </div>
    );
}
