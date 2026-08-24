<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('tab_id')->constrained('tabs')->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->text('body')->nullable();
            $table->string('kind')->default('regular');
            $table->timestamps();

            $table->index(['tab_id', 'kind', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
