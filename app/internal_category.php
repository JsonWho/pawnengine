<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class internal_category extends Model
{
    
	public function option_sections() {

	    return $this->hasMany('App\option_section','int_cat_id');
	}


	public function parent_category() {

	    return $this->hasOne('App\internal_category','parent_id');
	}


	public function templates() {

		return $this->hasMany('App\template');
	}

}
