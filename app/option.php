<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class option extends Model
{
    public function parent_container() {

    	return $this->belongsTo('App\container','container_id');
    }

        public function option_values() {

    	return $this->hasMany('App\option_value','option_id');
    }
}
