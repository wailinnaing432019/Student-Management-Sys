<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        body {
            font-family: 'pyidaungsu', sans-serif;
            font-size: 12pt;
            line-height: 1.5;
        }
    </style>
    <style>
        /* Add your Tailwind CSS classes here if you have a build process */
        .table-auto {
            width: 100%;
            border-collapse: collapse;
        }

        .border {
            border: 1px solid #e2e8f0;
        }

        .px-3 {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
        }

        .py-2 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }

        .text-sm {
            font-size: 0.875rem;
        }

        .text-left {
            text-align: left;
        }

        .w-full {
            width: 100%;
        }

        . {
            line-height: 2;
        }

        .justify-between {
            display: flex;
            justify-content: space-between;
        }

        .space-y-4>*+* {
            margin-top: 0.1rem;
        }

        .ml-3 {
            margin-left: 0.75rem;
        }

        .ml-6 {
            margin-left: 1.5rem;
        }

        .mt-3 {
            margin-top: 0.75rem;
        }

        .mt-4 {
            margin-top: 1rem;
        }

        .p-3 {
            padding: 0.75rem;
        }

        .flex {
            display: flex;
        }

        .gap-1>*+* {
            margin-left: 0.25rem;
        }

        .items-center {
            align-items: center;
        }

        .max-w-md {
            max-width: 28rem;
        }

        .font-bold {
            font-weight: 700;
        }

        .text-justify {
            text-align: justify;
        }

        /* Badge styling */
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            line-height: 1;
            border-radius: 9999px;
            color: white;
        }



        .badge-default {
            background-color: #10b981;
        }

        /* Tailwind 'green-500' */
        .badge-destructive {
            background-color: #ef4444;
        }

        /* Tailwind 'red-500' */
        @media print {
            .page-break {
                page-break-before: always;
            }
        }
    </style>
</head>

