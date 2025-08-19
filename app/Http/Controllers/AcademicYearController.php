<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcademicYearRequest;
use App\Http\Requests\AcademicYearUpdateRequest;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
     public function index()
    {
        $academicYears = AcademicYear::orderBy('start_date', 'desc')->get();
        return inertia('AcademicYears/Index', compact('academicYears'));
    }

    public function store(AcademicYearRequest $request)
    {
        $validated = $request->validated();

        AcademicYear::create($validated);

        return redirect()->back()->with('success', 'ပညာသင်နှစ် အသစ်တစ်ခု ဖန်တီးခြင်း အောင်မြင်ပါသည်။');
    }

    public function update(AcademicYearUpdateRequest $request, AcademicYear $academicYear)
    {
        $validated = $request->validated();

        $academicYear->update($validated);

        return redirect()->back()->with('success', 'ပညာသင်နှစ် အချက်အလက်ပြင်ဆင်ခြင်း အောင်မြင်ပါသည်။');
    }

    public function destroy(AcademicYear $academicYear)
    {
        $academicYear->delete();

        return redirect()->back()->with('success', 'ပညာသင်နှစ် ဖယ်ရှားခြင်းအောင်မြင်ပါသည်။');
    }
}
