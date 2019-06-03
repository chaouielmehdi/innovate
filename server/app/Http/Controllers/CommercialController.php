<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Str;
use App\Commercial;
use Config;

class CommercialController extends Controller
{

    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('assign.guard:commercials', ['except' => ['login', 'index']]);
    }

	/**
	 *  Create a Commercial
     * 
     *  @return \Illuminate\Http\JsonResponse
	 */
    public function create(Commercial $commercials, Request $request)
    {
        
        // Validation
        $validator = Validator::make(request()->toArray(), [
            'username' => ['required', 'string', 'max:191'],
            'first_name' => ['required', 'string', 'max:191'],
            'last_name' => ['required', 'string', 'max:191'],
            'telephone' => ['required', 'string', 'max:191'],
            'address' => ['string', 'max:191'],
            'type' => ['string', 'max:191'],
            // Code is first letter of TYPE concatenated with a random string
            'email' => ['required', 'string', 'email', 'max:191', 'unique:commercials'],
            'password' => ['required', 'string']
        ]);
        if($validator->fails()){
            return response()->json([
                "status" => false,
                "messages" => $validator->messages()
            ]);
        }
        /*
		$this->validate(request(), [
            'Commercialname' => ['required', 'string', 'max:191'],
            'first_name' => ['required', 'string', 'max:191'],
            'last_name' => ['required', 'string', 'max:191'],
            'telephone' => ['required', 'string', 'max:191'],
            'address' => ['string', 'max:191'],
            'type' => ['string', 'max:191'],
            // Code is first letter of TYPE concatenated with a random string
            'email' => ['required', 'string', 'email', 'max:191', 'unique:commercials'],
            'password' => ['required', 'string']
        ]);
        */
		// Create the Commercial
        $newCommercial = $commercials->firstOrCreate(
            [
                'email' => request('email')
            ],    
            [
                'first_name' => request('first_name'),
                'last_name' => request('last_name'),
                'username' => request('username'),
                'address' => request('address'),
                'telephone' => request('telephone'),
                'type' => request('type'),
                'code' =>  $this->setCode(request('type')),  // First letter of type concatenated with a random 10char string         
                'email' => request('email'),
                'password' => Hash::make(request('password')),
                'remember_token' => Str::random(10),
            ]);

        // Commercial was created 
        return response()->json(["status" => true]);
	}
    
    
    /**
	 *  Create an commercial
     * 
     *  @return \Illuminate\Http\JsonResponse
	 */
    public function delete(Commercial $commercial, Request $request){
        $commercialToDelete = $commercial::where('email' , request("email"))->first();
        if($commercialToDelete != null){
            $commercialToDelete->delete();
            return response()->json(["status" => true, "message" => "commercial_deleted"]);
        }
        else{
            return response()->json(["status" => false, "message" => "commercial_not_found"]);
        }
    }


    /**
     * Update an Commercial.
     *
     * @param  Request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Commercial $commercials, Request $reqest){
        $commercialToUpdate = $commercials::where('email' , request("email"))->first();
        if($commercialToUpdate == null){
            return response()->json(["status" => false, "message" => "commercial_not_found"]);
        }
        // Validate input
        $this->validate(request(), [
            'first_name' => ['required', 'string', 'max:191'],
            'last_name' => ['required', 'string', 'max:191'],
            'Commercialname' => ['required', 'string', 'max:191','unique:commercials'],
            'telephone' => ['required', 'string', 'max:191'],
            'address' => ['string', 'max:191'],
            'is_super_commercial' => ['required','boolean'],
            // Code is first letter of TYPE concatenated with a random string
            'email' => ['required', 'string', 'email', 'max:191'], // Suppose that email is unchangeable
            'password' => ['required', 'string']
        ]);
        
        // Set new values
        $commercialToUpdate -> first_name = request("first_name");
        $commercialToUpdate -> last_name = request("last_name");
        $commercialToUpdate -> Commercialname = request("Commercialname");
        $commercialToUpdate -> telephone = request("telephone");
        $commercialToUpdate -> address = request("address");
        $commercialToUpdate -> is_super_commercial = request("is_super_commercial");
        $commercialToUpdate -> code = unique_random('commercials', 'code', 10, $this->setType(request("is_super_commercial")));
        //$commercialToUpdate -> email = request("email");
        $commercialToUpdate -> password = Hash::make(request('password'));

        // Save
        $commercialToUpdate->save();

        // Respond
        return response()->json(["status" => true, "message" => "commercial_updated"]);

    }
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {

        $credentials = request(['email', 'password']);
        
        if (! $token = auth('commercials')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated Commercial.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth('commercials')->Commercial());
    }

    /**
     * Log the Commercial out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('commercials')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('commercials')->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
			'expires_in' => auth('commercials')->factory()->getTTL() * 60,
			'email' => auth('commercials')->Commercial()->email
        ]);
    }

    /*
     * Get all commercials
     *  
     * @return \Illuminate\Http\JsonResponse
     * 
     */ 
    public function index(){
        $allCommercials = Commercial::all();
        return response()->json(
            $allCommercials
        );
    }


    /*
     * Get one commercial with email
     *  
     * @return \Illuminate\Http\JsonResponse
     * 
     */ 
    public function commercial(Commercial $commercials, Request $request){
        // Suppose that email is sent with request
        $commercial = $commercials::where('email' , request("email"))->first();
        
        return response()->json(
            $commercial
        );
    }


    /*
     * Set Commercial Code 
     * 
     * @param String Commercial type
     * 
     * @return String Commercial code
     */
    protected function setCode($type){
        return  unique_random('commercials', 'code', 10, strtoupper(substr($type,0,1)));
    }
    
}
