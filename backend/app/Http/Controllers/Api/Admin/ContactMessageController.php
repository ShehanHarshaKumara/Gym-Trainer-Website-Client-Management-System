<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => ContactMessage::query()->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());

        $contactMessage = ContactMessage::query()->create($validated);

        return response()->json([
            'message' => 'Message created successfully.',
            'data' => $contactMessage,
        ], 201);
    }

    public function show(ContactMessage $contactMessage)
    {
        return response()->json([
            'data' => $contactMessage,
        ]);
    }

    public function update(Request $request, ContactMessage $contactMessage)
    {
        $validated = $request->validate($this->rules());

        $contactMessage->update($validated);

        return response()->json([
            'message' => 'Message updated successfully.',
            'data' => $contactMessage->fresh(),
        ]);
    }

    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return response()->json([
            'message' => 'Message deleted successfully.',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:120'],
            'message' => ['required', 'string', 'max:2000'],
            'status' => ['required', 'in:new,read,archived'],
        ];
    }
}
