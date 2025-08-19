import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    nrcData: Record<string, string[]>;
    state?: string;
    township?: string;
    type?: string;
    number?: string;
    prefix: string; // e.g. "", "father_", "mother_"
    errors?: Record<string, string>;
    onChange: (key: string, value: string) => void;
    isDisabled: boolean
}

export default function NRCInputFields({
    nrcData,
    state,
    township,
    type,
    number,
    prefix,
    errors,
    onChange,
    isDisabled,
}: Props) {
    return (
        <div>
            <div className="flex gap-2 max-w-xl text-xs">
                {/* State */}
                <div className="flex-1 min-w-[60px]">
                    <Select
                        disabled={isDisabled}
                        value={state}
                        onValueChange={(value) => onChange(`${prefix}nrc_state`, value)}
                    >
                        <SelectTrigger className="h-9 text-xs">
                            <SelectValue placeholder="အမှတ်စဉ်" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(nrcData).map((key) => (
                                <SelectItem key={key} value={key} className="text-xs">
                                    {key}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                </div>

                {/* Township */}
                <div className="flex-[2] min-w-[100px]">
                    <Select
                        disabled={isDisabled}
                        value={township}
                        onValueChange={(value) => onChange(`${prefix}nrc_township`, value)}
                    >
                        <SelectTrigger className="h-9 text-xs">
                            <SelectValue placeholder="မြို့" />
                        </SelectTrigger>
                        <SelectContent>
                            {(nrcData[state!] ?? []).map((ts) => (
                                <SelectItem key={ts} value={ts} className="text-xs">
                                    {ts}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Type */}
                <div className="flex-1 min-w-[60px]">
                    <Select
                        disabled={isDisabled}
                        value={type}
                        onValueChange={(value) => onChange(`${prefix}nrc_type`, value)}
                    >
                        <SelectTrigger className="h-9 text-xs">
                            <SelectValue placeholder="အမျိုးစား" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="နိုင်" className="text-xs">နိုင်</SelectItem>
                            <SelectItem value="ပြု" className="text-xs">ပြု</SelectItem>
                            <SelectItem value="ဧည့်" className="text-xs">ဧည့်</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Number */}
                <div className="flex-[2] min-w-[120px]">
                    <Input
                        disabled={isDisabled}
                        type="text"
                        value={number}
                        onChange={(e) => onChange(`${prefix}nrc_number`, e.target.value)}
                        placeholder="၁၂၃၄၅၆"
                        className="h-9 text-xs"
                    />
                </div>



            </div>
            <InputError message={errors?.[`${prefix}nrc_state`]} />
            <InputError message={errors?.[`${prefix}nrc_township`]} />
            <InputError message={errors?.[`${prefix}nrc_type`]} />
            <InputError message={errors?.[`${prefix}nrc_number`]} />

        </div>
    );
}