// resources/js/Pages/Semesters/Index.tsx
import { useState, useRef, FormEventHandler } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import InputError from "@/components/input-error";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoaderCircle, SquarePen } from "lucide-react";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TextLink from "@/components/text-link";
import AcademicYearCreateDialog from "../AcademicYears/AcademicYearCreateDialog";
import { getSemesterText } from "@/Utils/SemesterText";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Index({ semesters, academicYears, selectedAcademicYearId }) {
    // Create Form
    const { data, setData, post, processing, errors, reset } = useForm({
        academic_year_id: "",
        year_name: "",
        name: "",
        semester_number: 0,
        start_date: "",
        end_date: "",
    });
    const closeCreateRef = useRef(null);

    const submitCreate: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("semesters.store"), {
            onSuccess: () => {
                reset();
                closeCreateRef.current?.click();
            },
        });
    };

    // Edit Form State
    const [editingSemester, setEditingSemester] = useState(null);
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: updating,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        academic_year_id: "",
        year_name: "",
        name: "",
        semester_number: 0,
        start_date: "",
        end_date: "",
    });

    const handleAcademicYearChange = (value) => {
        router.get(route("semesters.index"), {
            academic_year_id: value,
        })
    }
    const openEditDialog = (semester) => {
        setEditingSemester(semester);
        setEditData({
            academic_year_id: semester.academic_year_id,
            year_name: semester.year_name,
            name: semester.name,
            semester_number: semester.semester_number,
            start_date: semester.start_date,
            end_date: semester.end_date,
        });
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingSemester) return;
        put(route("semesters.update", editingSemester.id), {
            onSuccess: () => {
                resetEdit();
                setEditingSemester(null);
            },
        });
    };

    // Delete Handler
    const deleteHandler = (id) => {
        router.delete(route("semesters.destroy", id));
    };

    return (
        <AppLayout title="Semesters" breadcrumbs={[
            { name: "သင်တန်းကာလများ" }
        ]}>
            <Head title="သင်တန်းကာလများ" />

            {/* Create Dialog */}
            <div className="text-right mb-4 space-x-3 flex items-center">

                <div className="w-2/7  ">
                    <div className="text-left">
                        <label className="text-sm  font-medium">ပညာသင်နှစ် အလိုက်‌ရွေးချယ်ပါ:</label>
                    </div>
                    <Select value={academicYears.length == 0 ? "" : String(selectedAcademicYearId)} onValueChange={handleAcademicYearChange}>
                        <SelectTrigger className="">
                            <SelectValue placeholder="ပညာသင်နှစ် ရွေးချယ်ပါ။" />
                        </SelectTrigger>
                        <SelectContent>

                            {academicYears.map((year) => (
                                <SelectItem key={year.id} value={String(year.id)}>
                                    {year.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-6/7">

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700 ml-4">သင်တန်းကာလ အသစ်ထည့်မည်</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <form onSubmit={submitCreate}>
                                <DialogHeader>
                                    <DialogTitle>သင်တန်းကာလ ဖန်တီးခြင်း</DialogTitle>
                                    <DialogDescription>ပညာသင်နှစ် ရွေးချယ်၍ သင်တန်းကာလ ဖန်တီးပါ။</DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4">
                                    <div>
                                        <Label htmlFor="academic_year_id">ပညာသင်နှစ် ရွေးချယ်ပါ</Label>
                                        <Select
                                            value={data.academic_year_id}
                                            onValueChange={(value) => setData("academic_year_id", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="ပညာသင်နှစ် ရွေးချယ်ပါ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {academicYears.length === 0 && (
                                                        <span className="text-red-500"> ပညာသင်နှစ် တစ်ခုရှိဖို့လို အပ်ပါသည်။ အရင်ဖန်တီးရန် ပညာသင်နှစ် စာမျက်နှာသို့ သွားပါ။</span>
                                                    )}
                                                    {academicYears.map((year) => (
                                                        <SelectItem key={year.id} value={String(year.id)}>
                                                            {year.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.academic_year_id} />
                                    </div>

                                    <div>
                                        <Label htmlFor="number">သင်တန်းနှစ်အမည် (ဥပမာ- ပထမနှစ်)</Label>
                                        <Input
                                            id="year_name"
                                            name="year_name"
                                            type="text"
                                            min={1}
                                            value={data.year_name}
                                            onChange={(e) => setData("year_name", e.target.value)}
                                            placeholder="ဥပမာ- ပထမနှစ်"
                                        />
                                        <InputError message={errors.year_name} />
                                    </div>
                                    <div>
                                        <Label htmlFor="semester_number">သင်တန်းကာလ ရွေးချယ်ပါ</Label>
                                        <Select
                                            value={data.semester_number == 0 ? "" : String(data.semester_number)}
                                            onValueChange={(value) => setData("semester_number", Number(value))}
                                        >
                                            <SelectTrigger id="semester_number">
                                                <SelectValue placeholder="သင်တန်းကာလ ရွေးချယ်ပါ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Semester I</SelectItem>
                                                <SelectItem value="2">Semester II</SelectItem>
                                                <SelectItem value="3">Semester III</SelectItem>
                                                <SelectItem value="4">Semester IV</SelectItem>
                                                <SelectItem value="5">Semester V</SelectItem>
                                                <SelectItem value="6">Semester VI</SelectItem>
                                                <SelectItem value="7">Semester VII</SelectItem>
                                                <SelectItem value="8">Semester VIII</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.semester_number} />
                                    </div>
                                    <div>
                                        <Label htmlFor="start_date">သင်တန်းကာလ စတင်မည့်ရက်</Label>
                                        <Input
                                            id="start_date"
                                            name="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData("start_date", e.target.value)}
                                        />
                                        <InputError message={errors.start_date} />
                                    </div>

                                    <div>
                                        <Label htmlFor="end_date">သင်တန်းကာလ ပြီးဆုံးမည့်ရက်စွဲ</Label>
                                        <Input
                                            id="end_date"
                                            name="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData("end_date", e.target.value)}
                                        />
                                        <InputError message={errors.end_date} />
                                    </div>
                                </div>

                                <DialogFooter className="mt-6 flex justify-end gap-2">
                                    <DialogClose asChild>
                                        <Button ref={closeCreateRef} variant="outline">
                                            ပယ်ဖျက်မည်
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={processing}>
                                        {processing && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
                                        {processing ? "ဖန်တီးနေပါသည်" : "ဖန်တီးမည်"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div >

            {/* Semesters Table */}
            <Table>
                <TableCaption>သင်တန်းကာလ စာရင်း</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>စဉ်</TableHead>
                        <TableHead>ပညာသင်နှစ်</TableHead>
                        <TableHead>သင်တန်းနှစ် အမည်</TableHead>
                        <TableHead>သင်တန်းကာလ အမည်</TableHead>
                        <TableHead>စတင်မည့် ရက်စွဲ</TableHead>
                        <TableHead>ပြီးဆုံးမည့် ရက်စွဲ</TableHead>
                        <TableHead className="">လုပ်ဆောင်ချက်များ</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {semesters.length > 0 ? (
                        semesters.map((semester, index) => (
                            <TableRow key={semester.id}>
                                <TableCell>{semester.id}</TableCell>
                                <TableCell>{semester.academic_year.name}</TableCell>
                                <TableCell>{semester.year_name}</TableCell>
                                <TableCell>{getSemesterText(semester.semester_number)}</TableCell>
                                <TableCell>{semester.start_date}</TableCell>
                                <TableCell>{semester.end_date}</TableCell>
                                <TableCell className="text-center space-x-2">

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => openEditDialog(semester)}
                                                    className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                                >
                                                    <SquarePen className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Edit</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    {/* Delete Dialog */}
                                    {/* <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">ဖျက်မည်</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>ပယ်ဖျက်ခြင်းကို အတည်ပြုခြင်း</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    ဤသင်တန်း ကာလကို ဖျက်မည် သေချာပါပြီလား။ "<strong>{semester.name}</strong>"? ဤလုပ်ဆောင်ချက်သည် ပြန်ပြင်၍ မရနိုင်ပါ။
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>ပယ်ဖျက်မည်</AlertDialogCancel>
                                                <AlertDialogAction className="text-red-600" onClick={() => deleteHandler(semester.id)}>
                                                    သေချာပါသည်
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog> */}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground">
                                သင်တန်းကာလမရှိပါ။ သင်တန်းကာလ ဖန်တီးပါ။
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table >

            {/* Edit Dialog */}
            {
                editingSemester && (
                    <Dialog open={true} onOpenChange={() => setEditingSemester(null)}>
                        <DialogContent className="sm:max-w-lg">
                            <form onSubmit={submitEdit}>
                                <DialogHeader>
                                    <DialogTitle>သင်တန်းကာလ ပြင်ဆင်ခြင်း</DialogTitle>
                                    <DialogDescription>သင်တန်းကာလ အချက်အလက်များပြင်ဆင်ခြင်း</DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4">
                                    <div>
                                        <Label htmlFor="edit_academic_year_id">ပညာသင်နှစ်</Label>


                                        <Select
                                            value={String(editData.academic_year_id)}
                                            onValueChange={(value) => setEditData("academic_year_id", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Academic Year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {academicYears.map((year) => (
                                                        <SelectItem key={year.id} value={String(year.id)}>
                                                            {year.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={editErrors.academic_year_id} />
                                    </div>

                                    <div>
                                        <Label htmlFor="edit_number">Year Name</Label>
                                        <Input
                                            id="edit_number"
                                            name="year_name"
                                            type="text"
                                            min={1}
                                            value={editData.year_name}
                                            onChange={(e) => setEditData("year_name", e.target.value)}
                                            placeholder="First Year"
                                        />
                                        <InputError message={editErrors.year_name} />
                                    </div>
                                    <div>
                                        <Label htmlFor="semester_number">သင်တန်းကာလ ရွေးချယ်ပါ</Label>
                                        <Select
                                            value={String(editData.semester_number)}
                                            onValueChange={(value) => setEditData("semester_number", Number(value))}
                                        >
                                            <SelectTrigger id="semester_number">
                                                <SelectValue placeholder="သင်တန်းကာလ ရွေးချယ်ပါ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Semester I</SelectItem>
                                                <SelectItem value="2">Semester II</SelectItem>
                                                <SelectItem value="3">Semester III</SelectItem>
                                                <SelectItem value="4">Semester IV</SelectItem>
                                                <SelectItem value="5">Semester V</SelectItem>
                                                <SelectItem value="6">Semester VI</SelectItem>
                                                <SelectItem value="7">Semester VII</SelectItem>
                                                <SelectItem value="8">Semester VIII</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={editErrors.semester_number} />
                                    </div>


                                    <div>
                                        <Label htmlFor="edit_start_date">စတင်မည့်ရက်စွဲ</Label>
                                        <Input
                                            id="edit_start_date"
                                            name="start_date"
                                            type="date"
                                            value={editData.start_date}
                                            onChange={(e) => setEditData("start_date", e.target.value)}
                                        />
                                        <InputError message={editErrors.start_date} />
                                    </div>

                                    <div>
                                        <Label htmlFor="edit_end_date">ပြီးဆုံးမည့်ရက်စွဲ</Label>
                                        <Input
                                            id="edit_end_date"
                                            name="end_date"
                                            type="date"
                                            value={editData.end_date}
                                            onChange={(e) => setEditData("end_date", e.target.value)}
                                        />
                                        <InputError message={editErrors.end_date} />
                                    </div>
                                </div>

                                <DialogFooter className="mt-6 flex justify-end gap-2">
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={updating}>
                                        {updating && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
                                        Update
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )
            }
        </AppLayout >
    );
}
