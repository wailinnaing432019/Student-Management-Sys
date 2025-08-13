import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef } from "react";
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
import { LoaderCircle } from "lucide-react";

export default function AcademicYearCreateDialog() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        start_date: "",
        end_date: "",
    });
    const closeCreateRef = useRef<HTMLButtonElement | null>(null);

    const submitCreate: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("academic-years.store"), {
            onSuccess: () => {
                reset();
                closeCreateRef.current?.click();
            },
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                    ပညာသင်နှစ်အသစ်ထည့်ရန်
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={submitCreate}>
                    <DialogHeader>
                        <DialogTitle>ပညာသင်နှစ်အသစ်ဖန်တီးပါ</DialogTitle>
                        <DialogDescription>
                            ပညာသင်နှစ်အသစ်တစ်ခု ထည့်ပါ (ဥပမာ ၂၀၂၄-၂၀၂၅)
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div>
                            <Label htmlFor="name">ပညာသင်နှစ်အမည်</Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="၂၀၂၄-၂၀၂၅"
                                autoFocus
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="start_date">စတင်သည့်ရက်စွဲ</Label>
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
                            <Label htmlFor="end_date">ပြီးဆုံးသည့်ရက်စွဲ</Label>
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
                                ပယ်ဖျက်ရန်
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing && (
                                <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            ဖန်တီးမည်
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}