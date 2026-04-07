<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'age',
        'gender',
        'phone',
        'email',
        'goal',
        'selected_package_id',
        'joined_date',
        'notes',
        'progress_notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'joined_date' => 'date',
        ];
    }

    public function selectedPackage(): BelongsTo
    {
        return $this->belongsTo(Package::class, 'selected_package_id');
    }

    public function transformations(): HasMany
    {
        return $this->hasMany(Transformation::class);
    }
}
