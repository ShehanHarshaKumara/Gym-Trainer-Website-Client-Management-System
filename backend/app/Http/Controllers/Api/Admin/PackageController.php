<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesMediaUploads;
use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PackageController extends Controller
{
    use HandlesMediaUploads;

    public function index()
    {
        return response()->json([
            'data' => Package::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $payload = $request->all();
        $payload['slug'] = Str::slug($payload['slug'] ?? $payload['name'] ?? '');

        $validated = validator(
            array_merge($payload, $request->hasFile('image') ? ['image' => $request->file('image')] : []),
            $this->rules()
        )->validate();

        $validated['image'] = $this->syncMedia($request, 'image', 'image_url', null, 'packages');

        $package = Package::query()->create($validated);

        return response()->json([
            'message' => 'Package created successfully.',
            'data' => $package,
        ], 201);
    }

    public function show(Package $package)
    {
        return response()->json([
            'data' => $package,
        ]);
    }

    public function update(Request $request, Package $package)
    {
        $payload = $request->all();
        $payload['slug'] = Str::slug($payload['slug'] ?? $payload['name'] ?? $package->name);

        $validated = validator(
            array_merge($payload, $request->hasFile('image') ? ['image' => $request->file('image')] : []),
            $this->rules($package)
        )->validate();

        $validated['image'] = $this->syncMedia($request, 'image', 'image_url', $package->image, 'packages');

        $package->update($validated);

        return response()->json([
            'message' => 'Package updated successfully.',
            'data' => $package->fresh(),
        ]);
    }

    public function destroy(Package $package)
    {
        $this->deleteStoredMedia($package->image);
        $package->delete();

        return response()->json([
            'message' => 'Package deleted successfully.',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function rules(?Package $package = null): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['required', 'string', 'max:140', Rule::unique('packages', 'slug')->ignore($package?->id)],
            'description' => ['required', 'string'],
            'duration' => ['required', 'string', 'max:80'],
            'sessions' => ['nullable', 'integer', 'min:1'],
            'price' => ['required', 'numeric', 'min:0'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'benefits' => ['nullable', 'array'],
            'benefits.*' => ['string', 'max:255'],
            'suitable_for' => ['nullable', 'string', 'max:255'],
            'training_type' => ['nullable', 'string', 'max:100'],
            'whatsapp_message' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'url'],
            'status' => ['required', 'in:active,inactive'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
