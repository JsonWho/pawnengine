<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class container extends Model
{

	public function parent_container() {

    	return $this->hasOne('App\container','pcont_id');
    }


    public function child_containers() {

    	return $this->hasMany('App\container','pcont_id');
    }

    public function options() {

    	return $this->hasMany('App\option','container_id');
    }


        public function option_section() {

    	return $this->belongsTo('App\option_section','optsect_id');
    }

}
