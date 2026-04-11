
import { Head, router, useForm, usePage } from '@inertiajs/react';
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
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getSemesterText } from '@/Utils/SemesterText';
import ImageUpload from './ImageUpload';

type Props = {
    enrollment?: any
}
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

export default function StudentForm({ enrollment }: Props) {
    const { academic_years, majors } = usePage().props;

    // Use camelCase keys coming from Laravel
    const student = enrollment?.student;
    const profile = enrollment?.student_semester_profile; // corrected 
    // const profile = studentEnrollment.student_semester_profile
    const donor = enrollment?.student_semester_profile.donor;
    const { data, setData, put, post, processing, errors } = useForm({
        // Student info 
        name_myan: student?.name_myan ?? '',
        name_eng: student?.name_eng ?? '',
        academic_year_id: enrollment?.academic_year_id ?? '',
        semester_id: enrollment?.semester_id ?? '',
        major_id: enrollment?.major_id ?? '',
        roll_no: profile?.roll_no ?? '',
        uid: student?.uid ?? '',
        entried_year: student?.entried_year ?? '',


        nrc_state: student?.nrc_state ?? '',
        nrc_township: student?.nrc_township ?? '',
        nrc_type: student?.nrc_type ?? '',
        nrc_number: student?.nrc_number ?? '',

        dob: student?.dob ?? '',
        // gender: student?.gender ?? '',
        ethnicity: student?.ethnicity ?? '',
        religion: student?.religion ?? '',
        hometown: student?.hometown ?? '',
        township_state_region: student?.township_state_region ?? '',
        local_foreign: student?.local_foreign ?? '',

        matriculation_passed_year: student?.matriculation_passed_year ?? '',
        matriculation_passed_roll_no: student?.matriculation_passed_roll_no ?? '',
        examination_center: student?.examination_center ?? '',

        permanent_address: profile?.permanent_address ?? '',
        phone: profile?.phone ?? '',
        email: profile?.email ?? '',

        // mother
        mother_name_myan: student?.mother?.name_myan ?? '',
        mother_name_eng: student?.mother?.name_eng ?? '',
        mother_ethnicity: student?.mother?.ethnicity ?? '',
        mother_religion: student?.mother?.religion ?? '',
        mother_hometown: student?.mother?.hometown ?? '',
        mother_township_state_region: student?.mother?.township_state_region ?? '',
        mother_nrc_state: student?.mother?.nrc_state ?? '',
        mother_nrc_township: student?.mother?.nrc_township ?? '',
        mother_nrc_type: student?.mother?.nrc_type ?? '',
        mother_nrc_number: student?.mother?.nrc_number ?? '',
        mother_job: student?.mother?.job ?? '',
        mother_local_foreign: student?.mother?.local_foreign ?? '',

        // father
        father_name_myan: student?.father?.name_myan ?? '',
        father_name_eng: student?.father?.name_eng ?? '',
        father_ethnicity: student?.father?.ethnicity ?? '',
        father_religion: student?.father?.religion ?? '',
        father_hometown: student?.father?.hometown ?? '',
        father_township_state_region: student?.father?.township_state_region ?? '',
        father_nrc_state: student?.father?.nrc_state ?? '',
        father_nrc_township: student?.father?.nrc_township ?? '',
        father_nrc_type: student?.father?.nrc_type ?? '',
        father_nrc_number: student?.father?.nrc_number ?? '',
        father_job: student?.father?.job ?? '',
        father_local_foreign: student?.father?.local_foreign ?? '',

        // donor
        donor_name: donor?.name ?? '',
        donor_relationship: donor?.relationship ?? '',
        donor_job: donor?.job ?? '',
        donor_phone: donor?.phone ?? '',
        donor_address: donor?.address ?? '',
        donor_status: donor?.status ?? '',

        image: null as File | null,
        // exams
        exam_records: student?.exams_taken?.length
            ? student.exams_taken.map((e: any) => ({
                exam_name: e.exam_name,
                exam_major: e.major,
                exam_roll_no: e.roll_no,
                exam_year: e.year,
                exam_pass_fail: e.pass_fail,
            }))
            : [
                {
                    exam_name: '',
                    exam_major: '',
                    exam_roll_no: '',
                    exam_year: '',
                    exam_pass_fail: '',
                },
            ],

        agreed: true,
    });


    const breadcrumbs = [
        { name: "Students", href: "/students" },
        { name: "Edit" }
    ];

    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCode, setSelectedCode] = useState('');
    const [nrcNumber, setNrcNumber] = useState('');



    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('enroll-students.update', enrollment.id), {
            _method: 'put',
            forceFormData: true,
        });

    };

    const addExamRow = () => {
        setData('exam_records', [
            ...data.exam_records,
            {
                exam_name: '',
                exam_major: '',
                exam_roll_no: '',
                exam_year: '',
                exam_pass_fail: '',

            }
        ])
    }

    const removeExamRow = (index: number) => {
        const updated = [...data.exam_records]
        updated.splice(index, 1)
        setData('exam_records', updated)
    }
    const handleExamChange = (index: number, field: string, value: string) => {
        const updated = [...data.exam_records]
        updated[index][field] = value
        setData('exam_records', updated)
    }

    // const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(data.academic_year_id || '')
    const [filteredSemesters, setFilteredSemesters] = useState([])


    useEffect(() => {
        const year = academic_years.find((y) => String(y.id) === String(data.academic_year_id));
        setFilteredSemesters(year ? year.semesters : []);

        // Reset semester_id when academic year changes
        // Only reset if there's no existing semester_id
        if (!data.semester_id) {
            setData('semester_id', '');
        }
    }, [data.academic_year_id]);
    return (
        <AppLayout>


            <div className="w-full mx-auto  p-2 m-3  rounded shadow" >
                {/* {Object.keys(errors).length > 0 && (
                    <div className="bg-red-100 p-4 rounded">
                        {Object.entries(errors).map(([k, v]) => (
                            <p key={k} className="text-red-600">
                                {k}: {v}
                            </p>
                        ))}
                    </div>
                )} */}
                <form onSubmit={submit} className="flex flex-col gap-2">
                    {/* Student Info */}
                    <section >
                        <div className='flex text-2xl '>
                            <div className="w-2/11">
                            </div>
                            <div className=' w-2/11 '>
                                <Select
                                    value={String(data.academic_year_id)}
                                    onValueChange={(value) => setData('academic_year_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="ပညာသင်နှစ် ရွေးချယ်ပါ။" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {academic_years.length > 0 ? (
                                                academic_years.map((year) => (
                                                    <SelectItem key={year.id} value={String(year.id)}>
                                                        {year.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-4 py-2 text-red-500 text-sm">ပညာသင်နှစ်မရှိပါ။</div>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.academic_year_id} />
                            </div>

                            <div className=' w-5/11  '>
                                ပညာသင်နှစ်၊ ကျောင်းသား/သူ ပညာသင်ခွင့်လျှောက်လွှာ
                            </div>
                        </div>
                        <div className='text-center mt-3'>
                            <h3 >ကွန်ပျူတာ တက္ကသိုလ် ၊ မိတ္ထီလာမြို့ </h3>
                        </div>
                    </section>

                    {/* Guardian Info */}
                    <section>
                        <div className="flex mx-auto p-4  rounded shadow ">
                            <div className='w-2/5'>

                                <div className="grid gap-2">



                                    <ImageUpload from="edit" profile={profile}      // your profile object (optional)
                                        data={data}            // your state object that holds the image
                                        setData={setData} />
                                    {/* <InputError message={errors.image} /> */}
                                </div>
                            </div>

                            <div className='w-3/5'>
                                <div>


                                    <div>
                                        <div >
                                            <div>
                                                <div>
                                                    <label>သင်တန်းနှစ်</label>
                                                    <Select
                                                        value={String(data.semester_id)}
                                                        onValueChange={(value) => setData('semester_id', value)}
                                                    >
                                                        <SelectTrigger id="semester_id">
                                                            <SelectValue placeholder="သင်တန်းကာလ ရွေးချယ်ပါ။" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {filteredSemesters.length > 0 ? (
                                                                    [...filteredSemesters]
                                                                        .sort((a: any, b: any) => a.semester_number - b.semester_number) // sort by number
                                                                        .map((s: any) => (
                                                                            <SelectItem key={s.id} value={String(s.id)}>
                                                                                {s.year_name} - {getSemesterText(s.semester_number)}
                                                                            </SelectItem>
                                                                        ))
                                                                ) : (
                                                                    <div className="px-4 py-2 text-red-500 text-sm">သင်တန်းကာလ မရှိပါ</div>
                                                                )}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError message={errors.semester_id} />
                                                </div>
                                            </div>

                                        </div>
                                        <div >
                                            <div  >အထူးပြု ဘာသာ</div>
                                            <div>
                                                <div>
                                                    <Select
                                                        value={String(data.major_id)}
                                                        onValueChange={(value) => setData('major_id', value)}
                                                    >
                                                        <SelectTrigger id="major_id">
                                                            <SelectValue placeholder="အထူးပြု ဘာသာ ရွေးချယ်ပါ" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {(majors?.length ?? 0) > 0 ? (majors.map((s) => (
                                                                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                                                ))) : (
                                                                    <div className="px-4 py-2 text-red-500 text-sm">အထူးပြုဘာသာရပ်များ မရှီသေးပါ။</div>

                                                                )}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError message={errors.major_id} />
                                                </div>
                                            </div>

                                        </div>
                                        <div >
                                            <div  >ခုံအမှတ်</div>
                                            <div><Input
                                                id="roll_no"
                                                value={data.roll_no}
                                                onChange={(e) => setData('roll_no', e.target.value)}
                                                placeholder="ခုံအမှတ်"
                                            />
                                                <InputError message={errors.roll_no} /></div>

                                        </div>
                                        <div >
                                            <div  >ကျောင်းသားမှတ်ပုံတင် အမှတ်</div>
                                            <div><Input
                                                id="uid"
                                                value={data.uid}
                                                onChange={(e) => setData('uid', e.target.value)}
                                                placeholder="ကျောင်းသားမှတ်ပုံတင် အမှတ်"
                                            />
                                                <InputError message={errors.uid} /></div>

                                        </div>
                                        <div >
                                            <div  >တက္ကသိုလ်၀င်ရောက်သည့်နှစ်</div>
                                            <div><Input
                                                id="entried_year"
                                                value={data.entried_year}
                                                onChange={(e) => setData('entried_year', e.target.value)}
                                                placeholder="တက္ကသိုလ်၀င်ရောက်သည့်နှစ်"
                                            />
                                                <InputError message={errors.entried_year} /></div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Registration Info */}
                    <section className="space-y-8">
                        {/* Section 1 - Student Info */}
                        <Card className="p-6 space-y-6">
                            <h2 className="text-lg font-semibold">၁။ ပညာဆက်လက်သင်ခွင့်တောင်းခံသူ</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Name in Burmese and English */}
                                <div>
                                    <Label>အမည် (မြန်မာ)</Label>
                                    <Input id="name_myan" value={data.name_myan} onChange={(e) => setData('name_myan', e.target.value)} placeholder='အမည်' />
                                    <InputError message={errors.name_myan} />
                                </div>
                                <div>
                                    <Label>အဖအမည် (မြန်မာ)</Label>
                                    <Input id="father_name_myan" value={data.father_name_myan} onChange={(e) => setData('father_name_myan', e.target.value)} placeholder='အဖ အမည်' />
                                    <InputError message={errors.father_name_myan} />
                                </div>
                                <div>
                                    <Label>အမိအမည် (မြန်မာ)</Label>
                                    <Input id="mother_name_myan" value={data.mother_name_myan} onChange={(e) => setData('mother_name_myan', e.target.value)} placeholder='အမိ အမည်' />
                                    <InputError message={errors.mother_name_myan} />
                                </div>
                                <div>
                                    <Label>အမည် (အင်္ဂလိပ်)</Label>
                                    <Input id="name_eng" value={data.name_eng} onChange={(e) => setData('name_eng', e.target.value)} placeholder="Student's name" />
                                    <InputError message={errors.name_eng} />
                                </div>

                                {/* Father's Info */}

                                <div>
                                    <Label>အဖအမည် (အင်္ဂလိပ်)</Label>
                                    <Input id="father_name_eng" value={data.father_name_eng} onChange={(e) => setData('father_name_eng', e.target.value)} placeholder="Father's name" />
                                    <InputError message={errors.father_name_eng} />
                                </div>

                                {/* Mother's Info */}

                                <div>
                                    <Label>အမိအမည် (အင်္ဂလိပ်)</Label>
                                    <Input id="mother_name_eng" value={data.mother_name_eng} onChange={(e) => setData('mother_name_eng', e.target.value)} placeholder="Mother's name" />
                                    <InputError message={errors.mother_name_eng} />
                                </div>

                                {/* Ethnicity and Religion */}
                                <div>
                                    <Label>လူမျိုး</Label>
                                    <Input
                                        id="father_ethnicity"
                                        value={data.father_ethnicity}
                                        onChange={(e) => setData('father_ethnicity', e.target.value)}
                                        placeholder="လူမျိုး "
                                    />
                                    <InputError message={errors.father_ethnicity} />
                                </div>
                                <div>
                                    <Label>အဖလူမျိုး</Label>
                                    <Input id="ethnicity" value={data.ethnicity} onChange={(e) => setData('ethnicity', e.target.value)} placeholder="လူမျိုး " />
                                    <InputError message={errors.ethnicity} />
                                </div>
                                <div>
                                    <Label>အမိလူမျိုး</Label>
                                    <Input
                                        id="mother_ethnicity"
                                        value={data.mother_ethnicity}
                                        onChange={(e) => setData('mother_ethnicity', e.target.value)}
                                        placeholder="လူမျိုး"
                                    />
                                    <InputError message={errors.ethnicity} />
                                </div>
                                <div>
                                    <Label>နိုင်ငံသား စီစစ်ရေးကတ်ပြား အမှတ်</Label>
                                    <NRCInputFields
                                        nrcData={nrcData}
                                        prefix=""
                                        state={data.nrc_state}
                                        township={data.nrc_township}
                                        type={data.nrc_type}
                                        number={data.nrc_number}
                                        errors={errors}
                                        onChange={(key, value) => setData(key, value)}
                                        isDisabled={false}
                                    />

                                </div>
                                <div>
                                    <Label>အဖ၏ နိုင်ငံသား စီစစ်ရေးကတ်ပြား အမှတ်</Label>
                                    <NRCInputFields
                                        nrcData={nrcData}
                                        prefix="father_"
                                        state={data.father_nrc_state}
                                        township={data.father_nrc_township}
                                        type={data.father_nrc_type}
                                        number={data.father_nrc_number}
                                        errors={errors}
                                        onChange={(key, value) => setData(key, value)}
                                        isDisabled={false}
                                    />


                                </div>
                                <div>
                                    <Label>အမိ၏ နိုင်ငံသား စီစစ်ရေးကတ်ပြား အမှတ်</Label>
                                    <NRCInputFields
                                        nrcData={nrcData}
                                        prefix="mother_"
                                        state={data.mother_nrc_state}
                                        township={data.mother_nrc_township}
                                        type={data.mother_nrc_type}
                                        number={data.mother_nrc_number}
                                        errors={errors}
                                        onChange={(key, value) => setData(key, value)}
                                        isDisabled={false}
                                    />

                                </div>
                                <div>
                                    <Label>ကိုးကွယ်သည့် ဘာသာ(ကျောင်းသား)</Label>
                                    <Input id="religion" value={data.religion} onChange={(e) => setData('religion', e.target.value)} placeholder="ကိုးကွယ်သည့် ဘာသာ(ကျောင်းသား)" />
                                    <InputError message={errors.religion} />
                                </div>
                                <div>
                                    <Label>ကိုးကွယ်သည့် ဘာသာ(အဖ)</Label>
                                    <Input
                                        id="father_religion"
                                        value={data.father_religion}
                                        onChange={(e) => setData('father_religion', e.target.value)}
                                        placeholder="ကိုးကွယ်သည့် ဘာသာ(အဖ)"
                                    />
                                    <InputError message={errors.father_religion} />
                                </div>
                                <div>
                                    <Label>ကိုးကွယ်သည့် ဘာသာ(အမိ)</Label>
                                    <Input
                                        id="mother_religion"
                                        value={data.mother_religion}
                                        onChange={(e) => setData('mother_religion', e.target.value)}
                                        placeholder="ကိုးကွယ်သည့် ဘာသာ(အမိ)"
                                    />
                                    <InputError message={errors.mother_religion} />
                                </div>

                                <div>
                                    <Label>မွေးဖွားရာ ဇာတိ(ကျောင်းသား)</Label>
                                    <Input
                                        id="hometown"
                                        value={data.hometown}
                                        onChange={(e) => setData('hometown', e.target.value)}
                                        placeholder="မွေးဖွားရာ ဇာတိ"
                                        className='mb-2'
                                    />
                                    <InputError message={errors.hometown} />
                                    <div><Input
                                        id="township_state_region"
                                        value={data.township_state_region}
                                        onChange={(e) => setData('township_state_region', e.target.value)}
                                        placeholder="မြို့နယ်/ပြည်နယ်/တိုင်း"
                                    />
                                        <InputError message={errors.township_state_region} /></div>
                                </div>
                                <div>
                                    <Label>အဖ မွေးဖွားရာ ဇာတိ(အဖ)</Label>
                                    <Input
                                        id="father_hometown"
                                        value={data.father_hometown}
                                        onChange={(e) => setData('father_hometown', e.target.value)}
                                        placeholder="မွေးဖွားရာ ဇာတိ"
                                        className='mb-2'
                                    />
                                    <InputError message={errors.father_hometown} />
                                    <div><Input
                                        id="father_township_state_region"
                                        value={data.father_township_state_region}
                                        onChange={(e) => setData('father_township_state_region', e.target.value)}
                                        placeholder="မြို့နယ်/ပြည်နယ်/တိုင်း"

                                    />
                                        <InputError message={errors.father_township_state_region} /></div>
                                </div>
                                <div>
                                    <Label>အမိ မွေးဖွားရာ ဇာတိ(အမိ)</Label>
                                    <Input
                                        id="mother_hometown"
                                        value={data.mother_hometown}
                                        onChange={(e) => setData('mother_hometown', e.target.value)}
                                        placeholder="မွေးဖွားရာ ဇာတိ"
                                        className='mb-2'
                                    />
                                    <InputError message={errors.mother_hometown} />
                                    <div><Input
                                        id="mother_township_state_region"
                                        value={data.mother_township_state_region}
                                        onChange={(e) => setData('mother_township_state_region', e.target.value)}
                                        placeholder="မြို့နယ်/ပြည်နယ်/တိုင်း"
                                    />
                                        <InputError message={errors.mother_township_state_region} /></div>

                                </div>

                                <div>
                                    <Select
                                        value={data.local_foreign}
                                        onValueChange={(value) => setData('local_foreign', value)}
                                    >
                                        <SelectTrigger id="local_foreign">
                                            <SelectValue placeholder="နိုင်ငံခြားသား (သို့) တိုင်းရင်းသား" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="foreign">နိုင်ငံခြားသား</SelectItem>
                                                <SelectItem value="local">တိုင်းရင်းသား</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.local_foreign} />
                                </div>



                                <div>
                                    <Select
                                        value={data.father_local_foreign}
                                        onValueChange={(value) => setData('father_local_foreign', value)}
                                    >
                                        <SelectTrigger id="father_local_foreign">
                                            <SelectValue placeholder="နိုင်ငံခြားသား (သို့) တိုင်းရင်းသား" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="foreign">နိုင်ငံခြားသား</SelectItem>
                                                <SelectItem value="local">တိုင်းရင်းသား</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.father_local_foreign} />
                                </div>



                                <div>
                                    <Select
                                        value={data.mother_local_foreign}
                                        onValueChange={(value) => setData('mother_local_foreign', value)}
                                    >
                                        <SelectTrigger id="mother_local_foreign">
                                            <SelectValue placeholder="နိုင်ငံခြားသား (သို့) တိုင်းရင်းသား" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="foreign">နိုင်ငံခြားသား</SelectItem>
                                                <SelectItem value="local">တိုင်းရင်းသား</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.mother_local_foreign} />
                                </div>


                                <div>
                                    <Label>မွေးသက္ကရာဇ်</Label>
                                    <Input type="date" id="dob" value={data.dob} onChange={(e) => setData('dob', e.target.value)} />
                                    <InputError message={errors.dob} />
                                </div>
                                <div>
                                    <Label>အဘအုပ်ထိန်းသူ၏ အလုပ်အကိုင်ရာထူး/ဌာန/လိပ်စာ အပြည့်အစုံ</Label>
                                    <Textarea
                                        id="father_job"
                                        value={data.father_job}
                                        onChange={(e) => setData('father_job', e.target.value)}
                                        placeholder=""
                                    ></Textarea>
                                    <InputError message={errors.father_job} />
                                </div>
                                <div>
                                    <Label>အမိအုပ်ထိန်းသူ၏ အလုပ်အကိုင်ရာထူး/ဌာန/လိပ်စာ အပြည့်အစုံ</Label>
                                    <Textarea
                                        id="mother_job"
                                        value={data.mother_job}
                                        onChange={(e) => setData('mother_job', e.target.value)}
                                        placeholder=""
                                    ></Textarea>
                                    <InputError message={errors.mother_job} />
                                </div>

                                <div >
                                    <div >
                                        <div  >တက္ကသိုလ်၀င်တန်း စာမေးပွဲ အောင်မြင်သည့် ခုံအမှတ်</div>
                                        <Input
                                            id="matriculation_passed_roll_no"
                                            value={data.matriculation_passed_roll_no}
                                            onChange={(e) => setData('matriculation_passed_roll_no', e.target.value)}
                                            placeholder="ခုံအမှတ်"
                                        />
                                        <InputError message={errors.matriculation_passed_roll_no} /></div>

                                </div>

                                <div >

                                    <div  >
                                        <div  >တက္ကသိုလ်၀င်တန်း စာမေးပွဲ အောင်မြင်သည့် ခုနှစ်</div>
                                        <Input
                                            id="matriculation_passed_year"
                                            value={data.matriculation_passed_year}
                                            onChange={(e) => setData('matriculation_passed_year', e.target.value)}
                                            placeholder="ခုနှစ်"
                                        />
                                        <InputError message={errors.matriculation_passed_year} /></div>

                                </div>

                                <div >

                                    <div  >
                                        <div  >တက္ကသိုလ်၀င်တန်း စာမေးပွဲ အောင်မြင်သည့် စာစစ်ဌာန</div><Input
                                            id="matriculation_passed_dept"
                                            value={data.examination_center}
                                            onChange={(e) => setData('examination_center', e.target.value)}
                                            placeholder="စာစစ်ဌာန"
                                        />
                                        <InputError message={errors.examination_center} /></div>

                                </div>
                                <div>
                                    <Label>အမြဲတမ်းနေရပ် လိပ်စာ</Label>
                                    <Textarea id="permanent_address" value={data.permanent_address} onChange={(e) => setData('permanent_address', e.target.value)} placeholder='ကျောင်းသားအမြဲတမ်း နေရပ်လိပ်စာ' />
                                    <InputError message={errors.permanent_address} />
                                </div>
                                <div>
                                    <Label>ဖုန်းနံပါတ်</Label>
                                    <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder='ကျောင်းသား၏ ဖုန်း' />
                                    <InputError message={errors.phone} />
                                </div>
                                <div>
                                    <Label>အီးမေးလ်</Label>
                                    <Input
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="ကျောင်းသား၏ အီးမေးလ်"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-md font-medium">၂။ ဖြေဆိုခဲ့သည့်စာမေးပွဲများ</h3>
                                <Button type="button" onClick={addExamRow} variant="outline">+ ထည့်မည်</Button>
                            </div>
                            <Table>
                                <TableBody>
                                    {data.exam_records.map((exam, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Input
                                                    value={exam.exam_name}
                                                    onChange={(e) =>
                                                        handleExamChange(index, 'exam_name', e.target.value)
                                                    }
                                                    placeholder="စာမေးပွဲအမည်"
                                                />
                                                <InputError message={errors?.[`exam_records.${index}.exam_name`]} />
                                            </TableCell>

                                            <TableCell>
                                                <Input
                                                    value={exam.exam_major}
                                                    onChange={(e) =>
                                                        handleExamChange(index, 'exam_major', e.target.value)
                                                    }
                                                    placeholder="အဓိကဘာသာ"
                                                />
                                                <InputError message={errors?.[`exam_records.${index}.exam_major`]} />
                                            </TableCell>

                                            <TableCell>
                                                <Input
                                                    value={exam.exam_roll_no}
                                                    onChange={(e) =>
                                                        handleExamChange(index, 'exam_roll_no', e.target.value)
                                                    }
                                                    placeholder="ခုံအမှတ်"
                                                />
                                                <InputError message={errors?.[`exam_records.${index}.exam_roll_no`]} />
                                            </TableCell>

                                            <TableCell>
                                                <Input
                                                    value={exam.exam_year}
                                                    onChange={(e) =>
                                                        handleExamChange(index, 'exam_year', e.target.value)
                                                    }
                                                    placeholder="ခုနှစ်"
                                                />
                                                <InputError message={errors?.[`exam_records.${index}.exam_year`]} />
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-end gap-2">
                                                    <Select
                                                        value={exam.exam_pass_fail}
                                                        onValueChange={(value) =>
                                                            handleExamChange(index, 'exam_pass_fail', value)
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="အောင်/ရှုံး" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pass">အောင်</SelectItem>
                                                            <SelectItem value="fail">ရှုံး</SelectItem>
                                                        </SelectContent>
                                                    </Select>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() => removeExamRow(index)}
                                                    >
                                                        -
                                                    </Button>
                                                </div>
                                                <InputError message={errors?.[`exam_records.${index}.exam_pass_fail`]} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </Card>
                        {/* Section 3 - Exam Records */}


                        {/* Section 4 - Donor */}
                        <Card className="p-6 space-y-6">
                            <h3 className="text-md font-medium">၃။ ကျောင်းနေရန်အထောက်ပံ့ပုဂ္ဂိုလ်</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label>အမည်</Label>
                                    <Input id="donor_name" value={data.donor_name} onChange={(e) => setData('donor_name', e.target.value)} />
                                    <InputError message={errors.donor_name} />
                                </div>
                                <div>
                                    <Label>ဆွေမျိုးတော်စပ်ပုံ</Label>
                                    <Input id="donor_relationship" value={data.donor_relationship} onChange={(e) => setData('donor_relationship', e.target.value)} />
                                    <InputError message={errors.donor_relationship} />
                                </div>
                                <div>
                                    <Label>အလုပ်အကိုင်</Label>
                                    <Input id="donor_job" value={data.donor_job} onChange={(e) => setData('donor_job', e.target.value)} />
                                    <InputError message={errors.donor_job} />
                                </div>
                                <div>
                                    <Label>ဖုန်းနံပါတ်</Label>
                                    <Input id="donor_phone" value={data.donor_phone} onChange={(e) => setData('donor_phone', e.target.value)} />
                                    <InputError message={errors.donor_phone} />
                                </div>
                                <div>
                                    <Label>လိပ်စာ</Label>
                                    <Textarea id="donor_address" value={data.donor_address} onChange={(e) => setData('donor_address', e.target.value)} />
                                    <InputError message={errors.donor_address} />
                                </div>

                            </div>
                        </Card>

                        <Card className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>

                                    <Label>၄။ ပညာသင်ထောက်ပံ့ကြေးပေးရန် ခွင့်ပြု / မပြု</Label>
                                </div>
                                <div className="">
                                    <Select value={data.donor_status} onValueChange={(value) => setData('donor_status', value)}>
                                        <SelectTrigger><SelectValue placeholder="ခွင့်ပြု (သို့) မပြု" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="1">ခွင့်ပြု</SelectItem>
                                                <SelectItem value="0">မပြု</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.donor_status} />
                                </div>
                            </div>

                        </Card>
                    </section>



                    <div className='flex justify-end me-9'>

                        <div >
                            <Button type="submit" disabled={processing} className="mt-6 w-full ">
                                {processing
                                    ? 'လုပ်ဆောင်နေပါသည်...'
                                    : 'ပြင်ဆင်သိမ်းဆည်းမည်'}
                            </Button></div>
                    </div>
                </form >
            </div >
        </AppLayout >
    );
}
