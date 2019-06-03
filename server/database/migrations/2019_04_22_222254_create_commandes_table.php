<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCommandesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code')->unique();
            $table->bigInteger('client_id')->unsigned();
            $table->integer('status')->default(0); // ['accepted_values' => [-2,-1,0,1,2] ]
            $table->integer('solde');
            $table->integer('quantity'); 
            $table->bigInteger('product_id')->unsigned();
            $table->timestamps();
        });

        Schema::table('commandes', function(Blueprint $table){
            $table->foreign('client_id')->references('id')->on('users');
            $table->foreign('product_id')->references('id')->on('products');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('commandes');
    }
}
