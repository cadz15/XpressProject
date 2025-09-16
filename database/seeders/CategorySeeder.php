<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $categories = [
            'Electronics' => ['Phones','Laptops','Audio'],
            'Vehicles' => ['Cars','Motorcycles','Parts'],
            'Fashion' => ['Men','Women','Accessories'],
            'Home & Garden' => ['Furniture','Kitchen','Tools'],
            'Collectibles' => ['Coins','Stamps','Memorabilia'],
            'Art & Design' => ['Paintings','Prints','Digital'],
            'Jewelry & Watches' => ['Rings','Bracelets','Luxury Watches'],
            'Sports & Outdoors' => ['Equipment','Apparel','Camping'],
            'Toys/Kids/Baby' => ['Toys','Clothes','Baby Gear'],
            'Tools & Machinery' => ['Hand Tools','Power Tools'],
            'Real Estate' => ['Residential','Commercial'],
            'Services' => ['Freelance','Repair'],
            'Books/Music/Media' => ['Books','Vinyl','Games'],
            'Health & Beauty' => ['Skincare','Supplements'],
            'Pets' => ['Pet Food','Pets Accessories'],
            'Industrial' => ['Heavy Equipment','Supplies'],
            'Office Supplies' => ['Office Furniture','Stationery'],
            'Cameras' => ['DSLR','Lenses'],
            'Computers' => ['Desktops','Components'],
            'Tickets & Events' => ['Concerts','Sports'],
            'Other' => [],
        ];

        foreach ($categories as $parent => $children) {
            $parentCat = Category::create(['name' => $parent]);
            foreach ($children as $child) {
                Category::create(['name' => $child, 'parent_id' => $parentCat->id]);
            }
        }
    }
}
