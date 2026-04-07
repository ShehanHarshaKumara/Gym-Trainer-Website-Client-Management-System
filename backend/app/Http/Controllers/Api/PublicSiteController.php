<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\HandlesMediaUploads;
use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\ContactMessage;
use App\Models\Feedback;
use App\Models\Package;
use App\Models\TrainerProfile;
use App\Models\Transformation;
use Illuminate\Http\Request;

class PublicSiteController extends Controller
{
    use HandlesMediaUploads;

    public function home()
    {
        $trainerProfile = TrainerProfile::query()->first();

        return response()->json([
            'data' => [
                'trainer_profile' => $trainerProfile,
                'packages' => $this->formattedPackages($trainerProfile?->whatsapp_number),
                'transformations' => Transformation::query()
                    ->with('client:id,name')
                    ->where('status', 'published')
                    ->orderByDesc('featured')
                    ->latest()
                    ->take(6)
                    ->get(),
                'feedback' => Feedback::query()
                    ->where('status', 'approved')
                    ->orderByDesc('is_featured')
                    ->latest()
                    ->take(6)
                    ->get(),
                'stats' => [
                    'packages' => Package::query()->where('status', 'active')->count(),
                    'clients' => Client::query()->count(),
                    'transformations' => Transformation::query()->where('status', 'published')->count(),
                    'reviews' => Feedback::query()->where('status', 'approved')->count(),
                ],
            ],
        ]);
    }

    public function trainerProfile()
    {
        return response()->json([
            'data' => TrainerProfile::query()->first(),
        ]);
    }

    public function packages()
    {
        $trainerProfile = TrainerProfile::query()->first();

        return response()->json([
            'data' => $this->formattedPackages($trainerProfile?->whatsapp_number),
        ]);
    }

    public function transformations()
    {
        return response()->json([
            'data' => Transformation::query()
                ->with('client:id,name')
                ->where('status', 'published')
                ->orderByDesc('featured')
                ->latest()
                ->get(),
        ]);
    }

    public function feedback()
    {
        return response()->json([
            'data' => Feedback::query()
                ->where('status', 'approved')
                ->orderByDesc('is_featured')
                ->latest()
                ->get(),
        ]);
    }

    public function submitFeedback(Request $request)
    {
        $validated = $request->validate([
            'client_name' => ['required', 'string', 'max:120'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'message' => ['required', 'string', 'max:2000'],
            'photo' => ['nullable', 'image', 'max:4096'],
            'photo_url' => ['nullable', 'url'],
        ]);

        $validated['photo'] = $this->syncMedia($request, 'photo', 'photo_url', null, 'feedback');
        $validated['status'] = 'pending';
        $validated['is_featured'] = false;
        $validated['approved_at'] = null;

        $feedback = Feedback::query()->create($validated);

        return response()->json([
            'message' => 'Thank you for your feedback. It will appear after admin approval.',
            'data' => $feedback,
        ], 201);
    }

    public function submitContactMessage(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:30', 'required_without:email'],
            'email' => ['nullable', 'email', 'max:120', 'required_without:phone'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $contactMessage = ContactMessage::query()->create([
            ...$validated,
            'status' => 'new',
        ]);

        return response()->json([
            'message' => 'Your inquiry has been submitted successfully.',
            'data' => $contactMessage,
        ], 201);
    }

    private function formattedPackages(?string $whatsappNumber): array
    {
        return Package::query()
            ->where('status', 'active')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (Package $package): array => [
                ...$package->toArray(),
                'whatsapp_url' => $package->buildWhatsappUrl(
                    $whatsappNumber,
                    $package->whatsapp_message
                        ?: "Hello Coach, I am interested in your {$package->name} package. Please give me more details."
                ),
            ])
            ->all();
    }
}
