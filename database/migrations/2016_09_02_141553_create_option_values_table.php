<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOptionValuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('option_values', function(Blueprint $table) {

            $table->increments('id')->unsigned();
            $table->integer('price_diff');
            $table->string('value');
            $table->string('text')->nullable();
            $table->string('prompt')->nullable();
            $table->string('imageurl')->nullable();
            $table->integer('position')->nullable();
            $table->boolean('active');

            $table->integer('option_id')->unsigned()->nullable();
            $table->foreign('option_id')->references('id')->on('options');


            // $table->integer('int_cat_id')->unsigned()->nullable();
            // $table->foreign('int_cat_id')->references('id')->on('internal_categories');

        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('option_values');
    }
}
