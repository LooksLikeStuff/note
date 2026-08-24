<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tabs', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->unsignedInteger('position')->default(0);
            $table->timestamp('last_note_at')->nullable();
            $table->timestamps();

            $table->index(['last_note_at', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tabs');
    }
};
