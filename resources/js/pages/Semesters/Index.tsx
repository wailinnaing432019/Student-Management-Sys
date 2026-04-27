// resources/js/Pages/Semesters/Index.tsx
import { useState, useRef, FormEventHandler, useMemo, useEffect } from "react";
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
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";


const yearNameEngMap: Record<string, { value: string, label: string }[]> = {
    "ပထမနှစ်": [
        { value: "First Year", label: "First Year" },
    ],
    "ဒုတိယနှစ်": [
        { value: "Second Year", label: "Second Year" },
    ],
    "တတိယနှစ်": [
        { value: "Third Year", label: "Third Year" },
    ],
    "စတုတ္ထနှစ်": [
        { value: "Fourth Year", label: "Fourth Year" },
    ],
    "ပဉ္စမနှစ်": [
        { value: "Fifth Year", label: "Fifth Year" },
    ],
    "D.C.Sc.": [
        { value: "D.C.Sc.", label: "D.C.Sc." },
    ]
}
const yearSemesterMap: Record<string, { value: number; label: string }[]> = {
    "ပထမနှစ်": [
        { value: 1, label: "Semester I" },
        { value: 2, label: "Semester II" },
    ],
    "ဒုတိယနှစ်": [
        { value: 3, label: "Semester III" },
        { value: 4, label: "Semester IV" },
    ],
    "တတိယနှစ်": [
        { value: 5, label: "Semester V" },
        { value: 6, label: "Semester VI" },
    ],
    "စတုတ္ထနှစ်": [
        { value: 7, label: "Semester VII" },
        { value: 8, label: "Semester VIII" },
    ],
    "ပဉ္စမနှစ်": [
        { value: 9, label: "Semester IX" },
        { value: 10, label: "Semester X" },
    ],
    "D.C.Sc.": [
        { value: 11, label: "Module I" },
        { value: 12, label: "Module II" },
        { value: 13, label: "Module III" },
        { value: 14, label: "Module IV" },
    ],
};
export default function Index({ semesters, academicYears, selectedAcademicYearId }) {
    // Create Form
    const { data, setData, post, processing, errors, reset } = useForm({
        academic_year_id: "",
        year_name: "ပထမနှစ်",
        year_name_eng: "First Year",
        name: "",
        semester_number: 1,
        is_final_year: false,
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
        year_name_eng: "",
        name: "",
        semester_number: 0,
        is_final_year: false,
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
            year_name_eng: semester.year_name_eng,
            name: semester.name,
            semester_number: semester.semester_number,
            is_final_year: Boolean(semester.is_final_year),
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

    const availableYearEng = useMemo(() => {
        return yearNameEngMap[data.year_name] || [];
    }, [data.year_name]);
    const availableSemesters = useMemo(() => {
        return yearSemesterMap[data.year_name] || [];
    }, [data.year_name]);

    // Auto-select first semester when year changes
    useEffect(() => {
        if (data.year_name && availableSemesters.length > 0) {
            // if semester not in range or is 0 → reset to first available
            if (
                !availableSemesters.some((sem) => sem.value === data.semester_number)
            ) {
                setData("semester_number", availableSemesters[0].value);
            }
        }
    }, [data.year_name, availableSemesters, data.semester_number, setData]);

    // Auto-select yearname by english
    useEffect(() => {
        if (data.year_name && availableYearEng.length > 0) {
            // if semester not in range or is 0 → reset to first available
            if (
                !availableYearEng.some((sem) => sem.value === data.year_name_eng)
            ) {
                setData("year_name_eng", availableYearEng[0].value);
            }
        }
    }, [data.year_name, availableYearEng, data.year_name_eng, setData]);

    // edit available semesters
    const availableSemestersEdit = yearSemesterMap[editData.year_name] || [];
    // edit available year name eng
    const availableYearEngEdit = yearNameEngMap[editData.year_name] || [];


    // Auto-select the first semester when year changes
    useEffect(() => {
        if (editData.year_name && availableSemestersEdit.length > 0) {
            if (
                !availableSemestersEdit.some((s) => s.value === editData.semester_number)
            ) {
                setEditData("semester_number", availableSemestersEdit[0].value);
            }
        }
    }, [editData.year_name, availableSemestersEdit]);

    useEffect(() => {
        if (editData.year_name && availableYearEngEdit.length > 0) {
            if (
                !availableYearEngEdit.some((s) => s.value === editData.year_name_eng)
            ) {
                setEditData("year_name_eng", availableYearEngEdit[0].value);
            }
        }
    }, [editData.year_name, availableYearEngEdit]);

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
                            <Button className="  ml-4">သင်တန်းကာလ အသစ်ထည့်မည်</Button>
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

                                    {/* Year Selection */}
                                    <div>
                                        <Label htmlFor="year_name">သင်တန်းနှစ်အမည်</Label>
                                        <Select
                                            value={String(data.year_name)}
                                            onValueChange={(value) => setData("year_name", value)}
                                        >
                                            <SelectTrigger id="year_name">
                                                <SelectValue placeholder="သင်တန်းနှစ် ရွေးချယ်ပါ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ပထမနှစ်">ပထမနှစ်</SelectItem>
                                                <SelectItem value="ဒုတိယနှစ်">ဒုတိယနှစ်</SelectItem>
                                                <SelectItem value="တတိယနှစ်">တတိယနှစ်</SelectItem>
                                                <SelectItem value="စတုတ္ထနှစ်">စတုတ္ထနှစ်</SelectItem>
                                                <SelectItem value="ပဉ္စမနှစ်">ပဉ္စမနှစ်</SelectItem>
                                                <SelectItem value="D.C.Sc.">D.C.Sc.</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.year_name} />
                                    </div>
                                    {/* Semester Name Eng */}
                                    <div>
                                        <Label htmlFor="year_name_eng">သင်တန်းနှစ်အမည် (Eng)</Label>
                                        <Select
                                            value={String(data.year_name_eng)}
                                            onValueChange={(value) => setData("year_name_eng", value)}
                                        >
                                            <SelectTrigger id="year_name_eng">
                                                <SelectValue placeholder="သင်တန်းနှစ် ရွေးချယ်ပါ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableYearEng.map((sem) => (
                                                    <SelectItem key={sem.value} value={String(sem.value)}>
                                                        {sem.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.year_name_eng} />
                                    </div>

                                    {/* Semester Selection */}
                                    <div>
                                        <Label htmlFor="semester_number">သင်တန်းကာလ ရွေးချယ်ပါ</Label>
                                        <Select
                                            disabled={!data.year_name} // disable until year selected
                                            value={data.semester_number ? String(data.semester_number) : ""}
                                            onValueChange={(value) => setData("semester_number", Number(value))}
                                        >
                                            <SelectTrigger id="semester_number">
                                                <SelectValue placeholder="သင်တန်းကာလ ရွေးချယ်ပါ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableSemesters.map((sem) => (
                                                    <SelectItem key={sem.value} value={String(sem.value)}>
                                                        {sem.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.semester_number} />
                                    </div>
                                    {/* Final Year Checkbox Section */}
                                    <div className="flex items-center space-x-2 rounded-md border p-4 shadow-sm bg-slate-50/50">
                                        <Checkbox
                                            id="is_final_year"
                                            checked={data.is_final_year}
                                            onCheckedChange={(checked) => setData("is_final_year", checked)}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <label
                                                htmlFor="is_final_year"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                နောက်ဆုံးနှစ် (Final Year) ဖြစ်ပါသလား။
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                နောက်ဆုံးနှစ်ဖြစ်ပါက GPA ကို နှစ်ဝက်နှစ်ခုပေါင်း၍ တွက်ချက်မည်ဖြစ်ပါသည်။
                                            </p>
                                        </div>
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
            <Card>
                <Table>
                    <TableCaption>သင်တန်းကာလ စာရင်း</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>စဉ်</TableHead>
                            <TableHead>ပညာသင်နှစ်</TableHead>
                            <TableHead>သင်တန်းနှစ် အမည်</TableHead>
                            <TableHead>သင်တန်းနှစ် အမည် (Eng)</TableHead>
                            <TableHead>သင်တန်းကာလ အမည်</TableHead>
                            <TableHead>စတင်မည့် ရက်စွဲ</TableHead>
                            <TableHead>ပြီးဆုံးမည့် ရက်စွဲ</TableHead>
                            <TableHead className="">လုပ်ဆောင်ချက်များ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {semesters.length > 0 ? (
                            semesters.map((semester, index) => (
                                <TableRow key={semester.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-medium text-slate-600">{index + 1}</TableCell>
                                    <TableCell>{semester.academic_year.name}</TableCell>
                                    <TableCell className="font-medium">{semester.year_name}
                                        {semester.is_final_year ? (
                                            <Badge className="bg-emerald-50 -mt-3 text-emerald-700 border-emerald-200 hover:bg-emerald-50 shadow-none">
                                                Final Year
                                            </Badge>
                                        ) : ""}
                                    </TableCell>

                                    {/* Year Name Eng Column - Design ပြင်ဆင်ထားမှု */}
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border-none">
                                            {semester.year_name_eng}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-slate-600">
                                        {getSemesterText(semester.semester_number)}
                                    </TableCell>



                                    <TableCell className="text-slate-500 tabular-nums">{semester.start_date}</TableCell>
                                    <TableCell className="text-slate-500 tabular-nums">{semester.end_date}</TableCell>

                                    <TableCell className="text-center space-x-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm" // ခလုတ်ကို အနည်းငယ် သေးလိုက်တာ ပိုလှပါတယ်
                                                        onClick={() => openEditDialog(semester)}
                                                        className="text-slate-600 border-slate-200 hover:bg-slate-100"
                                                    >
                                                        ပြင်ဆင်ရန်
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit Semester</p>
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
            </Card>
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

                                    {/* Year Selection */}
                                    <div>
                                        <Label htmlFor="edit_year_name">သင်တန်းနှစ်အမည် (ဥပမာ- ပထမနှစ်)</Label>
                                        <Select
                                            value={String(editData.year_name)}
                                            onValueChange={(value) => setEditData("year_name", value)}
                                        >
                                            <SelectTrigger id="edit_year_name">
                                                <SelectValue placeholder="သင်တန်းနှစ် ရွေးချယ်ပါ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ပထမနှစ်">ပထမနှစ်</SelectItem>
                                                <SelectItem value="ဒုတိယနှစ်">ဒုတိယနှစ်</SelectItem>
                                                <SelectItem value="တတိယနှစ်">တတိယနှစ်</SelectItem>
                                                <SelectItem value="စတုတ္ထနှစ်">စတုတ္ထနှစ်</SelectItem>
                                                <SelectItem value="ပဉ္စမနှစ်">ပဉ္စမနှစ်</SelectItem>
                                                <SelectItem value="D.C.Sc.">D.C.Sc.</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={editErrors.year_name} />
                                    </div>
                                    {/* semseter name eng */}
                                    <div>
                                        <Label htmlFor="edit_year_name_eng">သင်တန်းနှစ်အမည် (Eng) (ဥပမာ- First Year)</Label>
                                        <Select
                                            value={String(editData.year_name_eng)}
                                            onValueChange={(value) => setEditData("year_name_eng", value)}
                                        >
                                            <SelectTrigger id="edit_year_name_eng">
                                                <SelectValue placeholder="သင်တန်းနှစ် ရွေးချယ်ပါ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableYearEngEdit.map((sem) => (
                                                    <SelectItem key={sem.value} value={String(sem.value)}>
                                                        {sem.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={editErrors.year_name_eng} />
                                    </div>
                                    {/* Semester Selection */}
                                    <div>
                                        <Label htmlFor="edit_semester_number">သင်တန်းကာလ ရွေးချယ်ပါ</Label>
                                        <Select
                                            disabled={!editData.year_name}
                                            value={editData.semester_number ? String(editData.semester_number) : ""}
                                            onValueChange={(value) => setEditData("semester_number", Number(value))}
                                        >
                                            <SelectTrigger id="edit_semester_number">
                                                <SelectValue placeholder="သင်တန်းကာလ ရွေးချယ်ပါ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableSemestersEdit.map((sem) => (
                                                    <SelectItem key={sem.value} value={String(sem.value)}>
                                                        {sem.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={editErrors.semester_number} />
                                    </div>
                                    {/* Final Year Checkbox Section */}
                                    <div className="flex items-center space-x-2 rounded-md border p-4 shadow-sm bg-slate-50/50">
                                        <Checkbox
                                            id="is_final_year"
                                            checked={editData.is_final_year}
                                            onCheckedChange={(checked) => setEditData("is_final_year", checked)}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <label
                                                htmlFor="is_final_year"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                နောက်ဆုံးနှစ် (Final Year) ဖြစ်ပါသလား။
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                နောက်ဆုံးနှစ်ဖြစ်ပါက GPA ကို နှစ်ဝက်နှစ်ခုပေါင်း၍ တွက်ချက်မည်ဖြစ်ပါသည်။
                                            </p>
                                        </div>
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
                                        <Button variant="outline" >ပယ်ဖျက်မည်< /Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={updating}>
                                        {updating && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
                                        ပြုပြင်မည်
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
