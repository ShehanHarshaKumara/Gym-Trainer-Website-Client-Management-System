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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->longText('description');
            $table->string('duration');
            $table->unsignedInteger('sessions')->nullable();
            $table->decimal('price', 10, 2);
            $table->json('features')->nullable();
            $table->json('benefits')->nullable();
            $table->string('suitable_for')->nullable();
            $table->string('training_type')->nullable();
            $table->string('whatsapp_message')->nullable();
            $table->string('image')->nullable();
            $table->string('status')->default('active');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
