import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StatusSelect({ enrollment }) {
    const { data, setData, post, processing, errors } = useForm({
        status: enrollment.status ?? "Pending",
    });

    // Keep in sync with server updates
    useEffect(() => {
        setData("status", enrollment.status ?? "Pending");
    }, [enrollment.status]);

    const handleChange = (value) => {
        // Optimistically update the local state first for a better user experience
        setData("status", value);


        // Send the post request with the specific data payload
        post(route("enroll-students.update-status", enrollment.id), {
            data: { status: value }, // Explicitly send the new value
            preserveScroll: true,
            onSuccess: () => {
                alert(data.status)
                // Optional: Re-sync the form data with the new value on success
                // This is good practice to ensure consistency.
                setData("status", value);
            },
            onError: () => {
                // Revert to the old status if the request fails
                setData("status", enrollment.status ?? "Pending");
            },
        });
    };

    return (
        <Select
            value={String(data.status)}
            onValueChange={handleChange}
            disabled={processing}
        >
            <SelectTrigger className="w-full rounded-none border-0 border-b-2 focus:ring-0 focus:outline-none">
                <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Pending">လျှောက်ထားဆဲ</SelectItem>
                <SelectItem value="Accept">လက်ခံမည်</SelectItem>
                <SelectItem value="Reject">ငြင်းပယ်မည်</SelectItem>
            </SelectContent>
        </Select>
    );
}