<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFormsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::create('forms', function(Blueprint $table) {

            $table->increments('id');
            $table->string('note');
            $table->timestamps();


            $table->integer('customer_id')->unsigned();
            $table->foreign('customer_id')->references('id')->on('customer_profiles');


            $table->integer('template_id')->unsigned();
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
        Shema::drop('form');
    }
}
