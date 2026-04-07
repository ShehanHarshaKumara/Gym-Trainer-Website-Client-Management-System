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
        Schema::create('transformations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('before_image');
            $table->string('after_image');
            $table->string('duration');
            $table->string('weight_change')->nullable();
            $table->string('goals_achieved')->nullable();
            $table->text('result_description');
            $table->text('success_story')->nullable();
            $table->string('status')->default('published');
            $table->boolean('featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transformations');
    }
};
