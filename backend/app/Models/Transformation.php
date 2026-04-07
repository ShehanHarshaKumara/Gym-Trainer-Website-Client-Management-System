<?php

namespace App\Models;

use App\Models\Concerns\ResolvesMediaUrls;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transformation extends Model
{
    /** @use HasFactory<\Database\Factories\TransformationFactory> */
    use HasFactory, ResolvesMediaUrls;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'client_id',
        'title',
        'before_image',
        'after_image',
        'duration',
        'weight_change',
        'goals_achieved',
        'result_description',
        'success_story',
        'status',
        'featured',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'before_image_url',
        'after_image_url',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'featured' => 'boolean',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function getBeforeImageUrlAttribute(): ?string
    {
        return $this->resolveMediaUrl($this->before_image);
    }

    public function getAfterImageUrlAttribute(): ?string
    {
        return $this->resolveMediaUrl($this->after_image);
    }
}
