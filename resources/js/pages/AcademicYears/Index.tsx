// resources/js/Pages/AcademicYears/Index.tsx
import { useState, useRef, FormEventHandler } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router, useForm } from "@inertiajs/react";
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
import AcademicYearCreateDialog from "./AcademicYearCreateDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Index({ academicYears }) {



    // Edit Form State
    const [editingYear, setEditingYear] = useState(null);
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: updating,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        name: "",
        start_date: "",
        end_date: "",
    });

    const openEditDialog = (year) => {
        setEditingYear(year);
        setEditData({
            name: year.name,
            start_date: year.start_date,
            end_date: year.end_date,
        });
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingYear) return;
        put(route("academic-years.update", editingYear.id), {
            onSuccess: () => {
                resetEdit();
                setEditingYear(null);
            },
        });
    };

    // Delete Handler
    const deleteHandler = (id) => {
        router.delete(route("academic-years.destroy", id));
    };

    return (
        <AppLayout title="ပညာသင်နှစ်များ" breadcrumbs={[
            { name: "ပညာသင်နှစ်များ" }
        ]}>
            <Head title="ပညာသင်နှစ်များ" />

            {/* Create Dialog */}
            <div className="text-right mb-4">
                <AcademicYearCreateDialog />
            </div>


            {/* ပညာသင်နှစ်များ Table */}
            <Table>
                <TableCaption>ပညာသင်နှစ် စာရင်း</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>စဉ်</TableHead>
                        <TableHead>ပညာသင်နှစ်အမည်</TableHead>
                        <TableHead>စတင်သည့်ရက်စွဲ</TableHead>
                        <TableHead>ပြီးဆုံးသည့်ရက်စွဲ</TableHead>
                        <TableHead className="">လုပ်ဆောင်ချက်များ</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {academicYears.length > 0 ? (
                        academicYears.map((year, index) => (
                            <TableRow key={year.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{year.name}</TableCell>
                                <TableCell>{year.start_date}</TableCell>
                                <TableCell>{year.end_date}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => openEditDialog(year)}
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
                                            <Button variant="destructive">Delete</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete academic year "
                                                    <strong>{year.name}</strong>"? This action cannot be
                                                    undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="text-red-600"
                                                    onClick={() => deleteHandler(year.id)}
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog> */}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                ပညာသင်နှစ်မရှိပါ။
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Edit Dialog */}
            {
                editingYear && (
                    <Dialog open={true} onOpenChange={() => setEditingYear(null)}>
                        <DialogContent className="sm:max-w-lg">
                            <form onSubmit={submitEdit}>
                                <DialogHeader>
                                    <DialogTitle>ပညာသင်နှစ်ကို ပြင်ဆင်ရန်</DialogTitle> {/* Edit Academic Year */}
                                    <DialogDescription>
                                        ပညာသင်နှစ်အသေးစိတ်အချက်အလက်များကို ပြင်ဆင်ပါ {/* Update academic year details */}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4">
                                    <div>
                                        <Label htmlFor="edit_name">ပညာသင်နှစ်အမည်</Label>
                                        <Input
                                            id="edit_name"
                                            name="name"
                                            value={editData.name}
                                            onChange={(e) => setEditData("name", e.target.value)}
                                            autoFocus
                                        />
                                        <InputError message={editErrors.name} />
                                    </div>

                                    <div>
                                        <Label htmlFor="edit_start_date">စတင်သည့်ရက်စွဲ</Label>
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
                                        <Label htmlFor="edit_end_date">End Date</Label>
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
                                        {updating && (
                                            <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                                        )}
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
