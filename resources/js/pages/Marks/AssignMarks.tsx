import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { getSemesterText } from '@/Utils/SemesterText';

interface Course {
    id: number;
    name: string;
    code: string;
    is_elective: number | boolean;
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
    };
}

interface Props {
    student_enrollment_id: number;
    student: { id: number; name: string; roll_no: string | null };
    semester: { semester_number: string; year_name: string };
    student_courses: StudentCourse[];
}

export default function AssignMarks({
    student_enrollment_id,
    student,
    semester,
    student_courses,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        marks: student_courses.map((sc) => ({
            student_course_enrollment_id: sc.id,
            mark: sc.mark?.mark || '',
            grade: sc.mark?.grade || '',
            remark: sc.mark?.remark || '',
            course_name: sc.course.name,
            course_code: sc.course.code,
            is_elective: sc.course.is_elective,
        })),
    });

    const handleChange = (index: number, field: string, value: any) => {
        const updated = [...data.marks];
        updated[index][field] = value;
        setData('marks', updated);
    };

    const handleRemoveCourse = (index: number) => {
        const updated = data.marks.filter((_, i) => i !== index);
        setData('marks', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('marks.store'));
    };

    return (
        <AppLayout breadcrumbs={[{ name: "ဘာသာရပ်များ အတွက် အမှတ်များ သတ်မှတ်ခြင်း" }]}>
            <Head title="Assign Marks" />

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <div className="text-center space-y-2">
                    <h2 className="text-lg font-semibold">ကျောင်းသားအမည် - {student.name}</h2>
                    <p className="text-sm text-gray-600">
                        သင်တန်းကာလ : {semester.year_name} - {getSemesterText(semester.semester_number)}
                    </p>
                </div>

                <div className="rounded-xl border shadow-sm overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40px] text-center">#</TableHead>
                                <TableHead className="min-w-[200px]">Course</TableHead>
                                <TableHead className="text-center">Mark</TableHead>
                                <TableHead className="text-center">Grade</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.marks.map((sc, index) => (
                                <TableRow key={sc.student_course_enrollment_id}>
                                    {/* Order same as EnrolledStudents */}
                                    <TableCell className="text-center">{index + 1}</TableCell>
                                    <TableCell>
                                        {sc.course_name} ({sc.course_code})
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Input
                                            type="number"
                                            className="w-24 mx-auto"
                                            value={sc.mark}
                                            onChange={(e) => handleChange(index, 'mark', e.target.value)}
                                        />
                                        <InputError
                                            message={errors[`marks.${index}.mark`]}
                                            className="mt-1"
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Input
                                            className="w-20 mx-auto"
                                            value={sc.grade}
                                            onChange={(e) => handleChange(index, 'grade', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {Number(sc.is_elective) === 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCourse(index)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                            >
                                                မထည့်ပါ။
                                            </button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        အမှတ်များ သိမ်းမည်
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
