<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trainer_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('title');
            $table->string('headline')->nullable();
            $table->longText('bio');
            $table->string('experience');
            $table->text('mission')->nullable();
            $table->json('certifications')->nullable();
            $table->json('skills')->nullable();
            $table->string('phone')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->json('social_links')->nullable();
            $table->string('map_embed_url')->nullable();
            $table->string('profile_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trainer_profiles');
    }
};
