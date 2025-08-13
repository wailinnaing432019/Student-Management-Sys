<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AcademicYearRequest extends FormRequest
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
     public function rules()
    {
        return [
            'name' => [
        'required',
        'string',
        'unique:academic_years,name',
        'regex:/^([0-9]{4}|[၀-၉]{4})-([0-9]{2}|[0-9]{4}|[၀-၉]{2}|[၀-၉]{4})$/u',
    ],
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'ပညာသင်နှစ် အမည်ထည့်ရန် လိုအပ်သည်။',
            'name.string' => 'ပညာသင်နှစ် အမည်သည် စာသားဖြစ်ရမည်။',
            'name.unique' => 'ပညာသင်နှစ် အမည် သီးခြားထူးခြားရမည်။',

            'start_date.required' => 'အစပြုသည့်ရက်စွဲထည့်ရန် လိုအပ်သည်။',
            'start_date.date' => 'အစပြုသည့်ရက်စွဲသည် ရက်စွဲတစ်ခု ဖြစ်ရမည်။',

            'end_date.required' => 'အဆုံးသတ်သည့်ရက်စွဲထည့်ရန် လိုအပ်သည်။',
            'end_date.date' => 'အဆုံးသတ်သည့်ရက်စွဲသည် ရက်စွဲတစ်ခု ဖြစ်ရမည်။',
            'end_date.after_or_equal' => 'အဆုံးသတ်သည့်ရက်စွဲသည် အစပြုသည့်ရက်စွဲနှင့်တူ သို့မဟုတ် ကျော်လွန်ရမည်။',
        ];
    }
}
