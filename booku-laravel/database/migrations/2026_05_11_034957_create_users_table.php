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
        Schema::create('users', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('username', 50);
            $table->string('first_name', 100)->nullable();
            $table->string('last_name', 100)->nullable();
            $table->string('phone_number', 20)->nullable();
            $table->enum('gender', ['Laki-laki', 'Perempuan'])->nullable();
            $table->string('email', 100)->unique('email');
            $table->enum('role', ['user', 'editor', 'admin', 'super_admin'])->nullable()->default('user');
            $table->enum('status', ['active', 'inactive', 'suspended'])->nullable()->default('active');
            $table->integer('age')->nullable()->default(0);
            $table->string('avatar_url')->nullable()->default('/images/avatars/cat-avatar.png');
            $table->string('password');
            $table->integer('active_character_id')->nullable()->default(1);
            $table->integer('current_streak')->nullable()->default(0);
            $table->integer('total_points')->nullable()->default(0);
            $table->integer('total_pages')->nullable()->default(0);
            $table->integer('current_rank')->nullable()->default(0);
            $table->date('last_active_date')->nullable();
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
        Schema::dropIfExists('users');
    }
};
