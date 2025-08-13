import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { router } from "@inertiajs/react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
interface Major {
    id: number;
    name: string;
}

interface Course {
    id: number;
    name: string;
    code: string;
    description: string;
    is_elective: boolean;
    majors: Major[];
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

const deleteHandler = (id) => {
    router.delete(route("courses.destroy", id));
};
export const columns = (openEditDialog: (course: Course) => void): ColumnDef<Course>[] => [
    {
        accessorKey: "name",
        header: "ဘာသာရပ်အမည်", // Course Name
    },
    {
        accessorKey: "code",
        header: "ကုဒ်နံပါတ်", // Code
    },
    {
        accessorKey: "description",
        header: "ဖော်ပြချက်", // Description
    },
    {
        accessorKey: "majors",
        header: "အထူးပြုဘာသာရပ်များ", // Majors
        cell: ({ row }) =>
            row.original.majors.map((m: Major) => m.name).join(", "),
    },
    {
        accessorKey: "is_elective",
        header: "ရွေးချယ်ဘာသာရပ်", // Elective
        cell: ({ row }) => (row.original.is_elective ? "ဟုတ်သည်" : "မဟုတ်ပါ"), // Yes / No
    },
    {
        id: "actions",
        header: "လုပ်ဆောင်ချက်များ", // Actions
        cell: ({ row }) => {
            const course = row.original
            return (
                <>
                    <Button
                        variant="outline"
                        onClick={() => openEditDialog(course)}
                        className="mr-2"
                    >
                        ပြင်ဆင်ရန် {/* Edit */}
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                ဖျက်ရန် {/* Delete */}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>သေချာပါပြီလား။</AlertDialogTitle> {/* Are you absolutely sure? */}
                                <AlertDialogDescription>
                                    ဤသင်တန်း <b>{course.name}</b> ကို အပြီးအပိုင်ဖျက်ပစ်ပါမည်။ {/* This will delete the course ... permanently. */}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>ပယ်ဖျက်ရန်</AlertDialogCancel> {/* Cancel */}
                                <AlertDialogAction
                                    onClick={() => router.delete(route("courses.destroy", course.id))}
                                >
                                    အတည်ပြုရန် {/* Confirm */}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )
        },
    },
]
