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
        Schema::create('book_pages', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('id_book')->index('id_book');
            $table->integer('page_number');
            $table->string('image');
            $table->string('dubbing_id_url')->nullable();
            $table->string('dubbing_en_url')->nullable();
            $table->text('text_id');
            $table->text('text_en');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('book_pages');
    }
};
