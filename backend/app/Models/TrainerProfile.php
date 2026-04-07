<?php

namespace App\Models;

use App\Models\Concerns\ResolvesMediaUrls;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainerProfile extends Model
{
    /** @use HasFactory<\Database\Factories\TrainerProfileFactory> */
    use HasFactory, ResolvesMediaUrls;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'full_name',
        'title',
        'headline',
        'bio',
        'experience',
        'mission',
        'certifications',
        'skills',
        'phone',
        'whatsapp_number',
        'email',
        'address',
        'social_links',
        'map_embed_url',
        'profile_image',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'profile_image_url',
        'whatsapp_url',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'certifications' => 'array',
            'skills' => 'array',
            'social_links' => 'array',
        ];
    }

    public function getProfileImageUrlAttribute(): ?string
    {
        return $this->resolveMediaUrl($this->profile_image);
    }

    public function getWhatsappUrlAttribute(): ?string
    {
        return $this->buildWhatsappUrl(
            $this->whatsapp_number,
            'Hello Coach, I would like to know more about your training programs.'
        );
    }
}
