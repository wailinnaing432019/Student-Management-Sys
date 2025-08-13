<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseSemesterRequest extends FormRequest
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
            'semester_id' => 'required|exists:semesters,id',
            'courses' => 'required|array',
            'courses.*.id' => 'required|exists:courses,id',
            'courses.*.is_elective' => 'boolean',
        ];
    }

    public function messages()
    {
        return [
            'semester_id.required' => 'သင်တန်းကာလ ရွေးချယ်ရန် လိုအပ်ပါသည်။',
            'semester_id.exists' => 'ရွေးချယ်ထားသော သင်တန်းကာလ မမှန်ကန်ပါ။',

            'courses.required' => 'ဘာသာရပ်များ ထည့်ရန် လိုအပ်ပါသည်။',
            'courses.array' => 'ဘာသာရပ်များသည် စာရင်းအဖြစ် ရှိရမည်။',

            'courses.*.id.required' => 'ဘာသာရပ် ID မရှိပါ။',
            'courses.*.id.exists' => 'ရွေးချယ်ထားသော ဘာသာရပ် မမှန်ကန်ပါ။',

            'courses.*.is_elective.boolean' => 'ရွေးချယ်မှု သို့မဟုတ် မဟုတ်မှုသည် true/false ဖြစ်ရမည်။',
        ];
    }
}
