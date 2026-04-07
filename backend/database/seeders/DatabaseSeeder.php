<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Client;
use App\Models\ContactMessage;
use App\Models\Feedback;
use App\Models\Package;
use App\Models\TrainerProfile;
use App\Models\Transformation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Admin::query()->updateOrCreate([
            'email' => 'admin@gymtrainer.test',
        ], [
            'name' => 'Gym Owner',
            'password' => Hash::make('password123'),
            'role' => 'owner',
        ]);

        TrainerProfile::query()->updateOrCreate([
            'email' => 'coach@ironpulsefit.com',
        ], [
            'full_name' => 'Niroshan Perera',
            'title' => 'Certified Personal Trainer',
            'headline' => 'Transform your body with expert 1-to-1 coaching, nutrition support, and result-driven programming.',
            'bio' => 'I help busy clients lose fat, build lean muscle, and create habits they can sustain. Every program is tailored to the client\'s schedule, fitness level, and long-term goals.',
            'experience' => '8+ years helping clients across Sri Lanka and online',
            'mission' => 'Make professional fitness coaching simple, supportive, and measurable for every client.',
            'certifications' => [
                'ACE Certified Personal Trainer',
                'Sports Nutrition Specialist',
                'Functional Strength Coach',
            ],
            'skills' => [
                'Weight loss coaching',
                'Muscle building',
                'Body recomposition',
                'Home workout planning',
                'Nutrition guidance',
            ],
            'phone' => '+94 77 123 4567',
            'whatsapp_number' => '+94 77 123 4567',
            'address' => 'No. 24, Fitness Street, Colombo, Sri Lanka',
            'social_links' => [
                'instagram' => 'https://instagram.com/ironpulsefit',
                'facebook' => 'https://facebook.com/ironpulsefit',
                'youtube' => 'https://youtube.com/@ironpulsefit',
            ],
            'map_embed_url' => 'https://www.google.com/maps?q=Colombo&output=embed',
            'profile_image' => 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=900&q=80',
        ]);

        $packages = collect([
            [
                'name' => 'Beginner Kickstart',
                'slug' => 'beginner-kickstart',
                'description' => 'A starter-friendly plan focused on consistency, movement quality, and early fat loss.',
                'duration' => '4 weeks',
                'sessions' => 12,
                'price' => 12000,
                'features' => [
                    'Initial body assessment',
                    '3 sessions per week',
                    'WhatsApp check-ins',
                    'Habit tracking',
                ],
                'benefits' => [
                    'Build workout confidence',
                    'Improve energy levels',
                ],
                'suitable_for' => 'Beginners restarting their fitness journey',
                'training_type' => 'In-person',
                'whatsapp_message' => 'Hello Coach, I am interested in your Beginner Kickstart package. Please share more details.',
                'image' => 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
                'status' => 'active',
                'sort_order' => 1,
            ],
            [
                'name' => 'Weight Loss Accelerator',
                'slug' => 'weight-loss-accelerator',
                'description' => 'Structured personal training and nutrition guidance designed to improve fat loss sustainably.',
                'duration' => '8 weeks',
                'sessions' => 24,
                'price' => 24000,
                'features' => [
                    'Customized calorie targets',
                    'Progress photos every 2 weeks',
                    'Trainer accountability calls',
                    'Meal structure guidance',
                ],
                'benefits' => [
                    'Visible body-fat reduction',
                    'Simple nutrition structure',
                ],
                'suitable_for' => 'Clients focused on steady fat loss',
                'training_type' => 'Hybrid',
                'whatsapp_message' => 'Hello Coach, I am interested in your Weight Loss Accelerator package. Please share more details.',
                'image' => 'https://images.unsplash.com/photo-1571019613914-85f342c55f55?auto=format&fit=crop&w=1200&q=80',
                'status' => 'active',
                'sort_order' => 2,
            ],
            [
                'name' => 'Muscle Gain Blueprint',
                'slug' => 'muscle-gain-blueprint',
                'description' => 'A progressive strength and hypertrophy plan for clients who want size, shape, and better recovery.',
                'duration' => '12 weeks',
                'sessions' => 36,
                'price' => 36000,
                'features' => [
                    'Periodized training blocks',
                    'Strength tracking',
                    'Nutrition targets for muscle gain',
                    'Weekly video review',
                ],
                'benefits' => [
                    'Increase lean muscle mass',
                    'Improve strength safely',
                ],
                'suitable_for' => 'Intermediate and advanced lifters',
                'training_type' => 'In-person / Online',
                'whatsapp_message' => 'Hello Coach, I am interested in your Muscle Gain Blueprint package. Please share more details.',
                'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
                'status' => 'active',
                'sort_order' => 3,
            ],
            [
                'name' => 'Online Coaching Pro',
                'slug' => 'online-coaching-pro',
                'description' => 'Remote coaching with custom workouts, check-ins, and flexible support for busy schedules.',
                'duration' => '6 weeks',
                'sessions' => 18,
                'price' => 18000,
                'features' => [
                    'Mobile-friendly workout plan',
                    'Weekly check-ins',
                    'Form review by video',
                    'WhatsApp support',
                ],
                'benefits' => [
                    'Train from anywhere',
                    'Maintain accountability remotely',
                ],
                'suitable_for' => 'Remote clients and home workout coaching',
                'training_type' => 'Online',
                'whatsapp_message' => 'Hello Coach, I am interested in your Online Coaching Pro package. Please share more details.',
                'image' => 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
                'status' => 'active',
                'sort_order' => 4,
            ],
        ])->mapWithKeys(function (array $package): array {
            $record = Package::query()->updateOrCreate(
                ['slug' => $package['slug']],
                $package,
            );

            return [$record->slug => $record];
        });

        $clients = collect([
            [
                'name' => 'Kavindu Silva',
                'age' => 29,
                'gender' => 'Male',
                'phone' => '+94 71 200 3001',
                'email' => 'kavindu@example.com',
                'goal' => 'Lose body fat and improve conditioning',
                'selected_package_id' => $packages['weight-loss-accelerator']->id,
                'joined_date' => '2026-01-10',
                'notes' => 'Works late shifts and prefers morning training.',
                'progress_notes' => 'Down 7kg in 10 weeks with improved stamina.',
            ],
            [
                'name' => 'Amanda Fernando',
                'age' => 34,
                'gender' => 'Female',
                'phone' => '+94 71 200 3002',
                'email' => 'amanda@example.com',
                'goal' => 'Build muscle and improve posture',
                'selected_package_id' => $packages['muscle-gain-blueprint']->id,
                'joined_date' => '2026-02-02',
                'notes' => 'Focus on upper-body strength and sustainable nutrition.',
                'progress_notes' => 'Strength up across all compound lifts and gained visible lean mass.',
            ],
        ])->mapWithKeys(function (array $client): array {
            $record = Client::query()->updateOrCreate(
                ['email' => $client['email']],
                $client,
            );

            return [$record->email => $record];
        });

        Transformation::query()->updateOrCreate([
            'title' => '12-Week Fat Loss Reset',
        ], [
            'client_id' => $clients['kavindu@example.com']->id,
            'before_image' => 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
            'after_image' => 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80',
            'duration' => '12 weeks',
            'weight_change' => '-9 kg',
            'goals_achieved' => 'Fat loss, improved energy, stronger core',
            'result_description' => 'A structured mix of strength work, cardio, and nutrition check-ins helped create visible and sustainable progress.',
            'success_story' => 'Kavindu improved consistency by training before work and keeping meals simple enough to repeat every week.',
            'status' => 'published',
            'featured' => true,
        ]);

        Transformation::query()->updateOrCreate([
            'title' => 'Strength and Shape Rebuild',
        ], [
            'client_id' => $clients['amanda@example.com']->id,
            'before_image' => 'https://images.unsplash.com/photo-1517837016564-bfcf619c55b3?auto=format&fit=crop&w=1000&q=80',
            'after_image' => 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1000&q=80',
            'duration' => '16 weeks',
            'weight_change' => '+3 kg lean mass',
            'goals_achieved' => 'Improved shape, stronger posture, better confidence',
            'result_description' => 'Amanda followed a progressive overload plan and nutrition targets that supported strength and recovery.',
            'success_story' => 'The biggest breakthrough came from training with consistency instead of intensity spikes.',
            'status' => 'published',
            'featured' => true,
        ]);

        Feedback::query()->updateOrCreate([
            'client_name' => 'Kavindu Silva',
            'message' => 'The plan was realistic, the support was constant, and the results felt sustainable from the first month.',
        ], [
            'rating' => 5,
            'status' => 'approved',
            'is_featured' => true,
            'approved_at' => now(),
        ]);

        Feedback::query()->updateOrCreate([
            'client_name' => 'Amanda Fernando',
            'message' => 'I finally had a training structure that matched my work schedule and helped me stay consistent.',
        ], [
            'rating' => 5,
            'status' => 'approved',
            'is_featured' => true,
            'approved_at' => now(),
        ]);

        Feedback::query()->updateOrCreate([
            'client_name' => 'Dilan Jayasinghe',
            'message' => 'Looking forward to starting again next month. Coaching and accountability were excellent.',
        ], [
            'rating' => 4,
            'status' => 'pending',
            'is_featured' => false,
            'approved_at' => null,
        ]);

        ContactMessage::query()->updateOrCreate([
            'email' => 'newlead@example.com',
        ], [
            'name' => 'Sasini Perera',
            'phone' => '+94 77 555 1111',
            'message' => 'I want to know which package is best for fat loss and if you offer evening sessions.',
            'status' => 'new',
        ]);

        ContactMessage::query()->updateOrCreate([
            'email' => 'corporate@example.com',
        ], [
            'name' => 'Ruwan',
            'phone' => '+94 77 555 2222',
            'message' => 'Do you offer remote coaching for busy professionals with weekly check-ins?',
            'status' => 'read',
        ]);
    }
}
