<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('options', function(Blueprint $table) {

            $table->increments('id');
            $table->integer('position')->nullable();
            $table->string('title');
            $table->string('placeholder')->nullable();
            $table->string('type');

            $table->string('toggle_type');
            $table->string('trigger_id');
            $table->string('expected_value');



            $table->string('regex')->nullable();
            $table->string('groupname')->nullable();
            $table->boolean('active');
            $table->boolean('hide_children');
            $table->string('prompt')->nullable();
            $table->string('imageurl')->nullable();

            //option values
            // $table->boolean('isBoolean')->nullable();
            // $table->string('values')->nullable();




            $table->integer('container_id')->unsigned()->nullable();
            $table->foreign('container_id')->references('id')->on('containers');



            $table->integer('optsect_id')->unsigned()->nullable();
            $table->foreign('optsect_id')->references('id')->on('option_sections');


            $table->integer('parent_option_id')->unsigned()->nullable();
            $table->foreign('parent_option_id')->references('id')->on('options');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('options');
    }
}
