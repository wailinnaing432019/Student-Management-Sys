<?php

namespace App\Http\Controllers;

use App\Http\Requests\MajorRequest;
use App\Models\Major;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MajorController extends Controller
{
            /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $majors = Major::all();
        return Inertia::render('Majors/Index', compact('majors'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MajorRequest $request)
    {
        $validated = $request->validated();
        Major::create($validated);
        return to_route('majors.index')->with('success', "အထူးပြု ဘာသာရပ် ထည့်သွင်းခြင်းအောင်မြင်ပါသည်။");
    }

    /**
     * Display the specified resource.
     */
    public function show(Major $major)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Major $major)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MajorRequest $request, string $id)
    {
        $validated = $request->validated();
        $major = Major::findOrFail($id);
        $major->name = $validated['name'];
        $major->description= $validated['description'];
        $major->save();

        return to_route('majors.index')->with('success', "အထူးပြု ဘာသာရပ် အချက်အလက်ပြင်ဆင်ခြင်း အောင်မြင်ပါသည်။");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Major::destroy($id);
        return to_route('majors.index')->with('error', "အထူးပြုဘာသာရပ် ဖယ်ရှားခြင်း အောင်မြင်ပါသည်။");
    }
}
