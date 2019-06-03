<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        "name", "reference", "category_id", "in_stock", "nb_articles", "price"
    ];
    

    /**
     * 
     * Verify that a certain product exists
     * 
     * @param $id product
     */
    public function exists($id){
        $product = Product::find($id);
        if($product == null)
            return false;
        return true;
    }
}
