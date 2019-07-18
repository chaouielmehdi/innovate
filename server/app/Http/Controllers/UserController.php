<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Str;
use App\User;
use App\UpdateUser;
use Config;

class UserController extends Controller {
    /**
     * Create a new AuthController instance.
     * @return void
     */
    public function __construct() {
		//$this->middleware('assign.guard:users', ['except' => ['login', 'index', 'create', 'uploadLogo']]);
		// $this->middleware('auth')->except(
		// 	['login', 'logout', 'me', 'create', 'update', 'uploadLogo', 'exists', 'recover', 'asyncValidate']
		// );
    }








    /*
    |--------------------------------------------------------------------------
    | Create User methods
    |--------------------------------------------------------------------------
	*/

	/**
	 * upload a user's logo image
     * @return \Illuminate\Http\JsonResponse
	 */
    public function uploadLogo(Request $request){
		// validate the user's logo image
		$this->validate($request, [
			'user-logo' => 'image|mimes:png,jpg,jpeg,bmp|max:5120'
		]);
		
		// store the user's logo image in public/images/logos
		$logo = $request->file('user-logo');
		$newName = rand().'.'.$logo->getClientOriginalExtension();
		$logo->move(public_path('images/logos'), $newName);
		
		return response()->json(['status' => true, 'logoName' => $newName]);
	}
	
    /**
     * User Creation light validation Rule
	 * (backend only validation)
	 * (used to validate the form asynchronously)
     * @return @mixed
     */
    public function creationLightRules(){
        return [
            'email' => ['unique:users'],
            'username' => ['unique:users']
        ];
    }

	/**
	 * lightly validate a user form
	 * (backend only validation)
	 * (used to validate the form asynchronously)
     * @return \Illuminate\Http\JsonResponse
	 */
    public function asyncValidate(Request $request){
        $validation = $this->validateRequest($request->all(), $this->creationLightRules());
		if($validation != null){
            return response()->json(['status' => false, 'errors' => $validation->toArray()]);
		}
		return response()->json(['status' => true], 200);
	}

    /**
     * User Creation heavy validation Rule
	 * (to be sure before store in the DB)
     * @return @mixed
     */
    public function creationHeavyRules(){
        return [
            'email' => ['required', 'string', 'email', 'max:191', 'unique:users'],
            'password' => ['required', 'string', 'max:191', 'min:6', 'confirmed'],
            'logo' => ['nullable', 'string', 'max:191'],
            'username' => ['required', 'string', 'max:191', 'unique:users'],
            'canal' => ['required','string'],
            'address' => ['required', 'string', 'max:191'],
            'phone' => ['required', 'string', 'max:191'],
            'website' => ['nullable', 'string', 'max:191']
        ];
	}

    /*
     * Set User Code (used in create method)
     * @param String User canal
     * @return String User code
     */
    protected function setCode($canal){
        return  unique_random('users', 'code', 10, strtoupper(substr($canal,0,1)));
    }


	/**
	 * Create a user from a request
     * @return \Illuminate\Http\JsonResponse
	 */
    public function create(Request $request){
		// heavilyValidate the form
        $validation = $this->validateRequest($request->all(), $this->creationHeavyRules());
		if($validation != null){
            return response()->json(['status' => false, 'errors' => $validation->toArray()], 422);
		}
		
        // Create the user
        $user = new User();
		
        $user->email = request('email');
        $user->password = Hash::make(request('password'));
        $user->code = $this->setCode(request('canal'));
        $user->logo = request('logo');
        $user->username = request('username');
        $user->canal = request('canal');
        $user->address = request('address');
        $user->phone = request('phone');
		$user->website = request('website');
		
        if($user->save()){
			return response()->json($user);
		}

		// error in saving in DB
        return response()->json(['status' => false], 500); // internal error
	}






    /*
    |--------------------------------------------------------------------------
    | Login User methods
    |--------------------------------------------------------------------------
	*/

    /**
     * Get a JWT via given credentials.
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(){
        $credentials = request(['email', 'password']);
        
        if (! $token = auth('users')->attempt($credentials)) {
			return response()->json(['status' => false], 401);
        }
		
        return $this->respondWithToken($token);
	}






    /*
    |--------------------------------------------------------------------------
    | Logout User methods
    |--------------------------------------------------------------------------
	*/
	
    /**
     * Log the user out
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(){
		auth('users')->logout();
		
		return response()->json(['status' => true], 200);
    }

	





    /*
    |--------------------------------------------------------------------------
    | Recover User methods
    |--------------------------------------------------------------------------
	*/
	/**
	 * if exists to recover password
	 * (backend only validation)
	 * (used to validate the form asynchronously)
     * @return \Illuminate\Http\JsonResponse
	 */
    public function exists(Request $request){
		$emailExists = User::where('email' , request('email'))->first();
		
		// yes email exists
		if($emailExists != null){
            return response()->json(['status' => true], 200);
		}
		
		// no email doesn't exist
		return response()->json([
			'status' => false,
			'errors' =>
			[
				'email' => ["Aucun utilisateur n'a été trouvé avec cette adresse email."]
			]
		]);
	}

