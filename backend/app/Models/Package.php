<?php

namespace App\Models;

use App\Models\Concerns\ResolvesMediaUrls;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    /** @use HasFactory<\Database\Factories\PackageFactory> */
    use HasFactory, ResolvesMediaUrls;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'duration',
        'sessions',
        'price',
        'features',
        'benefits',
        'suitable_for',
        'training_type',
        'whatsapp_message',
        'image',
        'status',
        'sort_order',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'image_url',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'features' => 'array',
            'benefits' => 'array',
        ];
    }

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class, 'selected_package_id');
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->resolveMediaUrl($this->image);
    }
}
