<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class template extends Model
{
    public function internal_category() {

    	return $this->belongsTo('App\internal_category','int_cat_id');
    }
}
