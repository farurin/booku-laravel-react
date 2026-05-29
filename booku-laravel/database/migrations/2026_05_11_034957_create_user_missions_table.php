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
        Schema::create('user_missions', function (Blueprint $table) {
            $table->integer('id_user');
            $table->integer('id_mission')->index('id_mission');
            $table->integer('progress')->nullable()->default(0);
            $table->boolean('is_claimed')->nullable()->default(false);

            $table->primary(['id_user', 'id_mission']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_missions');
    }
};
