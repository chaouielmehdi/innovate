<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Commande;
use Illuminate\Support\Facades\Validator;

class CommandeController extends Controller
{
    public function __construct(){

    }

    /**
     * Create new Commande from Request
     * 
     * @param Request
     * 
     * @return JSONResponse
     */
    public function create(Request $request){
        // Validate Input 
        ///dd($request->products);
        $rules = [
                'client_id' => ['required', 'integer', 'exists:users,id'],
                'status' => ['integer'],
                'products.*.product_id' => ['required', 'integer', 'exists:products,id'],
                'products.*.solde' => ['required', 'integer'],
                'products.*.quantity' => ['required', 'integer']
                 ];
        
        $validator = Validator::make(request()->all(), $rules);
        if($validator->fails())
            return response()->json(["status" =>false, $validator->messages()->toArray()], 422);
        
        $commande = new Commande;
        $commande->code =  unique_random('commandes', 'code', 16,"Commande");
        $commande->status = request('status');
        $saved = true;
        foreach(request('products') as $p){
            $commande->solde = $p->solde;
            $commande->product_id = $p->product_id;
            $commande->quantity = $p->quantity;
            if(! $commande->save())
                $saved = false;
        }
        if($saved)
            return response()->json(["status" => true,  "message" => "Commande created successfully"], 200);
        return response()->json(["status" =>false, "message" => "There was an error, please try again"], 500);
    }


}
