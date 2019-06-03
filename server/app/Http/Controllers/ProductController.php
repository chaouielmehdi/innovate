<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use \App\Product;
use \App\Image as Images;
class ProductController extends Controller
{
    // Products are available to GET for everyone using the application 

    // Products with POST require Admin (or Commercial) authentication


    /* 
     * Create new Product
     * 
     * @param \Illuminate\Http\Request
     * 
     * @return \Illuminate\Http\Response
     * 
     */
    public function create(Product $products, Request $request){
    
        $validator = Validator::make($request->toArray(), [
            'name' => ['required', 'string', 'max:191'],
            'reference' => ['required', 'string', 'max:191', 'unique:products'],
            'category_id' => ['required','integer'],
            'in_stock' => ['required','integer'],
            'nb_articles' => ['required','integer'],
            'price' => ['required', 'regex:/^\d*(\.\d{2})?$/'],
            'images.*' => ['mimes:jpg,jpeg,png,svg'],
        ]);

        if($validator->fails()){
            return response()->json(["status" => false, $validator->messages()], 422);
        }

        // Insert Product
        $product = $products::create([
            'name' => request('name'),
            'reference' => request('reference'),
            'category_id' => request('category_id'),
            'in_stock' => request('in_stock'),
            'nb_articles' => request('nb_articles'),
            'price' => request('price')
        ]);

        // Get inserted Product is
        $productId = $product->id;

        // Product is validated => Handle Image
        // Image already validated :=> Move in to storage/public/images and insert in DB
        if($request->hasFile('images')){
            foreach($request->file('images') as $image){
                 // Image is uploaded => Move it and Insert into DB
                $name = $image->getClientOriginalName();
                if($image->storeAs('public/images/', $name)){
                    Images::create([
                        "url" => $name,
                        "product_id" => $productId
                    ]);
                }
            }
        }
        return response()->json(["status" => true, "message" => "Product inserted successfully"], 200);
    }


    /*
     * Get product with id
     * 
     * @param \Illuminate\Http\Request
     * 
     * @return \Illuminate\Http\Response
     * 
     */
    public function product(Product $products, Request $request){
        // Get a product from DB
        $product = $products->findOrFail($request->id)->first();
        return response()->json(["status" => true, $product],200);
    }

    /*
     * Get all Products
     * 
     * @param \Illuminate\Http\Request
     * 
     * @return \Illuminate\Http\Response
     * 
     */
    public function index(Product $products, Request $request){
        dd($products);
    }
}
