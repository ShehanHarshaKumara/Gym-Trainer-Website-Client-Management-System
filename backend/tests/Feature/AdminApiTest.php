<?php

namespace Tests\Feature;

use App\Models\Package;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login_and_create_a_package(): void
    {
        $this->seed();

        $loginResponse = $this->postJson('/api/admin/login', [
            'email' => 'admin@gymtrainer.test',
            'password' => 'password123',
        ]);

        $token = $loginResponse->assertOk()->json('token');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/admin/packages', [
                'name' => 'Corporate Fit',
                'slug' => 'corporate-fit',
                'description' => 'Structured package for busy professionals.',
                'duration' => '10 weeks',
                'sessions' => 20,
                'price' => 30000,
                'features' => ['Workouts', 'Check-ins'],
                'benefits' => ['Accountability'],
                'suitable_for' => 'Busy executives',
                'training_type' => 'Hybrid',
                'whatsapp_message' => 'Hello Coach, tell me about Corporate Fit.',
                'status' => 'active',
                'sort_order' => 5,
            ])
            ->assertCreated()
            ->assertJsonPath('data.slug', 'corporate-fit');

        $this->assertDatabaseHas((new Package())->getTable(), [
            'slug' => 'corporate-fit',
            'name' => 'Corporate Fit',
        ]);
    }
}
