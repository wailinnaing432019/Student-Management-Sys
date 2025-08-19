import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
    student_courses: initialStudentCourses,
}: Props) {
    const [studentCourses, setStudentCourses] = useState<StudentCourse[]>(initialStudentCourses);

    // Initialize form data from current studentCourses state
    const { data, setData, post, processing, errors } = useForm({
        marks: studentCourses.map((sc) => ({
            student_course_enrollment_id: sc.id,
            mark: sc.mark?.mark || '',
            grade: sc.mark?.grade || '',
            remark: sc.mark?.remark || '',
            course_name: sc.course.name,
        })),
    });

    const handleChange = (index: number, field: string, value: any) => {
        const updated = [...data.marks];
        updated[index][field] = value;
        setData('marks', updated);
    };

    // When removing a course, remove it from local state and form data
    const handleRemoveCourse = (index: number) => {
        const updatedCourses = studentCourses.filter((_, i) => i !== index);
        setStudentCourses(updatedCourses);

        const updatedMarks = data.marks.filter((_, i) => i !== index);
        setData('marks', updatedMarks);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('marks.store'));
    };

    return (
        <AppLayout breadcrumbs={[
            { name: "ဘာသာရပ်များ အတွက်  အမှတ်များ သတ်မှတ်ခြင်း" },
        ]}>
            <Head title="Assign Marks" />
            <form onSubmit={handleSubmit} className="space-y-6 p-6 max-w-3xl mx-auto">
                <Card>
                    <CardHeader>ကျောင်းသားအမည် : {student.name}</CardHeader>
                    <CardContent>
                        သင်တန်းကာလ : {semester.year_name} - {getSemesterText(semester.semester_number)}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {studentCourses.map((sc, index) => (
                        <div key={sc.id} className="flex gap-4 items-end">
                            {/* Course Mark */}
                            <div className="flex-1 min-w-[120px]">
                                <Label className="block text-sm font-medium">
                                    {sc.course.name} ({sc.course.code}) Mark
                                </Label>
                                <Input
                                    type="number"
                                    value={data.marks[index]?.mark || ''}
                                    onChange={(e) => handleChange(index, 'mark', e.target.value)}
                                    className="w-full"
                                />
                                <InputError message={errors[`marks.${index}.mark`]} className="mt-1" />
                            </div>

                            {/* Grade */}
                            <div className="w-24 min-w-[80px]">
                                <Label className="block text-sm font-medium">Grade</Label>
                                <Input
                                    value={data.marks[index]?.grade || ''}
                                    onChange={(e) => handleChange(index, 'grade', e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* Remove button column (fixed width, always exists but empty if not elective) */}
                            <div className="w-28 flex items-end">
                                {Number(sc.course.is_elective) === 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCourse(index)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        မထည့်ပါ။
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>



                <CardFooter className="justify-end">
                    <Button type="submit" disabled={processing}>
                        အမှတ်များ သိမ်းမည်
                    </Button>
                </CardFooter>
            </form>
        </AppLayout>
    );
}
