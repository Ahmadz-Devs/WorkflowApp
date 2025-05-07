<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TriggerSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('triggers')->insert([
            [
                'name' => 'Lead Created',
                'parameters' => json_encode(['lead_id']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Form Submitted',
                'parameters' => json_encode(['form_id']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Appointment Booked',
                'parameters' => json_encode(['appointment_id']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
