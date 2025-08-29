<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentReregisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
{
$studentId = $this->route('student')->id;

    return [
        'academic_year_id' => ['required', 'exists:academic_years,id'],
        'semester_id'      => ['required', 'exists:semesters,id'],
        'major_id'         => ['required', 'exists:majors,id'],
        'roll_no' => [
            'required',
            'string',
            Rule::unique('student_semester_profiles')
                ->where(fn ($query) => 
                    $query->where('academic_year_id', $this->academic_year_id)
                        ->where('semester_id', $this->semester_id)
                        ->where('major_id', $this->major_id)
                )
        ],
        'permanent_address'=> ['required', 'string'], 
        'phone'            => ['required', 'string', 'max:20'],
        'email'            => ['required', 'email', 'max:255'],
        'image'            => ['required', 'image', 'max:2048'],

     

        // father fields …
        'father_religion' => ['required', 'string'],
        'father_hometown' => ['required', 'string'],
        'father_township_state_region' => ['required', 'string'],
        'father_job' => ['required', 'string'],
        'father_job_position_address' => ['nullable', 'string'],

        // mother fields …
        'mother_religion' => ['required', 'string'],
        'mother_hometown' => ['required', 'string'],
        'mother_township_state_region' => ['required', 'string'],
        'mother_job' => ['required', 'string'],
        'mother_job_position_address' => ['nullable', 'string'],

        // donor fields …
        'donor_name' => ['required', 'string'],
        'donor_relationship' => ['required', 'string'],
        'donor_job' => ['required', 'string'],
        'donor_phone' => ['required', 'string'],
        'donor_status' => ['required', 'string'],
        'donor_address' => 'required|string',

 
       // Exams_taken
            'exam_records' => 'nullable|array',
            'exam_records.*.exam_name' => 'nullable|string',
            'exam_records.*.exam_major' => 'nullable|string',
            'exam_records.*.exam_roll_no' => 'nullable|string',
            'exam_records.*.exam_year' => 'nullable|string',
            'exam_records.*.exam_pass_fail' => 'nullable|string',
    ];
}

    // public function messages(): array
    // {
    //     return [
    //         'student_id.unique' => 'This student has already been registered for the selected semester, major, and academic year.',
    //     ];
    // }
    public function messages()
    {
        return [
            '*.required' => ':attribute ဖြည့်ပေးရန် လိုအပ်သည်။',
            'nrc_number.regex' => 'နိုင်ငံသားစီစစ်ရေးကဒ်ပြား အမှတ်စဉ်မှာ မြန်မာဘာသာဖြင့်ထည့်ရမည် (ဥပမာ-၁၂၃၄၅၆)',
            'father_nrc_number.regex' => 'နိုင်ငံသားစီစစ်ရေးကဒ်ပြား အမှတ်စဉ်မှာ မြန်မာဘာသာဖြင့်ထည့်ရမည် (ဥပမာ-၁၂၃၄၅၆)',
            'mother_nrc_number.regex' => 'နိုင်ငံသားစီစစ်ရေးကဒ်ပြား အမှတ်စဉ်မှာ မြန်မာဘာသာဖြင့်ထည့်ရမည် (ဥပမာ-၁၂၃၄၅၆)',
            '*.regex' => 'မှန်ကန်သော ပုံစံဖြစ်ရမည်။',
            '*.unique' => ':attribute မှာ ရှိပြီးသားဖြစ်ပါသည်။',
            '*.string' => ':attribute သည် စာသားဖြစ်ရမည်။',
            '*.numeric' => ':attribute သည် ဂဏန်းဖြစ်ရမည်။',
            '*.image' => ':attribute သည် ဓာတ်ပုံဖိုင်ဖြစ်ရမည်။',
            '*.digits' => ':attribute သည် အလုံး :digits လုံးဖြစ်ရမည်။',
            '*.in' => ':attribute သည် သတ်မှတ်ထားသော တန်ဖိုးဖြစ်ရမည်။',
            '*.accepted' => ':attribute ကို သဘောတူရန် လိုအပ်သည်။',
            'phone.required' => 'ဖုန်းနံပါတ်ဖြည့်ရန် လိုအပ်ပါသည်။',
            'phone.regex' => 'မှန်ကန်သော ဖုန်းနံပါတ်ဖြစ်ရမည်။',
            'donor_phone.regex' => 'မှန်ကန်သော ဖုန်းနံပါတ်ဖြစ်ရမည်။',
        ];
    }

     public function attributes()
    {
        return [
            'name_myan' => 'ကျောင်းသား မြန်မာအမည်',
            'name_eng' => 'ကျောင်းသား အင်္ဂလိပ်အမည်',
            'academic_year_id' => 'ပညာသင်နှစ်',
            'semester_id' => 'သင်တန်း',
            'major_id' => 'ဌာန/မေဂျာ',
            'roll_no' => 'ခုံနံပါတ်',
            'uid' => 'ကျောင်းသား မှတ်ပုံတင်အမှတ်',
            'entried_year' => 'ဝင်ခွင့်ရနှစ်',
            'nrc_state' => 'မှတ်ပုံတင် ပြည်နယ်/တိုင်း',
            'nrc_township' => 'မှတ်ပုံတင် မြို့နယ်',
            'nrc_type' => 'မှတ်ပုံတင် အမျိုးအစား',
            'nrc_number' => 'မှတ်ပုံတင် နံပါတ်',
            'dob' => 'မွေးနေ့',
            'ethnicity' => 'လူမျိုး',
            'religion' => 'ဘာသာ',
            'hometown' => 'မွေးဖွားမြို့',
            'township_state_region' => 'တိုင်း/ပြည်နယ်',
            'local_foreign' => 'ပြည်တွင်း/ပြည်ပ',
            'matriculation_passed_year' => 'မတ်ရစ်အောင်နှစ်',
            'matriculation_passed_roll_no' => 'မတ်ရစ်အောင်နံပါတ်',
            'examination_center' => 'စာမေးပွဲဌာန',
            'permanent_address' => 'အမြဲတမ်းလိပ်စာ',
            'phone' => 'ဖုန်း',
            'email' => 'အီးမေးလ်',
            'image' => 'ဓာတ်ပုံ',

            'mother_name_myan' => 'မိခင်၏ အမည်ကို မြန်မာလို',
            'mother_name_eng' => 'မိခင်၏ အမည်ကို အင်္ဂလိပ်လို',
            'mother_ethnicity' => 'မိခင်၏ လူမျိုး',
            'mother_religion' => 'မိခင်၏ ဘာသာ',
            'mother_hometown' => 'မိခင်၏ မွေးဖွားရာဇာတိ',
            'mother_township_state_region' => 'မိခင် တိုင်း/ပြည်နယ်',
            'mother_nrc_state' => 'မိခင် မှတ်ပုံတင် ပြည်နယ်/တိုင်း',
            'mother_nrc_township' => 'မိခင် မှတ်ပုံတင် မြို့နယ်',
            'mother_nrc_type' => 'မိခင် မှတ်ပုံတင် အမျိုးအစား',
            'mother_nrc_number' => 'မိခင် မှတ်ပုံတင် နံပါတ်',
            'mother_job' => 'မိခင် အလုပ်အကိုင်',
            'mother_local_foreign' => 'မိခင် ပြည်တွင်း/ပြည်ပ',

            'donor_name' => 'ကျောင်းနေထောက်ပံ့မည့် ပုဂ္ဂိုလ်၏ အမည်',
            'donor_relationship' => 'ကျောင်းနေထောက်ပံ့မည့် ပုဂ္ဂိုလ်၏ ဆက်ဆံမှု',
            'donor_job' => 'ကျောင်းနေထောက်ပံ့မည့် ပုဂ္ဂိုလ်၏ အလုပ်အကိုင်',
            'donor_phone' => 'ကျောင်းနေထောက်ပံ့မည့် ပုဂ္ဂိုလ်၏ ဖုန်း',
            'donor_status' => 'ပညာသင်ထောက်ပံ့ကြေးပေးရန် ခွင့်ပြု မပြု',

            'exam_records.*.exam_name' => 'စာမေးပွဲအမည်',
            'exam_records.*.exam_major' => 'စာမေးပွဲ အဓိကဘာသာရပ်',
            'exam_records.*.exam_roll_no' => 'စာမေးပွဲနံပါတ်',
            'exam_records.*.exam_year' => 'စာမေးပွဲနှစ်',
            'exam_records.*.exam_pass_fail' => 'စာမေးပွဲ အောင်/ကျရှုံး',

            'father_name_myan' => 'ဖခင်၏ အမည်ကို မြန်မာလို',
            'father_name_eng' => 'ဖခင်၏ အမည်ကို အင်္ဂလိပ်လို',
            'father_ethnicity' => 'ဖခင် လူမျိုး',
            'father_religion' => 'ဖခင်၏ ကိုးကွယ်သည့် ဘာသာ',
            'father_hometown' => 'ဖခင် မွေးဖွားရာဇာတိ',
            'father_township_state_region' => 'ဖခင်၏ တိုင်း/ပြည်နယ်',
            'father_nrc_state' => 'ဖခင် မှတ်ပုံတင် ပြည်နယ်/တိုင်း',
            'father_nrc_township' => 'ဖခင် မှတ်ပုံတင် မြို့နယ်',
            'father_nrc_type' => 'ဖခင် မှတ်ပုံတင် အမျိုးအစား',
            'father_nrc_number' => 'ဖခင် မှတ်ပုံတင် နံပါတ်',
            'father_job' => 'ဖခင် အလုပ်အကိုင်',
            'father_local_foreign' => 'ဖခင် ပြည်တွင်း/ပြည်ပ',

            'name' => 'စာရင်းသွင်းသူအမည်',
            'examed_year' => 'စမ်းသပ်နှစ်',
            'examed_month' => 'စမ်းသပ်လ',
            'examed_name' => 'စမ်းသပ်အမည်',
            'examed_roll_no' => 'စမ်းသပ်နံပါတ်',
            'examed_status' => 'စမ်းသပ်အခြေအနေ',
            'class' => 'အတန်း',
            'fee' => 'အခကြေးငွေ',
            'guardian' => 'အုပ်ထိန်းသူ',
            'g_nrc_state' => 'အုပ်ထိန်းသူ မှတ်ပုံတင် ပြည်နယ်/တိုင်း',
            'g_nrc_township' => 'အုပ်ထိန်းသူ မှတ်ပုံတင် မြို့နယ်',
            'g_nrc_type' => 'အုပ်ထိန်းသူ မှတ်ပုံတင် အမျိုးအစား',
            'g_nrc_number' => 'အုပ်ထိန်းသူ မှတ်ပုံတင် နံပါတ်',
            'agreed' => 'သဘောတူချက်',
        ];
    }


    public function withValidator($validator)
{
    $studentId = $this->route('student')->id;

    $validator->after(function ($validator) use ($studentId) {
        // 1️⃣ Validate exam_records partially filled rows
        $records = $this->input('exam_records', []);

        foreach ($records as $index => $record) {
            $hasAny = collect($record)->filter(fn($val) => $val !== null && $val !== '')->isNotEmpty();

            if ($hasAny) {
                $requiredFields = [
                    'exam_name',
                    'exam_major',
                    'exam_roll_no',
                    'exam_year',
                    'exam_pass_fail',
                ];

                foreach ($requiredFields as $field) {
                    if (empty($record[$field]) && $record[$field] !== '0') {
                        $validator->errors()->add(
                            "exam_records.$index.$field",
                            $this->attributes()["exam_records.*.$field"] . ' ဖြည့်ပေးရန် လိုအပ်သည်။'
                        );
                    }
                }
            }
        }

        // 2️⃣ Validate uniqueness of student enrollment
        $exists = \DB::table('student_enrollments')
            ->where('student_id', $studentId)
            ->where('semester_id', $this->semester_id)
            ->where('major_id', $this->major_id)
            ->where('academic_year_id', $this->academic_year_id)
            ->exists();

        if ($exists) {
            // Attach error to roll_no or any visible field
            $validator->errors()->add(
                'roll_no',
                'ဤကျောင်းသားသည် ယခု သင်တန်းနှစ်၊ ဆယ်မစတာနှင့် မေဂျာအတွက် စာရင်းသွင်းပြီးသား ဖြစ်ပါသည်။'
            );
        }
    });
}
    
     protected function prepareForValidation(): void
    {
        $this->merge([
            'phone' => $this->normalizePhone($this->phone),
            'donor_phone' => $this->normalizePhone($this->donor_phone),
        ]);
    }

    private function normalizePhone(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        // Convert Myanmar digits to English digits
        $mm = ['၀','၁','၂','၃','၄','၅','၆','၇','၈','၉'];
        $en = ['0','1','2','3','4','5','6','7','8','9'];
        $value = str_replace($mm, $en, $value);

        // Remove spaces, dashes, parentheses
        $value = preg_replace('/[\s\-\(\)]/', '', $value);

        return $value;
    }
}
