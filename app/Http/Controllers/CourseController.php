<?php

namespace App\Http\Controllers;

use App\Http\Requests\CourseRequest;
use App\Models\Course;
use App\Models\Major;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
    $query = Course::query()->with('majors');

    if ($request->filled('major_id')) {
        $query->whereHas('majors', function ($q) use ($request) {
            $q->where('majors.id', $request->major_id);
        });
    }

    $courses = $query->paginate(6)->withQueryString(); // 10 per page
    $majors = Major::all();

    return Inertia::render('Courses/Index', [
        'courses' => $courses,
        'majors' => $majors,
        'filters' => $request->only('major_id'),
    ]);
    }

    public function store(CourseRequest $request)
{
   $data = $request->validated();

    // Create the course (without major_id)
    $course = Course::create([
        'name' => $data['name'],
        'code' => $data['code'],
        'description' => $data['description'] ?? null,
        'is_elective' => $data['is_elective'] ?? false,
    ]);

    // Attach majors via pivot
    $course->majors()->attach($data['major_ids']);


    // check where to redirect
    $redirectTo = $request->input('redirect');

// dd($redirectTo);
    if(!$redirectTo){
        return redirect()->route('courses.index')->with('success', 'ဘာသာရပ် အသစ်တစ်ခု ထည့်ပြီးပါပြီ။');

    }
    return redirect()->route($redirectTo)->with('success', 'ဘာသာရပ် အသစ်တစ်ခု ထည့်ပြီးပါပြီ။');

}

public function update(CourseRequest $request, Course $course)
{
    $data = $request->validated();

    // Update course fields
    $course->update([
        'name' => $data['name'],
        'code' => $data['code'],
        'description' => $data['description'] ?? null,
        'is_elective' => $data['is_elective'] ?? false,
    ]);

    // Sync majors
    $course->majors()->sync($data['major_ids'] ?? []);

    return redirect()->route('courses.index')->with('success', 'ဘာသာရပ်အချက်အလက် ပြင်ဆင်ပြီးပါပြီ။');
}

    public function destroy(Course $course)
{
    $course->majors()->detach(); // Optional: cleanup pivot manually

    $course->delete();

    return redirect()->route('courses.index')->with('success', 'ဘာသာရပ် အားဖယ်ရှားပြီးပါပြီ။');
}

}
