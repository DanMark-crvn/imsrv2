<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AccountUsers>
 */
class AccountUsersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'name' => fake()->name(),
            'profile_path' => fake()->imageUrl(),
            // 'department_users'=> fake()->randomElement(['Admin','HR','IT','Accounting','Purchasing','COOP','GA','GA/Nurse','Safety','Finance','Guard House','Sales','Facilities','IMS','CMM','QC','Assembly','Die Casting','Die Mold','Die Casting Engineering','PPC','Machining','Machine Engineering','Deburring','New Project','MRO Warehouse','N/A','Learning and Development']),
            'department_users' => fake()->word(),
            'initial' => fake()->unique()->lexify('?.????'),
            'outlookEmail' => fake()->email(),
            'password' => fake()->password(),
            'status' => fake()->word(),
            'created_by'=> 1,
            'updated_by'=> 1,
            'created_at'=> time(),
            'updated_at'=> time()
        ];
    }
}
