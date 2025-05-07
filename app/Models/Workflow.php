<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Workflow extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'status',
        'trigger_id',
    ];

    /**
     * Get the trigger that owns the Workflow.
     */
    public function trigger(): BelongsTo
    {
        return $this->belongsTo(Trigger::class);
    }
}