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
        'regex:/^([၀-၉]{4})-([၀-၉]{4})$/u',
    ],
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'ပညာသင်နှစ် အမည်ထည့်ရန် လိုအပ်သည်။',
            'name.string' => 'ပညာသင်နှစ် အမည်သည် စာသားဖြစ်ရမည်။',
            'name.unique' => 'ပညာသင်နှစ် အမည်သည် ရှိပြီးသားဖြစ်ပါသည်။',
            'name.regex' => 'ပညာသင်နှစ် ပုံစံအမှန် ဖြစ်ရမည်။ ဥပမာ- ၂၀၂၄-၂၀၂၅',
            'start_date.nullable' => 'အစပြုသည့်ရက်စွဲထည့်ရန် လိုအပ်သည်။',
            'start_date.date' => 'အစပြုသည့်ရက်စွဲသည် ရက်စွဲတစ်ခု ဖြစ်ရမည်။',

            'end_date.nullable' => 'အဆုံးသတ်သည့်ရက်စွဲထည့်ရန် လိုအပ်သည်။',
            'end_date.date' => 'အဆုံးသတ်သည့်ရက်စွဲသည် ရက်စွဲတစ်ခု ဖြစ်ရမည်။',
            'end_date.after' => 'အဆုံးသတ်သည့်ရက်စွဲသည် အစပြုသည့်ရက်စွဲနှင့်တူ သို့မဟုတ် ကျော်လွန်ရမည်။',
        ];
    }
}
