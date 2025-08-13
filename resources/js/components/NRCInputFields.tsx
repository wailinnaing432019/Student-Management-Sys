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
        <div className="flex space-x-1 max-w-md">
            {/* State */}
            <div className="w-1/6">
                <Select
                    disabled={isDisabled}
                    value={state}
                    onValueChange={(value) => onChange(`${prefix}nrc_state`, value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(nrcData).map((key) => (
                            <SelectItem key={key} value={key}>
                                {key}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors?.[`${prefix}nrc_state`]} />
            </div>

            {/* Township */}
            <div className="w-2/6">
                <Select
                    disabled={isDisabled}

                    value={township}
                    onValueChange={(value) => onChange(`${prefix}nrc_township`, value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Township" />
                    </SelectTrigger>
                    <SelectContent>
                        {(nrcData[state!] ?? []).map((ts) => (
                            <SelectItem key={ts} value={ts}>
                                {ts}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors?.[`${prefix}nrc_township`]} />
            </div>

            {/* Type */}
            <div className="w-1/6">
                <Select
                    disabled={isDisabled}
                    value={type}
                    onValueChange={(value) => onChange(`${prefix}nrc_type`, value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="နိုင်">နိုင်</SelectItem>
                        <SelectItem value="ပြု">ပြု</SelectItem>
                        <SelectItem value="ဧည့်">ဧည့်</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors?.[`${prefix}nrc_type`]} />
            </div>

            {/* Number */}
            <div className="w-3/6">
                <Input
                    disabled={isDisabled}
                    type="text"
                    value={number}
                    onChange={(e) => onChange(`${prefix}nrc_number`, e.target.value)}
                    placeholder="၁၂၃၄၅၆"
                />
                <InputError message={errors?.[`${prefix}nrc_number`]} />
            </div>
        </div>
    );
}
