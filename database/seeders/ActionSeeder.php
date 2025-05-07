<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('actions')->insert([
            [
                'name' => 'Send Email',
                'fields_required' => json_encode(['to', 'subject', 'body']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Send SMS',
                'fields_required' => json_encode(['to', 'body']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Send Push Notification',
                'fields_required' => json_encode(['device', 'content']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
