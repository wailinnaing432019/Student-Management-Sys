<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MajorUpdateRequest extends FormRequest
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
            Rule::unique('majors', 'name')->ignore($this->route('major')), // <-- ignore current major ID
        ],
        'description' => 'nullable|string',
    ];
    }
    public function messages()
    {
        return [
            'name.required' => 'အထူးပြုဘာသာ ထည့်ရန် လိုအပ်သည်။',
            'name.unique' => 'ဒီအထူးပြုဘာသာ အမည်ရှိပြီးသားဖြစ်သည်။',
            'name.string' => 'အထူးပြုဘာသာသည် စာသားဖြစ်ရမည်။',
            'name.max' => 'အထူးပြုဘာသာသည် အကြီးဆုံးအက္ခရာ ၂၅၅ အထိသာဖြစ်ရမည်။',

             
            'description.string' => 'ဖော်ပြချက်သည် စာသားဖြစ်ရမည်။',

            
        ];
    }
}
