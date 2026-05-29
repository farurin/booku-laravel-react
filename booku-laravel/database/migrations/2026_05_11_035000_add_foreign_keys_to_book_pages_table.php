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
        Schema::table('book_pages', function (Blueprint $table) {
            $table->foreign(['id_book'], 'book_pages_ibfk_1')->references(['id'])->on('books')->onUpdate('NO ACTION')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('book_pages', function (Blueprint $table) {
            $table->dropForeign('book_pages_ibfk_1');
        });
    }
};