<body>


    <div class="space-y-6 w-full mx-auto px-4 py-6 print-area">
        <div class="p-6 space-y-6 text-[14px] leading-relaxed">
            @php
                $stuEnrollment = $stuEnrollment ?? null;

                $student = $stuEnrollment?->student;
                $profile = $stuEnrollment?->studentSemesterProfile;
                $semester = $stuEnrollment?->semester;
                $major = $stuEnrollment?->major;
                $academic_year = $stuEnrollment?->academicYear;
                $examsTaken = $student?->examsTaken ?? null;
                $donor = $profile?->donor;
                $registrationAgreement = $profile?->registrationAgreement;

            @endphp


            <section>
                <div class="flex text-2xl justify-center">
                    <h4 style="text-align:center">
                        {{ $academic_year->name ?? '---' }} ပညာသင်နှစ်၊ ကျောင်းသား/သူ ပညာသင်ခွင့်လျှောက်လွှာ
                    </h4>
                    <h5 style="text-align:center; ">ကွန်ပျူတာတက္ကသိုလ် (မိတ္ထီလာမြို့)</h5>
                </div>



            </section>

            <section>
                <table style="width: 100%; font-size: 14px; line-height: 1.6;">
                    <tr>
                        <!-- Guardian Info -->
                        <td style="width: 50%; vertical-align: top;">
                            <div>
                                <div style="display: grid; gap: 0.5rem; justify-content: center;">
                                    <img src="{{ public_path('storage/' . $profile->image) }}"
                                        style="width:150px; height:100px;" />
                                </div>
                            </div>
                        </td>
                        <td style="width: 50%; vertical-align: top;">
                            <div>
                                <table class="table-auto w-full border border-gray-300 text-sm text-left">
                                    <tbody>
                                        <tr>
                                            <td class="border px-3 py-2">သင်တန်းနှစ်</td>
                                            <td class="border px-3 py-2">
                                                <div>
                                                    @php
                                                        $roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
                                                        $modules = ['I', 'II', 'III', 'IV'];

                                                        $num = $stuEnrollment->semester->semester_number;

                                                        if ($num >= 1 && $num <= count($roman)) {
                                                            $semester = 'Semester ' . $roman[$num - 1];
                                                        } elseif ($num >= 11 && $num <= 14) {
                                                            $semester = 'Module ' . $modules[$num - 11];
                                                        } else {
                                                            $semester = 'Unknown Semester';
                                                        }
                                                    @endphp

                                                    {{ $semester }}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="border px-3 py-2">အထူးပြု ဘာသာ</td>
                                            <td class="border px-3 py-2">
                                                <div>{{ $major['name'] }}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="border px-3 py-2">ခုံအမှတ်</td>
                                            <td class="border px-3 py-2">{{ $profile['roll_no'] }}</td>
                                        </tr>
                                        <tr>
                                            <td class="border px-3 py-2">တက္ကသိုလ်၀င်ရောက်သည့်အမှတ်</td>
                                            <td class="border px-3 py-2">{{ $student['uid'] }}</td>
                                        </tr>
                                        <tr>
                                            <td class="border px-3 py-2">တက္ကသိုလ်၀င်ရောက်သည့်နှစ်</td>
                                            <td class="border px-3 py-2">{{ $student['entried_year'] }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                </table>
            </section>
            {{-- Registration Info --}}


            {{-- style="page-break-after: always;" --}}
            <section>
                <table class="table-auto w-full border border-gray-300 text-sm text-left">
                    <thead>
                        <tr>
                            <th colspan="2" class="border px-3 py-2">၁။ပညာဆက်လက်သင်ခွင့်တောင်းခံသူ</th>
                            <th class="border px-3 py-2">‌ကျောင်းသား/သူ</th>
                            <th class="border px-3 py-2">အဖအမည်</th>
                            <th class="border px-3 py-2">အမိအမည်</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowspan="2" class="border px-3 py-2">အမည်</td>
                            <td class="border px-3 py-2">မြန်မာစာဖြင့်</td>
                            <td class="border px-3 py-2">{{ $student['name_myan'] }}</td>
                            <td class="border px-3 py-2">{{ $student['father']['name_myan'] }}</td>
                            <td class="border px-3 py-2">{{ $student['mother']['name_myan'] }}</td>
                        </tr>
                        <tr>
                            <td class="border px-3 py-2">အင်္ဂလိပ်စာဖြင့်</td>
                            <td class="border px-3 py-2">{{ $student['name_eng'] }}</td>
                            <td class="border px-3 py-2">{{ $student['father']['name_eng'] }}</td>
                            <td class="border px-3 py-2">{{ $student['mother']['name_eng'] }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="border px-3 py-2">လူမျိုး</td>
                            <td class="border px-3 py-2">{{ $student['ethnicity'] }}</td>
                            <td class="border px-3 py-2">{{ $student['father']['ethnicity'] }}</td>
                            <td class="border px-3 py-2">{{ $student['mother']['ethnicity'] }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="border px-3 py-2">ကိုးကွယ်သည့် ဘာသာ</td>
                            <td class="border px-3 py-2">{{ $student['religion'] }}</td>
                            <td class="border px-3 py-2">{{ $student['father']['religion'] }}</td>
                            <td class="border px-3 py-2">{{ $student['mother']['religion'] }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="border px-3 py-2">မွေးဖွားရာ ဇာတိ</td>
                            <td class="border px-3 py-2">{{ $student['hometown'] }}</td>
                            <td class="border px-3 py-2">{{ $student['father']['hometown'] }}</td>
                            <td class="border px-3 py-2">{{ $student['mother']['hometown'] }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="border px-3 py-2">မြို့နယ်/ပြည်နယ်/တိုင်း</td>
                            <td class="border px-3 py-2">{{ $student['township_state_region'] }}</td>
                            <td class="border px-3 py-2">{{ $student['father']['township_state_region'] }}</td>
                            <td class="border px-3 py-2">{{ $student['mother']['township_state_region'] }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="border px-3 py-2">နိုင်ငံသား စီစစ်ရေးကတ်ပြား အမှတ်</td>
                            <td class="border px-3 py-2">
                                {{ $student['nrc_state'] }}/{{ $student['nrc_township'] }}({{ $student['nrc_type'] }}){{ $student['nrc_number'] }}
                            </td>
                            <td class="border px-3 py-2">
                                {{ $student['father']['nrc_state'] }}/{{ $student['father']['nrc_township'] }}({{ $student['father']['nrc_type'] }}){{ $student['father']['nrc_number'] }}
                            </td>
                            <td class="border px-3 py-2">
                                {{ $student['mother']['nrc_state'] }}/{{ $student['mother']['nrc_township'] }}({{ $student['mother']['nrc_type'] }}){{ $student['mother']['nrc_number'] }}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" class="border px-3 py-2">နိုင်ငံခြားသား</td>
                            <td class="border px-3 py-2">
                                {{ $student['local_foreign'] == 'local' ? 'တိုင်းရင်းသား' : 'နိုင်ငံခြားသား' }}</td>
                            <td class="border px-3 py-2">
                                {{ $student['father']['local_foreign'] == 'local' ? 'တိုင်းရင်းသား' : 'နိုင်ငံခြားသား' }}
                            </td>
                            <td class="border px-3 py-2">
                                {{ $student['mother']['local_foreign'] == 'local' ? 'တိုင်းရင်းသား' : 'နိုင်ငံခြားသား' }}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table class="table-auto w-full border border-gray-300 text-sm text-left page-break">
                    <tbody>
                        <tr>
                            <td colspan="2" class="border px-3 py-2">မွေးသက္ကရာဇ်</td>
                            <td class="border px-3 py-2">{{ $student['dob'] }}</td>
                            <td rowspan="4" colspan="2" class="border px-3 py-2">
                                <div style="font:10px"><label for="" class="-mt-2">အဘအုပ်ထိန်းသူ၏
                                        အလုပ်အကိုင်ရာထူး/ဌာန/လိပ်စာ
                                        အပြည့်အစုံ</label></div>
                                <div class="mt-3">{{ $student['father']['job'] }}</div>
                            </td>
                        </tr>
                        <tr>
                            <td rowspan="3" class="border px-3 py-2">တက္ကသိုလ်၀င်တန်း စာမေးပွဲ အောင်မြင်သည့်</td>
                            <td colspan="2" class="border px-3 py-2">ခုံအမှတ် -
                                {{ $student['matriculation_passed_year'] }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="border px-3 py-2">ခုနှစ် -
                                {{ $student['matriculation_passed_roll_no'] }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="border px-3 py-2">စာစစ်ဌာန -
                                {{ $student['examination_center'] }}</td>
                        </tr>
                        <tr>
                            <td rowspan="3" class="border px-3 py-2">အမြဲတမ်းနေထိုင်သည့် လိပ်စာ (အပြည့်အစုံ)</td>
                            <td colspan="2" class="border px-3 py-2">ဖုန်း - {{ $profile['phone'] }}</td>
                            <td colspan="2" rowspan="3" class="border px-3 py-2">
                                <label for="" class="-mt-2">အမိအုပ်ထိန်းသူ၏ အလုပ်အကိုင်ရာထူး/ဌာန/လိပ်စာ
                                    အပြည့်အစုံ</label>
                                <div class="mt-3">{{ $student['mother']['job'] }}</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" class="border px-3 py-2">Email - {{ $profile['email'] }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="border px-3 py-2">အမြဲတမ်းနေရပ် -
                                {{ $profile['permanent_address'] }}</td>
                        </tr>
                        <tr>
                            <td class="border px-3 py-2">၂။ ဖြေဆိုခဲ့သည့်စာမေးပွဲများ</td>
                            <td class="border px-3 py-2">အဓိက ဘာသာ</td>
                            <td class="border px-3 py-2">ခုံအမှတ်</td>
                            <td class="border px-3 py-2">ခုနှစ်</td>
                            <td class="border px-3 py-2">အောင်/ရှုံး</td>
                        </tr>
                        @forelse ($examsTaken as $examTaken)
                            <tr>
                                <td class="border px-3 py-2">{{ $examTaken['exam_name'] }}</td>
                                <td class="border px-3 py-2">{{ $examTaken['major'] }}</td>
                                <td class="border px-3 py-2">{{ $examTaken['roll_no'] }}</td>
                                <td class="border px-3 py-2">{{ $examTaken['year'] }}</td>
                                <td class="border px-3 py-2">
                                    {{ $examTaken['pass_fail'] == 'pass' ? 'အောင်' : 'ရှုံး' }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td class="border px-3 py-2">-</td>
                                <td class="border px-3 py-2">-</td>
                                <td class="border px-3 py-2">-</td>
                                <td class="border px-3 py-2">-</td>
                                <td class="border px-3 py-2">
                                    -</td>
                            </tr>
                        @endforelse
                        <tr>
                            <td colspan="2" rowspan="4" class="border px-3 py-2">၃။ကျောင်းနေရန်
                                အထောက်ပံ့ပြုမည့် ပုဂ္ဂိုလ်</td>
                            <td class="border px-3 py-2">(က) အမည်</td>
                            <td colspan="2" class="border px-3 py-2">{{ $donor['name'] }}</td>
                        </tr>
                        <tr>
                            <td class="border px-3 py-2">(ခ) ဆွေမျိုးတော်စပ်ပုံ</td>
                            <td colspan="2" class="border px-3 py-2">{{ $donor['relationship'] }}</td>
                        </tr>
                        <tr>
                            <td class="border px-3 py-2">(ဂ) အလုပ်အကိုင်</td>
                            <td colspan="2" class="border px-3 py-2">{{ $donor['job'] }}</td>
                        </tr>
                        <tr>
                            <td class="border px-3 py-2">(ဃ) ဆက်သွယ်ရန် လိပ်စာ ဖုန်းနံပါတ်</td>
                            <td colspan="2" class="border px-3 py-2">{{ $donor['phone'] }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="border px-3 py-2">၄။ပညာသင်ထောက်ပံ့ကြေးပေးရန် ခွင့်ပြု / မပြု
                            </td>
                            <td colspan="3" class="border px-3 py-2">
                                <div>
                                    {{ $donor['status'] == 1 ? 'ခွင့်ပြု' : 'မပြု' }}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
            {{-- @if (!empty($registrationAgreement))
                <section>
                    <div class='w-full text-justify justify-evenly '>
                        <div class="mt-4">
                            <p class="leading-loose">သို့</p>
                            <p class="leading-loose">ကွန်ပျူတာတက္ကသိုလ်(မိတ္ထီလာ)</p>
                            <p>အကြောင်းအရာ။ ။ကွန်ပျူတာတက္ကသိုလ်(မိတ္ထီလာ)တွင် {{ $registrationAgreement['name'] }}
                                သင်တန်းတက်ရောက်ခွင့်လျှောက်ထားခြင်း။</p>
                        </div>
                        <div class='space-y-4'>
                            <p class="leading-loose">၁။ <span class='ml-3'></span> (က)
                                {{ $registrationAgreement['gender'] == 'male' ? 'ကျွန်တော်' : 'ကျွန်မ' }}
                                {{ $registrationAgreement['name'] }} သည် ကွန်ပျူတာတက္ကသိုလ်(မိတ္ထီလာ) သို့
                                ၀င်ခွင့်အမှတ်စဥ် ({{ $student['uid'] }}) ဖြင့် ပထမနှစ်သက်တန်းသို့ ၀င်ရောက်ခွင့်
                                ရရှိသူဖြစ်ပါသည်။</p>
                            <div class='ml-6 space-y-4'>
                                <p class='leading-loose'>
                                    (ခ){{ $registrationAgreement['gender'] == 'male' ? 'ကျွန်တော်' : 'ကျွန်မ' }}
                                    {{ $registrationAgreement['name'] }} သည်
                                    {{ $registrationAgreement['examed_year'] }}
                                    ခုနှစ် ၊ {{ $registrationAgreement['examed_month'] }} လ အတွင်းကျင်းပခဲ့သော
                                    {{ $registrationAgreement['examed_name'] }}သင်တန်းစာမေးပွဲကို ခုံအမှတ်
                                    {{ $registrationAgreement['examed_roll_no'] }} ဖြင့် ဖြေဆို
                                    {{ $registrationAgreement['examed_status'] == 'pass' ? 'အောင်မြင်' : 'ကျရှုံး' }}
                                    ခဲ့ပါ၍ ကွန်ပျူတာတက္ကသိုလ်(မိတ္ထီလာ) တွင် ဖွင့်လှစ်မည့်
                                    {{ $registrationAgreement['class'] }}သင်တန်းသို့ တက်ရောက်ခွင့်ပြုပါရန်
                                    လျှောက်ထားအပ်ပါသည်။ ကွန်ပျူတာတက္ကသိုလ်(မိတ္ထီလာ)တွင် ပညာသင်ကြားနေစဥ် ကာလအတွင်း
                                    ဤတက္ကသိုလ်မှ သတ်မှတ်ထားသည့် အောက်ဖော်ပြပါ အချက်အလက်များကို သိရှိပြီးကြောင်းနှင့်
                                    လိုက်နာကျင့်သုံးမည်ဖြစ်ကြောင်း ၀န်ခံကတိ လက်မှတ်ရေးထိုးပါသည်။</p>
                                <p>(၁) B.C.Sc/B.C.Tech သင်တန်းမှာ(၄) နှစ်သင်တန်းဖြစ်ပါသည်။</p>
                                <p>(၂) သင်တန်းကြေးမှာ တစ်လလျှင် {{ $registrationAgreement['fee'] }}ကျပ်တိတိ ( )
                                    နှုန်းဖြစ်ပါသည်။</p>
                                <p>(၃) မိမိအစီအစဉ်ဖြင့် နေထိုင်စားသောက်ရမည်ဖြစ်ပါသည်။</p>
                                <p>(၄) ကျွန်တော်/ကျွန်မ သည် မည်သည့်နိုင်ငံရေးပါတီတွင်မျှ ပါတီ၀င်မဟုတ်ပါ။</p>
                                <p>(၅) Credit Unit / Credit Hour ပြည့်မှီခြင်းမရှိပါက စာမေးပွဲဖြေဆိုခွင့် မပြုကြောင်းကို
                                    သိရှိပါ သည်။</p>
                                <p>(၆) နေ့စဉ်ကျောင်းတက်ရောက်ခြင်းဆိုင်ရာကိစ္စ၊ ကျောင်းပြောင်း‌‌ရွှေ့ခြင်းဆိုင်ရာ ကိစ္စ၊
                                    ဆေးခွင့်လျှောက်ထားခြင်း ဆိုင်ရာကိစ္စ၊ စာမေးပွဲဖြေဆိုခြင်းဆိုင်ရာ ကိစ္စများ၏
                                    စည်းကမ်းသတ်မှတ်ချက်များအား ပူးတွဲပါ ကျောင်းစည်းကမ်းဆိုင်ရာ အချက်အလက်များ အတိုင်း
                                    သိရှိလိုက်နာသွားရန် ဖြစ်ပါသည်။</p>
                                <p>(၇) ကျောင်းမှထုတ်ပြန်ထားသော ပူးတွဲဖော်ပြပါစည်းကမ်းချက်များကို ဖတ်ရှုလက်မှတ်ထိုးပြီး
                                    လိုက်နာပါမည်ဟု ကတိပြုပါသည်။</p>
                            </div>
                        </div>


                        <table style="width: 100%; font-size: 14px; line-height: 1.6;">
                            <tr>
                                <!-- Guardian Info -->
                                <td style="width: 50%; vertical-align: top;">
                                    <div style="font-weight: bold; font-size: 15px; margin-bottom: 10px;">
                                        မိဘ/အုပ်ထိန်းသူ၏
                                    </div>
                                    <div>
                                        <span style="font-weight: 500;">အမည် - </span>
                                        {{ $registrationAgreement['guardian'] }}
                                    </div>
                                    <div>
                                        <span style="font-weight: 500;">မှတ်ပုံတင်အမှတ် - </span>
                                        {{ $registrationAgreement['nrc_state'] }}/{{ $registrationAgreement['nrc_township'] }}
                                        ({{ $registrationAgreement['nrc_type'] }})
                                        {{ $registrationAgreement['nrc_number'] }}
                                    </div>
                                </td>

                                <!-- Student Info -->
                                <td style="width: 50%; vertical-align: top;">
                                    <div style="font-weight: bold; font-size: 15px; margin-bottom: 10px;">
                                        ပညာသင်လျှောက်ထားသူ၏
                                    </div>
                                    <div>
                                        <span style="font-weight: 500;">အမည် - </span>
                                        {{ $registrationAgreement['name'] }}
                                    </div>
                                    <div>
                                        <span style="font-weight: 500;">ယခင်နှစ်ခုံအမှတ် - </span>
                                        {{ $registrationAgreement['examed_roll_no'] }}
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <div>
                            <div class="flex items-start space-x-2">
                                <label for="agreed" class="text-sm leading-snug p-3 font-bold">
                                    ဤအချက်အလက်များမှန်ကန်ကြောင်း သေချာပါသည်။ ဤအတည်ပြုချက်ကို ကျွန်ုပ်လက်ခံပါသည်။
                                </label>
                            </div>
                        </div>
                    </div>
                </section>
            @endif --}}

        </div>
    </div>

</body>

</html>
