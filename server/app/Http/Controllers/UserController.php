<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
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
       $this->middleware('assign.guard:users', ['except' => ['login', 'index', 'create', 'uploadLogo']]);
    }

    /**
     * User Creation light validation Rule
	 * (backend only validation)
	 * (used to validate th form asynchronously)
     * @return @mixed
     */
    public function lightRules(){
        return [
            'email' => ['unique:users'],
            'username' => ['unique:users']
        ];
    }

	/**
	 * lightly validate a user form
	 * (backend only validation)
	 * (used to validate th form asynchronously)
     * @return \Illuminate\Http\JsonResponse
	 */
    public function lightlyValidate(Request $request){
        $validation = $this->validateRequest($request->all(), $this->lightRules());
		if($validation != null){
            return response()->json(['status' => false, 'errors' => $validation->toArray()], 401);
		}
		return response()->json(['status' => true], 200);
	}

    /**
     * User Creation heavy validation Rule
	 * (to be sure before store in the DB)
     * @return @mixed
     */
    public function heavyRules(){
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

	/**
	 * Create a user from a request
     * @return \Illuminate\Http\JsonResponse
	 */
    public function create(Request $request){
		// heavilyValidate the form
        $validation = $this->validateRequest($request->all(), $this->heavyRules());
		if($validation != null){
            return response()->json(['status' => false], 422); // Unprocessable Entity
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
	
    /**
     * Log the user out (Invalidate the token).
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(){
		auth('users')->logout();
		
		return response()->json(['status' => true], 200);
    }

	/**
	 * upload a user's logo image
     * @return \Illuminate\Http\JsonResponse
	 */
    public function uploadLogo(Request $request){
		// validate the user's logo image
		$this->validate($request, [
			'user-logo' => 'required|image|mimes:png,jpg,jpeg,bmp|max:5120'
		]);
		
		// store the user's logo image
		$logo = $request->file('user-logo');
		$newName = rand().'.'.$logo->getClientOriginalExtension();
		$logo->move(public_path('images/logos'), $newName);
		
		return response()->json(['logoName' => $newName]);
	}
	
	
	/**
	 * if userEmailExists to recover password
	 * (backend only validation)
	 * (used to validate th form asynchronously)
     * @return \Illuminate\Http\JsonResponse
	 */
    public function userEmailExists(Request $request){
		$emailExists = User::where('email' , request('email'))->first();
		
		if($emailExists != null){
            return response()->json(['status' => true], 200);
		}

		return response()->json([
			'status' => false,
			'errors' => [
				'email' => ["Aucun utilisateur n'a été trouvé avec cette adresse email."]
				]
			], 404);
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








    /**
     * Update an User.
	 * @param  Request
	 * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request){
		$userToUpdate = User::
			where('email', request('email'))
			->where('password', Hash::make(request('oldPassword')))
			->first();

        if($userToUpdate != null){
            return response()->json(['status' => false], 407);
		}
		return response()->json(['status' => false], 409);
		
		// heavilyValidate the form
        $validation = $this->validateRequest($request->all(), $this->heavyRules());
		if($validation != null){
            return response()->json(['status' => false, $validator->messages()->toArray()], 422); // Unprocessable Entity
		}

        // Now user has to wait for the modifications to be validated by Admin
        $userToUpdate->status = 2;

        if(UpdateUser::create($request, $userToUpdate) && $userToUpdate->save()){
            return response()->json(['status' => true], 201);
        }
		return response()->json(['status' => false], 500);
    
	}

	
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
    public function index(){ 
        return response()->json(
            User::all()
        );
    }


    /*
     * Get one user with email
     * @return \Illuminate\Http\JsonResponse
     */ 
    public function user(User $users, Request $request){
        // Suppose that email is sent with request
        $user = $users::where('email' , request("email"))->first();
        
        return response()->json(
            $user
        );
    }


    /*
     * Set User Code 
     * @param String User canal
     * @return String User code
     */
    protected function setCode($canal){
        return  unique_random('users', 'code', 10, strtoupper(substr($canal,0,1)));
    }

    /**
     * User Update validation Rule
     * @return @mixed
     */
    public function updateRule(){
        return [
            'oldPassword' => ['string', 'max:191', 'min:6'],
            'password' => ['string', 'max:191', 'min:6', 'confirmed'],
            'logo' => ['string', 'max:191'],
            'username' => ['string', 'max:191','unique:users'],
            'canal' => ['string'],
            'address' => ['string', 'max:191'],
            'phone' => ['string', 'max:191'],
            'website' => ['string', 'max:191']
        ];
    }

}
