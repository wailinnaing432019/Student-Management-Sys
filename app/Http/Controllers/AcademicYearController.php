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

        return redirect()->back()->with('success', 'Academic year created successfully.');
    }

    public function update(AcademicYearUpdateRequest $request, AcademicYear $academicYear)
    {
        $validated = $request->validated();

        $academicYear->update($validated);

        return redirect()->back()->with('success', 'Academic year updated successfully.');
    }

    public function destroy(AcademicYear $academicYear)
    {
        $academicYear->delete();

        return redirect()->back()->with('success', 'Academic year deleted successfully.');
    }
}
