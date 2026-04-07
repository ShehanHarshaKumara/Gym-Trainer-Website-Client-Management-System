<?php

namespace App\Models;

use App\Models\Concerns\ResolvesMediaUrls;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    /** @use HasFactory<\Database\Factories\FeedbackFactory> */
    use HasFactory, ResolvesMediaUrls;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'client_name',
        'rating',
        'message',
        'photo',
        'status',
        'is_featured',
        'approved_at',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'photo_url',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'approved_at' => 'datetime',
        ];
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->resolveMediaUrl($this->photo);
    }
}
