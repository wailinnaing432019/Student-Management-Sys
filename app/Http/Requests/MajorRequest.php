<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MajorRequest extends FormRequest
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
            'name'=>'required|string|max:255',
            'description'=>'nullable|string'
        ]; 
    }
    public function messages()
    {
        return [
            'name.required' => 'အမည်ထည့်ရန် လိုအပ်သည်။',
            'name.string' => 'အမည်သည် စာသားဖြစ်ရမည်။',
            'name.max' => 'အမည်သည် အကြီးဆုံးအက္ခရာ ၂၅၅ အထိသာဖြစ်ရမည်။',

             
            'description.string' => 'ဖော်ပြချက်သည် စာသားဖြစ်ရမည်။',

            
        ];
    }
}
