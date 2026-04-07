<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Client::query()
                ->with('selectedPackage:id,name,price')
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());

        $client = Client::query()->create($validated);

        return response()->json([
            'message' => 'Client created successfully.',
            'data' => $client->load('selectedPackage:id,name,price'),
        ], 201);
    }

    public function show(Client $client)
    {
        return response()->json([
            'data' => $client->load('selectedPackage:id,name,price'),
        ]);
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate($this->rules());

        $client->update($validated);

        return response()->json([
            'message' => 'Client updated successfully.',
            'data' => $client->fresh()->load('selectedPackage:id,name,price'),
        ]);
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return response()->json([
            'message' => 'Client deleted successfully.',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'age' => ['nullable', 'integer', 'min:10', 'max:100'],
            'gender' => ['nullable', 'string', 'max:20'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:120'],
            'goal' => ['required', 'string', 'max:255'],
            'selected_package_id' => ['nullable', 'exists:packages,id'],
            'joined_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
            'progress_notes' => ['nullable', 'string'],
        ];
    }
}
