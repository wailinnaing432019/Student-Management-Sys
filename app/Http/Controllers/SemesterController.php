<?php

namespace App\Http\Controllers;

use App\Http\Requests\SemesterRequest;
use App\Models\AcademicYear;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
class SemesterController extends Controller
{
    public function index(Request $request)
{
    $academicYears = AcademicYear::orderBy('start_date', 'desc')->get();

    // Safe fallback if no academic year exists
    $selectedAcademicYearId = $request->input('academic_year_id', $academicYears->first()?->id);

    $semesters = collect();
    if ($selectedAcademicYearId) {
        $semesters = Semester::with('academicYear')
            ->where('academic_year_id', $selectedAcademicYearId)
            ->get();
    }

    return Inertia::render('Semesters/Index', [
        'semesters' => $semesters,
        'academicYears' => $academicYears,
        'selectedAcademicYearId' => $selectedAcademicYearId,
    ]);
}


    public function create()
    {
        // Optionally you can load academic years for dropdown in create page
 
    }

    public function store(SemesterRequest $request)
    {
$validated = $request->validated();

if($request->start_date && $request->end_date){


// Fetch academic year dates
$academicYear = AcademicYear::findOrFail($validated['academic_year_id']);

// Check start date range
if ($validated['start_date'] < $academicYear->start_date || $validated['start_date'] > $academicYear->end_date) {
    throw ValidationException::withMessages([
        'start_date' => 'The semester start date must be within the academic year dates.',
    ]);
}

// Check end date range
if ($validated['end_date'] < $academicYear->start_date || $validated['end_date'] > $academicYear->end_date) {
    throw ValidationException::withMessages([
        'end_date' => 'The semester end date must be within the academic year dates.',
    ]);
}
}        // dd($validated);

        Semester::create($validated);

        return redirect()->back()->with('success', 'သင်တန်းကာလ အသစ် တစ်ခု ဖန်တီးခြင်း အောင်မြင်ပါသည်။');
    }

    public function edit(Semester $semester)
    {
        $academicYears = AcademicYear::orderBy('start_date', 'desc')->get();

        return inertia('Semesters/Edit', compact('semester', 'academicYears'));
    }

    public function update(Request $request, Semester $semester)
    {
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'year_name' => 'required|string', 
            'semester_number'=>'required|numeric',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);
if($request->start_date && $request->end_date){


// Fetch academic year dates
$academicYear = AcademicYear::findOrFail($validated['academic_year_id']);

// Check start date range
if ($validated['start_date'] < $academicYear->start_date || $validated['start_date'] > $academicYear->end_date) {
    throw ValidationException::withMessages([
        'start_date' => 'The semester start date must be within the academic year dates.',
    ]);
}

// Check end date range
if ($validated['end_date'] < $academicYear->start_date || $validated['end_date'] > $academicYear->end_date) {
    throw ValidationException::withMessages([
        'end_date' => 'The semester end date must be within the academic year dates.',
    ]);
}
} 
        $semester->update($validated);

        return redirect()->back()->with('success', 'သင်တန်းကာလ အချက်အလက်ပြင်ဆင်ခြင်း အောင်မြင်ပါသည်။');
    }

    public function destroy(Semester $semester)
    {
        $semester->delete();

        return redirect()->back()->with('success', 'သင်တန်းကာလ ဖယ်ရှားခြင်း အောင်မြင်ပါသည်။');
    }
}
