// EditDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InputError from "@/components/input-error"
import { FormEventHandler, useRef } from "react"

export default function EditCourseModal({
    open,
    onOpenChange,
    data,
    setData,
    errors,
    processing,
    onSubmit,
    majors,
}) {

    const closeCreateRef = useRef(null);
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>ဘာသာရပ်  ပြင်ဆင်ခြင်း</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="name">ဘာသာရပ် အမည်</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="code">ဘာသာရပ် ကုဒ်</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData("code", e.target.value)}
                            />
                            <InputError message={errors.code} />
                        </div>
                        <div>
                            <Label>အဓိက ဘာသာရပ် ရွေးချယ်ပါ</Label>
                            <div className="space-y-2 mt-1">
                                {majors.map((major) => (
                                    <div key={major.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`edit_major_${major.id}`}
                                            value={major.id}
                                            checked={data.major_ids.includes(major.id.toString())}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setData("major_ids", [...data.major_ids, e.target.value]);
                                                } else {
                                                    setData(
                                                        "major_ids",
                                                        data.major_ids.filter((id) => id !== e.target.value)
                                                    );
                                                }
                                            }}
                                            className="mr-2"
                                        />
                                        <Label htmlFor={`edit_major_${major.id}`} className="cursor-pointer">
                                            {major.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <InputError message={errors.major_ids} />
                        </div>
                        <div>

                            <Label htmlFor="description">ဖော်ပြချက်</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                            />
                            <InputError message={errors.description} />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button ref={closeCreateRef} variant="outline">
                                ပယ်ဖျက်မည်
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            အဆင့်မြင့်တင်မည်
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
