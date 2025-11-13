<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make sure roles exist first
        $this->call(RoleSeeder::class);

        // ✅ Create a default admin user if not exists
        $admin = User::firstOrCreate(
            ['email' => 'admin@school.test'],
            [
                'name' => 'Super Admin',
                'password' => 'password123',
            ]
        );

        // ✅ Assign 'admin' role
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        echo "Admin user created successfully:\n";
        echo "Email: admin@school.test\n";
        echo "Password: password123\n";
    }
}
