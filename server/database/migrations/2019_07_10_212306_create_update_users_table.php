<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUpdateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('update_users', function (Blueprint $table) {
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
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
        Schema::table('update_users', function(Blueprint $table){
            $table->foreign('id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('update_users');
    }
}
