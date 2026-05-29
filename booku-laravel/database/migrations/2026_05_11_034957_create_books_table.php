<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('id_categories')->index('id_categories');
            $table->string('title_id');
            $table->string('title_en')->nullable();
            $table->text('description_id')->nullable();
            $table->text('description_en')->nullable();
            $table->string('image')->nullable();
            $table->string('bg_music_url')->nullable();
            $table->string('title_audio_id_url')->nullable();
            $table->string('title_audio_en_url')->nullable();
            $table->string('youtube_url_id')->nullable();
            $table->string('youtube_url_en')->nullable();
            $table->enum('status', ['review', 'terbit', 'ditolak', 'arsip', 'dihapus'])->nullable()->default('review');
            $table->integer('views_count')->nullable()->default(0);
            $table->timestamp('created_at')->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('books');
    }
};