	/**
	 * Recover the user password
	 * (sending a mail)
     * @return \Illuminate\Http\JsonResponse
	 */
    public function recover(Request $request){
		$emailExists = User::where('email' , request('email'))->first();

		if($emailExists != null){
			// send email
			// 
			// 
			// 
			// 
			// 
			// 
			// 
			//
            return response()->json(['status' => true], 200);
		}

		return response()->json([
			'status' => false,
			'errors' => [
				'email' => ["Aucun utilisateur n'a été trouvé avec cette adresse email."]
				]
			], 404);
	}










    /*
    |--------------------------------------------------------------------------
    | Update User methods
    |--------------------------------------------------------------------------
	*/

    /**
     * User Update heavy validation Rule
	 * (to be sure before store in the DB)
     * @return @mixed
     */
    public function updateHeavyRules(){
        return [
            'password' => ['string', 'max:191', 'min:6', 'confirmed'],
            'logo' => ['string', 'max:191'],
            'canal' => ['string'],
            'address' => ['string', 'max:191'],
            'phone' => ['string', 'max:191'],
            'website' => ['string', 'max:191']
        ];
	}
    /**
     * Update an User.
	 * @param  Request
	 * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request){
		// email exists in 'update_users' table
		$userToUpdate = DB::table('update_users')->get()->first();
		
		// user exists in 'update_users' table
		// (user already update his account and admin didn't confirm yet)
        if($userToUpdate != null){
			return response()->json(['status' => false], 401);
		}
		
		// email exists in 'users' table
		$userToUpdate = User::where('email' , request('email'))->first();

		// user doesn't exist
        if($userToUpdate == null){
			return response()->json(['status' => false], 401);
		}
		// oldPassword doesn't match
		else if(!Hash::check(request('oldPassword'), $userToUpdate->password)){
			return response()->json(['status' => false], 401);
		}
		
		// heavilyValidate the form
        $validation = $this->validateRequest($request->all(), $this->updateHeavyRules());
		if($validation != null){
            return response()->json(['status' => false, 'errors' => $validation->toArray()], 422);
		}
		
		// Update the userToUpdate in 'Users' table
		// set status = 2 (user update his account and wait for admin confirmation)
		DB::table('users')
			->where('email', $userToUpdate->email)
			->update(['status' => 2]);
		
        // Create the userToUpdate in 'update_users' table
		$created = DB::table('update_users')->insert([
			'id' => $userToUpdate->id,						// the old one
			'email' => $userToUpdate->email,				// the old one
			'password' => Hash::make(request('password')),
			'code' => $userToUpdate->code,					// the old one
			'logo' => request('logo'),
			'username' => $userToUpdate->username,			// the old one
			'canal' => request('canal'),
			'address' => request('address'),
			'phone' => request('phone'),
			'website' => request('website')
		]);

        if($created){
			return response()->json($userToUpdate);
		}

		// error in saving in DB
		return response()->json(['status' => false], 500); // internal error
	}








    /*
    |--------------------------------------------------------------------------
    | Delete User methods
    |--------------------------------------------------------------------------
	*/
	
    /**
	 *  delete a user
     *  @return \Illuminate\Http\JsonResponse
	 */
    public function delete(User $user, Request $request){
        $userToDelete = $user::where('email' , request("email"))->first();
        if($userToDelete != null){
            $userToDelete->delete();
            return response()->json(["status" => true, "message" => "user_deleted"]);
        }
        else{
            return response()->json(["status" => false, "message" => "user_not_found"]);
        }
    }









    /*
    |--------------------------------------------------------------------------
    | Get User methods
    |--------------------------------------------------------------------------
	*/
    /**
     * Get the authenticated User.
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth('users')->user());
    }

    /**
     * Refresh a token.
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('users')->refresh());
    }

    /**
     * Get the token array structure.
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
			'expires_in' => auth('users')->factory()->getTTL() * 60,
			'email' => auth('users')->user()->email
        ]);
    }

    /*
     * Get all users
     * @return \Illuminate\Http\JsonResponse
     */ 
    public function allUsers(){ 
        return response()->json(
            User::all()
        );
    }

    /*
     * Get one user with email
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUser(Request $request){
        // Suppose that email is sent with request
        $user = $users::where('email', request('email'))->first();
        
        return response()->json(
            $user
        );
    }

}
