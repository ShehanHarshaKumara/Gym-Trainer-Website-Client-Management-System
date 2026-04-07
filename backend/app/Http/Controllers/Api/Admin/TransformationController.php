<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesMediaUploads;
use App\Http\Controllers\Controller;
use App\Models\Transformation;
use Illuminate\Http\Request;

class TransformationController extends Controller
{
    use HandlesMediaUploads;

    public function index()
    {
        return response()->json([
            'data' => Transformation::query()
                ->with('client:id,name')
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->storeRules());
        $validated['before_image'] = $this->syncMedia($request, 'before_image', 'before_image_url', null, 'transformations');
        $validated['after_image'] = $this->syncMedia($request, 'after_image', 'after_image_url', null, 'transformations');
        $validated['featured'] = (bool) ($validated['featured'] ?? false);

        $transformation = Transformation::query()->create($validated);

        return response()->json([
            'message' => 'Transformation created successfully.',
            'data' => $transformation->load('client:id,name'),
        ], 201);
    }

    public function show(Transformation $transformation)
    {
        return response()->json([
            'data' => $transformation->load('client:id,name'),
        ]);
    }

    public function update(Request $request, Transformation $transformation)
    {
        $validated = $request->validate($this->updateRules());
        $validated['before_image'] = $this->syncMedia(
            $request,
            'before_image',
            'before_image_url',
            $transformation->before_image,
            'transformations'
        );
        $validated['after_image'] = $this->syncMedia(
            $request,
            'after_image',
            'after_image_url',
            $transformation->after_image,
            'transformations'
        );
        $validated['featured'] = (bool) ($validated['featured'] ?? false);

        $transformation->update($validated);

        return response()->json([
            'message' => 'Transformation updated successfully.',
            'data' => $transformation->fresh()->load('client:id,name'),
        ]);
    }

    public function destroy(Transformation $transformation)
    {
        $this->deleteStoredMedia($transformation->before_image);
        $this->deleteStoredMedia($transformation->after_image);
        $transformation->delete();

        return response()->json([
            'message' => 'Transformation deleted successfully.',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function storeRules(): array
    {
        return [
            'client_id' => ['nullable', 'exists:clients,id'],
            'title' => ['required', 'string', 'max:140'],
            'before_image' => ['required_without:before_image_url', 'nullable', 'image', 'max:4096'],
            'before_image_url' => ['required_without:before_image', 'nullable', 'url'],
            'after_image' => ['required_without:after_image_url', 'nullable', 'image', 'max:4096'],
            'after_image_url' => ['required_without:after_image', 'nullable', 'url'],
            'duration' => ['required', 'string', 'max:80'],
            'weight_change' => ['nullable', 'string', 'max:80'],
            'goals_achieved' => ['nullable', 'string', 'max:255'],
            'result_description' => ['required', 'string'],
            'success_story' => ['nullable', 'string'],
            'status' => ['required', 'in:published,draft'],
            'featured' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function updateRules(): array
    {
        return [
            'client_id' => ['nullable', 'exists:clients,id'],
            'title' => ['required', 'string', 'max:140'],
            'before_image' => ['nullable', 'image', 'max:4096'],
            'before_image_url' => ['nullable', 'url'],
            'after_image' => ['nullable', 'image', 'max:4096'],
            'after_image_url' => ['nullable', 'url'],
            'duration' => ['required', 'string', 'max:80'],
            'weight_change' => ['nullable', 'string', 'max:80'],
            'goals_achieved' => ['nullable', 'string', 'max:255'],
            'result_description' => ['required', 'string'],
            'success_story' => ['nullable', 'string'],
            'status' => ['required', 'in:published,draft'],
            'featured' => ['nullable', 'boolean'],
        ];
    }
}
