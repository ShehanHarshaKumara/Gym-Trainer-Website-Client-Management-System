<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesMediaUploads;
use App\Http\Controllers\Controller;
use App\Models\TrainerProfile;
use Illuminate\Http\Request;

class TrainerProfileController extends Controller
{
    use HandlesMediaUploads;

    public function show()
    {
        return response()->json([
            'data' => TrainerProfile::query()->first(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate($this->rules());

        $profile = TrainerProfile::query()->first() ?? new TrainerProfile();

        $validated['profile_image'] = $this->syncMedia(
            $request,
            'profile_image',
            'profile_image_url',
            $profile->profile_image,
            'trainer'
        );

        $profile->fill($validated);
        $profile->save();

        return response()->json([
            'message' => 'Trainer profile updated successfully.',
            'data' => $profile->fresh(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:120'],
            'title' => ['required', 'string', 'max:120'],
            'headline' => ['nullable', 'string', 'max:255'],
            'bio' => ['required', 'string'],
            'experience' => ['required', 'string', 'max:255'],
            'mission' => ['nullable', 'string'],
            'certifications' => ['nullable', 'array'],
            'certifications.*' => ['string', 'max:255'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'whatsapp_number' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:120'],
            'address' => ['nullable', 'string'],
            'social_links' => ['nullable', 'array'],
            'social_links.*' => ['nullable', 'string', 'max:255'],
            'map_embed_url' => ['nullable', 'url'],
            'profile_image' => ['nullable', 'image', 'max:4096'],
            'profile_image_url' => ['nullable', 'url'],
        ];
    }
}
