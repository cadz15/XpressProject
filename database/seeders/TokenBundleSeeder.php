<?php

namespace Database\Seeders;

use App\Models\TokenBundle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TokenBundleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bundles = [
            ['name' => 'Starter Pack', 'tokens' => 20, 'price' => 10.00],
            ['name' => 'Standard Pack', 'tokens' => 50, 'price' => 20.00],
            ['name' => 'Pro Pack', 'tokens' => 120, 'price' => 40.00],
        ];

        foreach ($bundles as $bundle) {
            TokenBundle::create($bundle);
        }
    }
}
