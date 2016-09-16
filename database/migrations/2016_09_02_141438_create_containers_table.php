<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateContainersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('containers', function(Blueprint $table) {

            $table->increments('id');
            $table->integer('position')->nullable();
            $table->string('title');
            $table->string('type');
            $table->string('groupname');
            $table->boolean('active');
            $table->string('prompt')->nullable();
            $table->string('imageurl')->nullable();

            
            $table->string('toggle_type');
            $table->string('trigger_id');
            $table->string('expected_value');


            $table->integer('optsect_id')->unsigned()->nullable();
            $table->foreign('optsect_id')->references('id')->on('option_sections');

            $table->integer('pcont_id')->unsigned()->nullable();
            $table->foreign('pcont_id')->references('id')->on('containers');


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Shema::drop('groups');
    }
}
