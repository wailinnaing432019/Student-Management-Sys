<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CourseUpdateRequest extends FormRequest
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
        'name' => [
            'required',
            'string',
            'max:255',
        ],
        'code' => [
            'required',
            'string',
            Rule::unique('courses')
                ->where(function ($query) {
                    return $query->where('name', $this->name);
                })
                ->ignore($this->route('course')), // Ignore current course for update
        ],
        'description' => 'nullable|string',
        'is_elective' => 'boolean',
        'major_ids' => 'required|array',
        'major_ids.*' => 'exists:majors,id',
    ];
    }
    public function messages()
    {
        return [
            'name.required' => 'အမည်ထည့်ရန် လိုအပ်သည်။',
            'name.string' => 'အမည်သည် စာသားဖြစ်ရမည်။',
            'name.max' => 'အမည်သည် အကြီးဆုံးအက္ခရာ ၂၅၅ အထိသာဖြစ်ရမည်။',

            'code.required' => 'ကုဒ်ထည့်ရန် လိုအပ်သည်။',
            'code.unique' => 'ဤဘာသာရပ် အမည်နှင့် ကုဒ် ရှိပြီးသားဖြစ်သည်။',
            'code.string' => 'ကုဒ်သည် စာသားဖြစ်ရမည်။',

            'description.string' => 'ဖော်ပြချက်သည် စာသားဖြစ်ရမည်။',

            'is_elective.boolean' => 'ရွေးချယ်မှု သို့မဟုတ် မဟုတ်မှုသည် true/false ဖြစ်ရမည်။',

            'major_ids.required' => 'အထူးပြုဘာသာရပ်များကို ရွေးချယ်ရန် လိုအပ်သည်။',
            'major_ids.array' => 'အထူးပြုဘာသာရပ်များသည် စာရင်းအဖြစ် ရှိရမည်။',

            'major_ids.*.exists' => 'ရွေးချယ်ထားသော အထူးပြုဘာသာရပ်တစ်ခုခု မမှန်ကန်ပါ။',
        ];
    }
}
