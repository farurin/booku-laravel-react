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
        Schema::create('categories', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('name_id', 100);
            $table->string('name_en', 100)->nullable();
            $table->text('description_id')->nullable();
            $table->text('description_en')->nullable();
            $table->enum('status', ['active', 'inactive'])->nullable()->default('active');
            $table->string('image_icon')->nullable();
            $table->string('image_banner')->nullable();
            $table->string('image_card')->nullable();
            $table->string('color_hex', 10)->nullable()->default('#6B4EFF');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categories');
    }
};
