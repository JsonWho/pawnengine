<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class option_value extends Model
{
    public function option() {

    	return $this->belongsTo('App\option','option_id');
    }
}
