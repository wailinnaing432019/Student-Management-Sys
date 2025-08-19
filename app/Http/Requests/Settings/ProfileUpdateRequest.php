<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
        ];
    }
    public function messages(): array
{
    return [
        'name.required' => 'အမည်ကို ဖြည့်ရန် လိုအပ်ပါသည်။',
        'name.string' => 'အမည်သည် စာလုံးများဖြင့်သာဖြစ်ရမည်။',
        'name.max' => 'အမည်သည် အများဆုံး 255 စာလုံး ဖြစ်နိုင်သည်။',

        'email.required' => 'အီးမေးလ်ကို ဖြည့်ရန် လိုအပ်ပါသည်။',
        'email.string' => 'အီးမေးလ်သည် စာသားဖြစ်ရမည်။',
        'email.lowercase' => 'အီးမေးလ်သည် အနိမ့်အက္ခရာဖြင့် ရေးရန် လိုအပ်ပါသည်။',
        'email.email' => 'အီးမေးလ်ပုံစံ မှားနေပါသည်။',
        'email.max' => 'အီးမေးလ်သည် အများဆုံး 255 စာလုံး ဖြစ်နိုင်သည်။',
        'email.unique' => 'အီးမေးလ်ကို အသုံးပြုပြီးသား ဖြစ်နေပါသည်။',
    ];
}
}
