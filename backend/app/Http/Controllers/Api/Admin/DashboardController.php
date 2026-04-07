<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\ContactMessage;
use App\Models\Feedback;
use App\Models\Package;
use App\Models\Transformation;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'data' => [
                'stats' => [
                    'packages' => Package::query()->count(),
                    'clients' => Client::query()->count(),
                    'inquiries' => ContactMessage::query()->count(),
                    'reviews' => Feedback::query()->count(),
                    'pending_feedback' => Feedback::query()->where('status', 'pending')->count(),
                    'transformations' => Transformation::query()->count(),
                ],
                'recent_feedback' => Feedback::query()->latest()->take(5)->get(),
                'recent_messages' => ContactMessage::query()->latest()->take(5)->get(),
                'recent_clients' => Client::query()
                    ->with('selectedPackage:id,name,price')
                    ->latest()
                    ->take(5)
                    ->get(),
            ],
        ]);
    }
}
