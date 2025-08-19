import { ColumnDef } from "@tanstack/react-table"
import { SharedData, StudentEnrollment } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import TextLink from "@/components/text-link"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@headlessui/react"
import { Link, router, useForm, usePage } from "@inertiajs/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import StatusSelect from "@/components/StatusSelect"

const getSortHeader = (
    label: string,
    columnKey: string,
    selectedAcademicYearId: number | string,
    selectedSemesterId: number | string,
    selectedMajorId: number | string
) => {

    return (
        <Button
            // variant="ghost"
            onClick={() => {
                const page = route().params?.page ?? 1;
                const currentCol = route().params?.col;
                const currentDir = route().params?.dir ?? "";
                const newDir =
                    currentCol === columnKey && currentDir === "asc"
                        ? "desc"
                        : currentCol === columnKey && currentDir === "desc"
                            ? ""
                            : "asc";
                // alert(selectedMajorId)
                router.visit(
                    route("enroll-students.index", {
                        page,
                        col: columnKey,
                        dir: newDir,
                        academic_year_id: selectedAcademicYearId,
                        semester_id: selectedSemesterId,
                        major_id: selectedMajorId,
                    })

                );

            }}
        >
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
};

export const getColumns = (
    selectedAcademicYearId: number | string,
    selectedSemesterId: number | string,
    selectedMajorId: number | string,
    userRole: string | undefined,
): ColumnDef<StudentEnrollment>[] => [
        {
            accessorKey: "id",
            header: "#", // No change needed
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "uid",
            header: () => getSortHeader("ကျောင်းဝင်အမှတ်", "uid", selectedAcademicYearId, selectedSemesterId, selectedMajorId), // UID
            cell: ({ row }) => row.original.student.uid,
        },
        {
            accessorKey: "name",
            header: () => getSortHeader("အမည်", "name", selectedAcademicYearId, selectedSemesterId, selectedMajorId), // Name
            cell: ({ row }) => row.original.student.name_myan,
        },
        {
            accessorKey: "image",
            header: "ဓာတ်ပုံ", // Image
            cell: ({ row }) => (
                <img
                    src={
                        row.original.student_semester_profile.image
                            ? `/storage/${row.original.student_semester_profile.image}`
                            : ""
                    }
                    alt="profile"
                    className="h-10 w-10 rounded-full object-cover"
                />
            ),
        },
        {
            accessorKey: "roll_no",
            header: () => getSortHeader("ခုံနံပါတ်", "roll_no", selectedAcademicYearId, selectedSemesterId, selectedMajorId),
            cell: ({ row }) => row.original.student_semester_profile.roll_no,
        },
        {
            accessorKey: "nrc",
            header: "မှတ်ပုံတင်အမှတ်", // NRC
            cell: ({ row }) => {
                const s = row.original.student;
                return `${s.nrc_state}/${s.nrc_township} (${s.nrc_type})${s.nrc_number}`;
            },
        },
        {
            accessorKey: "email",
            header: () => getSortHeader("အီးမေးလ်", "email", selectedAcademicYearId, selectedSemesterId, selectedMajorId), // Email
            cell: ({ row }) => row.original.student_semester_profile.email,
        },
        {
            accessorKey: "phone",
            header: () => getSortHeader("ဖုန်းနံပါတ်", "phone", selectedAcademicYearId, selectedSemesterId, selectedMajorId), // Phone
            cell: ({ row }) => row.original.student_semester_profile.phone,
        },
        {
            accessorKey: "registration_date",
            header: "စာရင်းသွင်းရက်စွဲ", // Registration Date
            cell: ({ row }) => row.original.registration_date,
        },
        // {
        //     accessorKey: "status",
        //     header: "အခြေအနေ",
        //     cell: ({ row }) => <StatusSelect enrollment={row.original} />,
        // },
        {
            id: "actions",
            header: "လုပ်ဆောင်ချက်", // Action
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {/* <Button variant="ghost" className="h-8 w-8 p-0"> */}
                        <MoreHorizontal className="h-4 w-4" />
                        {/* </Button> */}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>

                        <DropdownMenuItem onClick={() => router.visit(route("enroll-students.show", row.original.id))}>
                            ကြည့်ရှုရန် {/* View */}
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => router.visit(route("enroll-students.reregister", row.original.id))}>
                            ပြန်အပ်ရန် {/* View */}
                        </DropdownMenuItem>
                        {
                            row.original.pdf_path && (
                                <>
                                    <DropdownMenuItem>
                                        <a href={route('students.download-register-pdf', row.original.id)} target="_blank">
                                            Download Register Form
                                        </a></DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <a href={`/storage/${row.original.pdf_path}`} target="_blank">
                                            View PDF
                                        </a>
                                    </DropdownMenuItem>
                                </>
                            )
                        }

                        {userRole == "admin" && (
                            <>
                                <DropdownMenuItem onClick={() => router.visit(route("assign-marks", row.original.id))}>
                                    အမှတ်ပေးရန် {/* Assign Marks */}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <a href={route("marks.show", row.original.id)} title="View Marks" target='_blank'>
                                        View Mark
                                    </a>
                                </DropdownMenuItem>
                            </>
                        )}

                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];