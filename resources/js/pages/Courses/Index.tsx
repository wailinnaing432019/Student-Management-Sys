// Index.tsx
import { useState, FormEventHandler } from "react"
import { Head, router, useForm, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { columns as baseColumns } from "./columns"
import EditCourseModal from "./EditCourseModal"
import { DataTable } from "./data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CreateCourseDialog from "./CreateCourseDialog"

export default function CourseIndex({ courses, majors, filters }) {
    const [editingCourse, setEditingCourse] = useState(null)

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: updating,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        name: "",
        code: "",
        description: "",
        is_elective: false,
        major_ids: [],
    })

    const openEditDialog = (course) => {
        setEditingCourse(course)
        setEditData({
            name: course.name,
            code: course.code,
            description: course.description || "",
            is_elective: course.is_elective || false,
            major_ids: course.majors.map((m) => m.id.toString()),
        })
    }

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault()
        if (!editingCourse) return
        put(route("courses.update", editingCourse.id), {
            onSuccess: () => {
                resetEdit()
                setEditingCourse(null)
            },
        })
    }

    const handleMajorFilter = (value: string) => {
        router.get(route("courses.index"), {
            major_id: value === "all" ? undefined : value,
            page: 1,
        });
    };
    const columns = baseColumns(openEditDialog) // pass function to columns.tsx

    return (
        <AppLayout title="Courses" breadcrumbs={[
            { name: "ဘာသာရပ်များ" }
        ]}>
            <Head title="Courses" />
            <div className="flex justify-between items-center">
                <Select value={filters.major_id || ""} onValueChange={handleMajorFilter}>
                    <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="အထူးပြု ဘာသာရပ်များ အားလုံး" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">အထူးပြု ဘာသာရပ်များ အားလုံး</SelectItem>
                        {majors.map((m) => (
                            <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <CreateCourseDialog majors={majors} redirect="courses.index" />
            </div>
            <DataTable
                columns={columns}
                data={courses.data}
                pagination={{
                    currentPage: courses.current_page,
                    totalPages: courses.last_page,
                    onPageChange: (page) => {
                        router.get(route("courses.index"), {
                            major_id: filters.major_id || undefined,
                            page: page,
                        }, {
                            preserveScroll: true,
                            preserveState: true,
                        });
                    },
                }}
            />

            {/* Edit Dialog shown only when editingCourse exists */}
            <EditCourseModal
                open={!!editingCourse}
                onOpenChange={(open) => {
                    if (!open) {
                        resetEdit()
                        setEditingCourse(null)
                    }
                }}
                data={editData}
                setData={setEditData}
                errors={editErrors}
                processing={updating}
                onSubmit={submitEdit}
                majors={majors}

            />
        </AppLayout>
    )
}
