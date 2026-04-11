
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import nrcData from '@/constants/NRCData';
import TextLink from '@/components/text-link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import NRCInputFields from '@/components/NRCInputFields';
import { Table, TableCell, TableRow } from '@/components/ui/table';
import { getSemesterText } from '@/Utils/SemesterText';
import StudentForm from './Form';

type Semester = {
    id: number;
    name: string;
};

type Course = {
    id: number;
    name: string;
};

type CreateProps = {
    semesters: Semester[];
    courses: Course[];
};

export default function EnrollEdit({ enrollment }: any) {
    return (<StudentForm
        enrollment={enrollment}
    />
    );
}
