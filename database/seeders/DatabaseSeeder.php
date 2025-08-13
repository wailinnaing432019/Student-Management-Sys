<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password'=>Hash::make('11111111'),
            'role'=>'admin',
        ]);

        User::factory()->create([
            'name' => 'Staff',
            'email' => 'staff@gmail.com',
            'password'=>Hash::make('11111111'), 
        ]);
    }
}
