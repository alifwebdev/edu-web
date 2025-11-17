<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@school.test'],
            [
                'name' => 'Super Admin',
                'password' => 'password123',
                'role' => 'admin'
            ]
        );

        if ($admin) {
            echo "Admin user created: admin@school.test / password123\n";
        }
    }
}
