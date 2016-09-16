<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOptionSectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('option_sections', function(Blueprint $table) {

            $table->increments('id');
            $table->integer('position');
            $table->string('title');
            $table->string('description');
            $table->boolean('active');

            $table->integer('psect_id')->unsigned()->nullable();
            $table->foreign('psect_id')->references('id')->on('option_sections');


            $table->integer('int_cat_id')->unsigned()->nullable();
            $table->foreign('int_cat_id')->references('id')->on('internal_categories');

            $table->integer('template_id')->unsigned()->nullable();
            $table->foreign('template_id')->references('id')->on('templates');


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::drop('option_categories');
    }
}
