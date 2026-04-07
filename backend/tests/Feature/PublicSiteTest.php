<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicSiteTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_site_endpoint_returns_seeded_content(): void
    {
        $this->seed();

        $response = $this->getJson('/api/site');

        $response
            ->assertOk()
            ->assertJsonPath('data.packages.0.name', 'Beginner Kickstart')
            ->assertJsonStructure([
                'data' => [
                    'trainer_profile',
                    'packages',
                    'transformations',
                    'feedback',
                    'stats',
                ],
            ]);
    }

    public function test_public_users_can_submit_feedback_and_contact_messages(): void
    {
        $this->seed();

        $this->postJson('/api/feedback', [
            'client_name' => 'Test Client',
            'rating' => 5,
            'message' => 'Great coaching experience.',
        ])->assertCreated();

        $this->postJson('/api/contact-messages', [
            'name' => 'Lead User',
            'email' => 'lead@example.com',
            'message' => 'I want to start next month.',
        ])->assertCreated();
    }
}
