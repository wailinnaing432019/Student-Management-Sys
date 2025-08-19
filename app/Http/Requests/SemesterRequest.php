<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SemesterRequest extends FormRequest
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
        return [
            'academic_year_id' => 'required|exists:academic_years,id',
            'year_name'        => 'required|string',
            'semester_number'  => [
                'required',
                'numeric',
                Rule::unique('semesters')
                    ->where(fn ($query) => $query->where('academic_year_id', $this->academic_year_id)),
            ],
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date|after:start_date',
        ];
    }

    public function messages(): array
    {
        return [
            'academic_year_id.required' => 'ပညာသင်နှစ်ကို ဖြည့်ရန်လိုအပ်ပါသည်။',
            'academic_year_id.exists'   => 'ရွေးချယ်ထားသော ပညာသင်နှစ် မရှိပါ။',

            'year_name.required' => 'နှစ်အမည်ကို ဖြည့်ရန်လိုအပ်ပါသည်။',
            'year_name.string'   => 'နှစ်အမည်သည် စာသား ဖြစ်ရမည်။',

            'semester_number.required' => 'သင်တန်းကာလ အမှတ်ကို ဖြည့်ရန်လိုအပ်ပါသည်။',
            'semester_number.numeric'  => 'သင်တန်းကာလ အမှတ်သည် ကိန်းဂဏန်း ဖြစ်ရမည်။',
            'semester_number.unique'   => 'ယခုပညာသင်နှစ်အတွက် ဒီသင်တန်းကာလ ရှိပြီးသားဖြစ်သည်။',

            'start_date.date' => 'စတင်သည့်နေ့သည် မှန်ကန်သော ရက်စွဲဖြစ်ရမည်။',

            'end_date.date'  => 'ပြီးဆုံးသည့်နေ့သည် မှန်ကန်သော ရက်စွဲဖြစ်ရမည်။',
            'end_date.after' => 'ပြီးဆုံးသည့်နေ့သည် စတင်သည့်နေ့ထက် နောက်မှ ဖြစ်ရမည်။',
        ];
    }
}
