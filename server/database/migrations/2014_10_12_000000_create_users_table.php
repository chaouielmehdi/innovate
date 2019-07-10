<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->string('email')->unique();
            $table->string('password');
            $table->string('code');
            $table->string('username');
            $table->string('logo')->nullable();
            $table->string('canal');
            $table->string('address');
            $table->string('phone');
            $table->string('website')->nullable();
            $table->integer('status')->default(0); // 0: Account created, 1: Account validated by admin, 2: Account updated waiting for admin approval
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
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
}
