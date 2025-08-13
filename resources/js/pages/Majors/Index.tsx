// MajorsIndex.tsx

import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

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
} from "@/components/ui/alert-dialog"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Majors',
        href: '/majors',
    },
];

type MajorForm = {
    name: string;
    description: string;
};

export default function Index({ majors }) {
    const [editingMajors, setEditingMajors] = useState<MajorForm & { id: number } | null>(null);

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: updating,
        errors: editErrors,
        reset: resetEditForm
    } = useForm<MajorForm>({
        name: '',
        description: '',
    });

    const openEditDialog = (major) => {
        setEditingMajors(major);
        setEditData({
            name: major.name,
            description: major.description
        });
    };

    const updateMajors: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingMajors) return;
        put(route('majors.update', editingMajors.id), {
            onSuccess: () => {
                resetEditForm();
                setEditingMajors(null);
            },
        });
    };

    const closeRef = useRef<HTMLButtonElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<Required<MajorForm>>({
        name: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('majors.store'), {
            onSuccess: () => {
                reset();
                closeRef.current?.click();
            }
        });
    };

    const destroyHandle = (id: number, name: string) => {
        router.delete(route('majors.destroy', id));
    };

    return (
        <AppLayout breadcrumbs={[
            { name: "အထူးပြု ဘာသာရပ်များ" }
        ]}>
            <Head title="အထူးပြု ဘာသာရပ်များ" />

            <div className='text-right'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="m-2 p-2 bg-green-500 rounded hover:bg-green-900 hover:font-extrabold">အဓိက ဘာသာရပ်ဖန်းတီးမည်</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={submit}>
                            <DialogHeader className='mb-4'>
                                <DialogTitle>အထူးပြု ဘာသာရပ်ဖန်တီးခြင်း</DialogTitle>
                                <DialogDescription>အထူးပြု ဘာသာရပ် အသစ်တစ်ခု ဖန်တီးပါ။</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">အထူးပြု ဘာသာရပ် အမည် (ဥပမာ- ကွန်ပျူတာ သိပ္ပံ - CS)</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        autoFocus
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="description">အထူးပြု ဘာသာရပ် အတွက်ဖော်ပြချက်</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder=''
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>
                            </div>
                            <DialogFooter className='m-3'>
                                <DialogClose asChild>
                                    <Button ref={closeRef} className=" bg-gray-400  p-2 rounded">ပယ်ဖျက်မည်</Button>
                                </DialogClose>
                                <Button type="submit" className="p-1   rounded" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    {processing ? "ဖန်တီးနေပါသည်" : "ဖန်တီးမည်"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Table>
                    <TableCaption>အထူးပြုဘာသာရပ်များ စာရင်း</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>အထူးပြု ဘာသာရပ် အမည်</TableHead>
                            <TableHead>အထူးပြု ဘာသာရပ် အတွက်ဖော်ပြချက်</TableHead>
                            <TableHead className="text-right">လုပ်ဆောင်ချက်များ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {majors.length > 0 ? (
                            majors.map((major) => (
                                <TableRow key={major.id}>
                                    <TableCell>{major.id}</TableCell>
                                    <TableCell>{major.name}</TableCell>
                                    <TableCell>{major.description}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button className='mt-4 bg-green-800 hover:bg-green-400' onClick={() => openEditDialog(major)}>Edit</Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" className='mt-4 bg-red-800 hover:bg-red-400'>Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader className='text-red-700'>
                                                    <AlertDialogTitle>ပယ်ဖျက်ခြင်းကို အတည်ပြုခြင်း</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        ဤအဓိက ဘာသာကို ဖျက်မည် သေချာပါပြီလား။ "<strong>{major.name}</strong>"? ဤလုပ်ဆောင်ချက်သည် ပြန်ပြင်၍ မရနိုင်ပါ။
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>ပယ်ဖျက်မည်</AlertDialogCancel>
                                                    <AlertDialogAction className='text-red-700 hover:bg-gray-900' onClick={() => destroyHandle(major.id, major.name)}>သေချာပါသည်</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center  text-muted-foreground">
                                    အဓိက ဘာသာရပ် မရှိပါ။ အဓိက ဘာသာရပ်ရှိရန် လိုအပ်ပါသည်။ <span className='text-red-600'>အသစ်ဖန်တီးပါ</span>

                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {editingMajors && (
                <Dialog open={!!editingMajors} onOpenChange={() => setEditingMajors(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={updateMajors}>
                            <DialogHeader>
                                <DialogTitle>အဓိက ဘာသာရပ် ပြုပြင်ခြင်း</DialogTitle>
                                <DialogDescription>အဓိက ဘာသာရပ်ကို အသေးစိပ် ပြုပြင်ခြင်း</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">အဓိက ဘာသာရပ် အမည်</Label>
                                    <Input
                                        id="name"
                                        value={editData.name}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                    />
                                    <InputError message={editErrors.name} className="mt-2" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="description">အဓိက ဘာသာရပ် အတွက်ဖော်ပြချက်</Label>
                                    <Input
                                        id="description"
                                        value={editData.description}
                                        onChange={(e) => setEditData('description', e.target.value)}
                                    />
                                    <InputError message={editErrors.description} className="mt-2" />
                                </div>
                            </div>
                            <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                    <Button type="button" className="bg-red-500" onClick={() => setEditingMajors(null)}>Cancel</Button>
                                </DialogClose>
                                <Button type="submit" className="bg-green-600" disabled={updating}>
                                    {updating ? 'Updating...' : 'Update Majors'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </AppLayout>
    );
}
