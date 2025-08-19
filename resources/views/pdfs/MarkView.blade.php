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



            <section>
                <div class="flex text-2xl justify-center">
                    <h4 style="text-align:center">{{ $enrollStudent->academicYear->name }} ပညာသင်နှစ် ၊ </h4>

                    @php

                        $roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
                        if (
                            $enrollStudent->semester->semester_number < 1 ||
                            $enrollStudent->semester->semester_number > count($roman)
                        ) {
                            return 'Unknown Semester';
                        }
                        $semester = 'Semester ' . $roman[$enrollStudent->semester->semester_number - 1];
                    @endphp
                    <h4 style="text-align:center">{{ $enrollStudent->semester->year_name }} - {{ $semester }}
                        တွင်ရရှိခဲ့သောအမှတ်များ</h4>

                    <table>
                        <tr>
                            <td>ကျောင်းသားအမည် </td>
                            <td>: {{ $enrollStudent->student->name_myan ?? ' ' }}</td>
                        </tr>

                        <tr>
                            <td>ခုံနံပါတ် </td>
                            <td>: {{ $enrollStudent->studentSemesterProfile->roll_no ?? ' ' }}</td>
                        </tr>
                    </table>
                </div>



            </section>





            <section style="page-break-after: always;">
                <table class="table-auto w-full border border-gray-300 text-sm text-left">
                    <thead>
                        <tr>
                            <th class="border px-3 py-2">ဘာသာရပ် အမည်</th>
                            <th class="border px-3 py-2">‌ဘာသာရပ် ကုဒ်</th>
                            <th class="border px-3 py-2">ဖော်ပြချက်</th>
                            <th class="border px-3 py-2">ရမှတ်</th>
                            <th class="border px-3 py-2">အဆင့်</th>
                            <th class="border px-3 py-2">မှတ်ချက်</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($enrollStudent->studentCourses as $sc)
                            @if ($sc->mark)
                                {{-- Only show if mark exists --}}
                                <tr>
                                    <td class="border px-3 py-2">{{ $sc->course->name ?? 'N/A' }}</td>
                                    <td class="border px-3 py-2">{{ $sc->course->code ?? 'N/A' }}</td>
                                    <td class="border px-3 py-2">{{ $sc->course->description ?? '-' }}</td>
                                    <td class="border px-3 py-2">{{ $sc->course->description ?? '-' }}</td>
                                    <td class="border px-3 py-2">{{ $sc->mark->mark ?? '-' }}</td>
                                    <td class="border px-3 py-2">{{ $sc->mark->grade ?? '-' }}</td>
                                    <td class="border px-3 py-2">{{ $sc->mark->remark ?? '-' }}</td>
                                </tr>
                            @endif
                        @endforeach

                    </tbody>
                </table>


            </section>

        </div>
    </div>

</body>

</html>
