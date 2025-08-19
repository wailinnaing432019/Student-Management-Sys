<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController extends Controller
{
    /**
     * Show the user's password settings page.
     */
    public function edit(): Response
    {
        return Inertia::render('settings/password');
    }

    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
       $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ], [
            'current_password.required' => 'လက်ရှိစကားဝှက်ကို ဖြည့်ရန် လိုအပ်ပါသည်။',
            'current_password.current_password' => 'လက်ရှိစကားဝှက် မှားနေပါသည်။',
            'password.required' => 'စကားဝှက်ကို ဖြည့်ရန် လိုအပ်ပါသည်။',
            'password.confirmed' => 'စကားဝှက်နှင့် အတည်ပြုစကားဝှက် မကိုက်ညီပါ။',
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

         // Log out manually
    Auth::logout();

    // Invalidate session
    $request->session()->invalidate();
    $request->session()->regenerateToken();
        return to_route('login')->with('success',"လျို့၀ှက်နံပါတ် ပြောင်းလဲပြီးပါပြီ။");
    }
}
