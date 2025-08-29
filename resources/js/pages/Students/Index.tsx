import { Head, Link, router, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import TextLink from '@/components/text-link'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import Filters from './Filters'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { SharedData } from '@/types'

export default function StudentIndex({ academicYears,
    selectedAcademicYearId,
    semesters,
    selectedSemesterId, enrollStudents }) {
    const { auth } = usePage<SharedData>().props;

    const userRole = auth?.user?.role || 'staff';

    return (
        <AppLayout breadcrumbs={[{ name: "ကျောင်းသားများ" }]}>
            <Head title="ကျောင်းသားများ ရှာဖွေခြင်း" />

            <div className="flex justify-end items-center mb-6">
                {/* <h1 className="text-2xl font-semibold">ကျောင်းသားများ</h1> */}
                <Link href={route('enroll-students.create')}>
                    <Button>ကျောင်းသားအသစ်ထည့်မည်</Button>
                </Link>
            </div>


            <Filters
                academicYears={academicYears}
                semesters={semesters}
                selectedAcademicYearId={selectedAcademicYearId}
                selectedSemesterId={selectedSemesterId}
                initialSearch=""
            />

            <div className="rounded-xl border  shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead>ကျောင်းဝင်အမှတ်</TableHead>
                            <TableHead>ကျောင်းသားအမည်</TableHead>
                            <TableHead>ခုံနံပါတ်</TableHead>
                            <TableHead>မှတ်ပုံတင်အမှတ်</TableHead>
                            <TableHead>အီးမေးလ်</TableHead>
                            <TableHead>ဖုန်း</TableHead>
                            <TableHead>စာရင်းသွင်းသည့် ရက်စွဲ</TableHead>
                            <TableHead>လုပ်ဆောင်ချက်များ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {enrollStudents.map((enrollStudent, index) => (
                            <TableRow key={enrollStudent.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{enrollStudent.student.uid}</TableCell>
                                <TableCell>{enrollStudent.student.name_myan}</TableCell>
                                <TableCell>{enrollStudent.student_semester_profile.roll_no}</TableCell>
                                <TableCell>{enrollStudent.student.nrc_state + "/" + enrollStudent.student.nrc_township + "(" + enrollStudent.student.nrc_type + ")" + enrollStudent.student.nrc_number}</TableCell>
                                <TableCell>{enrollStudent.student_semester_profile.email}</TableCell>
                                <TableCell>{enrollStudent.student_semester_profile.phone}</TableCell>
                                <TableCell>
                                    {enrollStudent.registration_date}
                                </TableCell>
                                {/* <TableCell>
                                    <TextLink href={route('assign-marks', enrollStudent.id)}>Assign Marks</TextLink>
                                </TableCell> */}
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            {/* <Button variant="ghost" className="h-8 w-8 p-0"> */}
                                            <MoreHorizontal className="h-4 w-4" />
                                            {/* </Button> */}
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => router.visit(route("enroll-students.reregister", enrollStudent.id))}>
                                                ပြန်အပ်ရန် {/* View */}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.visit(route("enroll-students.show", enrollStudent.id))}>
                                                ကြည့်ရှုရန် {/* View */}
                                            </DropdownMenuItem>
                                            {
                                                enrollStudent.pdf_path && (
                                                    <>
                                                        <DropdownMenuItem>
                                                            <a href={route('students.download-register-pdf', enrollStudent.id)} target="_blank">
                                                                Download Register Form
                                                            </a></DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <a href={`/storage/${enrollStudent.pdf_path}`} target="_blank">
                                                                View PDF
                                                            </a>
                                                        </DropdownMenuItem>

                                                    </>
                                                )
                                            }
                                            {userRole == "admin" && (
                                                <>
                                                    <DropdownMenuSeparator />


                                                    <DropdownMenuItem onClick={() => router.visit(route("assign-marks", enrollStudent.id))}>
                                                        အမှတ်ပေးရန် {/* Assign Marks */}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <a href={route("marks.show", enrollStudent.id)} title="View Marks" target='_blank'>
                                                            View Mark
                                                        </a>
                                                    </DropdownMenuItem>
                                                </>
                                            )}

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>

                                {/* <TableCell>{student.registration?.semester?.name}</TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    )
}
