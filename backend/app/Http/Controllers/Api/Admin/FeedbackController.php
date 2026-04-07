<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesMediaUploads;
use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    use HandlesMediaUploads;

    public function index()
    {
        return response()->json([
            'data' => Feedback::query()->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $validated['photo'] = $this->syncMedia($request, 'photo', 'photo_url', null, 'feedback');
        $validated['is_featured'] = (bool) ($validated['is_featured'] ?? false);
        $validated['approved_at'] = $this->approvedAtForStatus($validated['status']);

        $feedback = Feedback::query()->create($validated);

        return response()->json([
            'message' => 'Feedback created successfully.',
            'data' => $feedback,
        ], 201);
    }

    public function show(Feedback $feedback)
    {
        return response()->json([
            'data' => $feedback,
        ]);
    }

    public function update(Request $request, Feedback $feedback)
    {
        $validated = $request->validate($this->rules());
        $validated['photo'] = $this->syncMedia($request, 'photo', 'photo_url', $feedback->photo, 'feedback');
        $validated['is_featured'] = (bool) ($validated['is_featured'] ?? false);
        $validated['approved_at'] = $this->approvedAtForStatus($validated['status'], $feedback);

        $feedback->update($validated);

        return response()->json([
            'message' => 'Feedback updated successfully.',
            'data' => $feedback->fresh(),
        ]);
    }

    public function destroy(Feedback $feedback)
    {
        $this->deleteStoredMedia($feedback->photo);
        $feedback->delete();

        return response()->json([
            'message' => 'Feedback deleted successfully.',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function rules(): array
    {
        return [
            'client_name' => ['required', 'string', 'max:120'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'message' => ['required', 'string', 'max:2000'],
            'photo' => ['nullable', 'image', 'max:4096'],
            'photo_url' => ['nullable', 'url'],
            'status' => ['required', 'in:pending,approved,rejected'],
            'is_featured' => ['nullable', 'boolean'],
        ];
    }

    private function approvedAtForStatus(string $status, ?Feedback $feedback = null): mixed
    {
        if ($status !== 'approved') {
            return null;
        }

        return $feedback?->approved_at ?? now();
    }
}
