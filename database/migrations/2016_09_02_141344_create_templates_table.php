<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('templates', function(Blueprint $table) {

            $table->increments('id');
            $table->string('title');
            $table->string('keywords');
            $table->boolean('active');
            $table->timestamps();

            $table->integer('int_cat_id')->unsigned()->nullable();
            $table->foreign('int_cat_id')->references('id')->on('internal_categories');


            $table->integer('ext_cat_id')->unsigned()->nullable();
            $table->foreign('ext_cat_id')->references('id')->on('external_categories');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('templates');
    }
}
