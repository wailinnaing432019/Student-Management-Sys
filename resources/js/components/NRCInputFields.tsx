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

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface Props {
    nrcData: Record<string, string[]>;
    state?: string;
    township?: string;
    type?: string;
    number?: string;
    prefix: string; // e.g. "", "father_", "mother_"
    errors?: Record<string, string>;
    onChange: (key: string, value: string) => void;
    isDisabled: boolean;
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
    const [open, setOpen] = useState(false);
    const [openState, setOpenState] = useState(false);
    return (
        <div>
            <div className="flex gap-2 max-w-xl text-xs">
                {/* State */}

                <div className="flex-1 min-w-[60px]">
                    <Popover open={openState} onOpenChange={setOpenState}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="h-9 text-xs w-full flex justify-between items-center"
                                disabled={isDisabled}
                            >
                                <span className="truncate">{state || ""}</span>
                                {/* <ChevronsUpDown className="h-3 w-3 opacity-50 ml-2 shrink-0" /> */}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="" className="text-xs" />
                                <CommandEmpty>မတွေ့ပါ</CommandEmpty>
                                <CommandGroup>
                                    {Object.keys(nrcData)
                                        .sort((a, b) => Number(a) - Number(b)) // sort 1–12
                                        .map((key) => (
                                            <CommandItem
                                                key={key}
                                                value={key}
                                                onSelect={(value) => {
                                                    onChange(`${prefix}nrc_state`, value);
                                                    setOpenState(false);
                                                }}
                                                className="text-xs"
                                            >
                                                {key}
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                {/* Township (Searchable Combobox) */}
                <div className="flex-[2] min-w-[100px]">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="h-9 text-xs w-full flex justify-between items-center"
                                disabled={isDisabled}
                            >
                                <span className="truncate">{township || ""}</span>
                                <ChevronsUpDown className="h-3 w-3 opacity-50 ml-2 shrink-0" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput
                                    placeholder=""
                                    className="text-xs"
                                />
                                <CommandEmpty>မတွေ့ပါ</CommandEmpty>
                                <CommandGroup>
                                    {(nrcData[state!] ?? []).map((ts) => (
                                        <CommandItem
                                            key={ts}
                                            value={ts}
                                            onSelect={(value) => {
                                                onChange(`${prefix}nrc_township`, value);
                                                setOpen(false);
                                            }}
                                            className="text-xs"
                                        >
                                            {ts}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Type */}
                <div className="flex-1 min-w-[60px]">
                    <Select
                        disabled={isDisabled}
                        value={type}
                        onValueChange={(value) => onChange(`${prefix}nrc_type`, value)}
                    >
                        <SelectTrigger className="h-9 text-xs">
                            <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="နိုင်" className="text-xs">
                                နိုင်
                            </SelectItem>
                            <SelectItem value="ပြု" className="text-xs">
                                ပြု
                            </SelectItem>
                            <SelectItem value="ဧည့်" className="text-xs">
                                ဧည့်
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Number */}
                <div className="flex-[2] min-w-[120px]">
                    <Input
                        disabled={isDisabled}
                        type="text"
                        value={number}
                        onChange={(e) =>
                            onChange(`${prefix}nrc_number`, e.target.value)
                        }
                        placeholder="၁၂၃၄၅၆"
                        className="h-9 text-xs"
                    />
                </div>
            </div>

            {/* Errors */}
            <InputError message={errors?.[`${prefix}nrc_state`]} />
            <InputError message={errors?.[`${prefix}nrc_township`]} />
            <InputError message={errors?.[`${prefix}nrc_type`]} />
            <InputError message={errors?.[`${prefix}nrc_number`]} />
        </div>
    );
}
