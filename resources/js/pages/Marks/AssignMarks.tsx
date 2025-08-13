import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

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
    semester: { name: string; year_name: string };
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
        <AppLayout>
            <Head title="Assign Marks" />
            <form onSubmit={handleSubmit} className="space-y-6 p-6 max-w-3xl mx-auto">
                <Card>
                    <CardHeader>Student Name : {student.name}</CardHeader>
                    <CardContent>
                        Semester : {semester.year_name} - {semester.name}
                    </CardContent>
                </Card>

                <div className="flex-auto space-y-6">
                    {studentCourses.map((sc, index) => (
                        <div key={sc.id} className="flex gap-8 items-center space-y-3">
                            <div>
                                <Label>
                                    {sc.course.name} ({sc.course.code}) Mark
                                </Label>
                                <Input
                                    type="number"
                                    value={data.marks[index]?.mark || ''}
                                    onChange={(e) => handleChange(index, 'mark', e.target.value)}
                                />
                                <InputError message={errors[`marks.${index}.mark`]} className="mt-2" />
                            </div>

                            <div>
                                <Label>Grade</Label>
                                <Input
                                    value={data.marks[index]?.grade || ''}
                                    onChange={(e) => handleChange(index, 'grade', e.target.value)}
                                />
                            </div>

                            {Number(sc.course.is_elective) === 1 && (
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCourse(index)}
                                        className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <CardFooter className="justify-end">
                    <Button type="submit" disabled={processing}>
                        Save Marks
                    </Button>
                </CardFooter>
            </form>
        </AppLayout>
    );
}
