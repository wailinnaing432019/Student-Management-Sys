import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSemesterText } from '@/Utils/SemesterText';
import InputError from '@/components/input-error'; // <-- Import your InputError component

interface Course { id: number; name: string; code: string; is_elective: number; }
interface Mark { id?: number; mark: number | ''; grade: string; remark: string; }
interface StudentCourse { id: number; course: Course; marks: Mark; }
interface Enrollment {
    id: number;
    student_id: number;
    studentCourses: StudentCourse[];
    student: any;
    student_semester_profile: any;
    semester: any;
    academic_year: any;
}

const getGrade = (mark: number) => {
    if (mark >= 90) return 'A+';
    if (mark >= 80) return 'A';
    if (mark >= 70) return 'B+';
    if (mark >= 60) return 'B';
    if (mark >= 50) return 'C';
    if (mark >= 40) return 'D';
    return 'F';
};

export default function EditMark({ enrollment }: { enrollment: Enrollment }) {
    const { data, setData, put, processing, errors } = useForm({
        marks: enrollment.studentCourses.map(sc => ({
            student_course_enrollment_id: sc.id,
            mark: sc.marks?.mark || '',
            grade: sc.marks?.grade || '',
            remark: sc.marks?.remark || ''
        }))
    });

    const handleChange = (index: number, field: string, value: any) => {
        const updated = [...data.marks];
        updated[index][field] = value;
        if (field === 'mark') {
            const numericMark = Number(value);
            updated[index].grade = numericMark ? getGrade(numericMark) : '';
        }
        setData('marks', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('marks.update', enrollment.id));
    };

    return (
        <AppLayout breadcrumbs={[{ name: "အမှတ်များ ပြင်ဆင်ခြင်း" }]}>
            <Head title="Edit Marks" />
            <div className="text-center space-y-2">
                <h2 className="text-lg font-semibold">ကျောင်းသားအမည် - {enrollment.student.name_eng}</h2>
                <h6>{enrollment.student_semester_profile.roll_no}</h6>
                <p className="text-sm text-gray-600">
                    {enrollment.academic_year.name} ပညာသင်နှစ် ၊ {enrollment.semester.year_name} - {getSemesterText(enrollment.semester.semester_number)}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <div className="rounded-xl border shadow-sm overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center w-[40px]">#</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead className="text-center">Mark</TableHead>
                                <TableHead className="text-center">Grade</TableHead>
                                <TableHead className="text-center">Remark</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.marks.map((m, index) => (
                                <TableRow key={m.student_course_enrollment_id}>
                                    <TableCell className="text-center">{index + 1}</TableCell>
                                    <TableCell>{enrollment.studentCourses[index].course.name} ({enrollment.studentCourses[index].course.code})</TableCell>
                                    <TableCell className="text-center">
                                        <Input
                                            type="number"
                                            value={m.mark}
                                            onChange={(e) => handleChange(index, 'mark', e.target.value)}
                                        />
                                        <InputError message={errors[`marks.${index}.mark`]} />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Input
                                            value={m.grade}
                                            onChange={(e) => handleChange(index, 'grade', e.target.value)}
                                        />
                                        <InputError message={errors[`marks.${index}.grade`]} />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Input
                                            value={m.remark}
                                            onChange={(e) => handleChange(index, 'remark', e.target.value)}
                                        />
                                        <InputError message={errors[`marks.${index}.remark`]} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>အမှတ်ပြင်မည်</Button>
                </div>
            </form>
        </AppLayout>
    );
}
