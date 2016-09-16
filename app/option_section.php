<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class option_section extends Model
{

    public function internal_category() {

    	return $this->hasOne('App\internal_category','int_cat_id');
    }

    public function containers() {

    	return $this->hasMany('App\container','optsect_id');
    }

    // public function child_sections() {

    // 	return $this->hasMany('App\option_section');
    // }


}
