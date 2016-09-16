<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInputDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inputdata', function(Blueprint $table) {

            $table->increments('id');
            $table->string('input');
            $table->timestamps();


            $table->integer('form_id')->unsigned();
            $table->foreign('form_id')->references('id')->on('forms');


            $table->integer('option_id')->unsigned();
            $table->foreign('option_id')->references('id')->on('options');

            $table->integer('option_value_id')->unsigned()->nullable();
            $table->foreign('option_value_id')->references('id')->on('option_values');


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
