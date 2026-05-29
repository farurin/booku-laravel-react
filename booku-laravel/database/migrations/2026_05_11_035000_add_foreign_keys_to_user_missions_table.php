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
        Schema::table('user_missions', function (Blueprint $table) {
            $table->foreign(['id_user'], 'user_missions_ibfk_1')->references(['id'])->on('users')->onUpdate('NO ACTION')->onDelete('CASCADE');
            $table->foreign(['id_mission'], 'user_missions_ibfk_2')->references(['id'])->on('missions')->onUpdate('NO ACTION')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_missions', function (Blueprint $table) {
            $table->dropForeign('user_missions_ibfk_1');
            $table->dropForeign('user_missions_ibfk_2');
        });
    }
};
