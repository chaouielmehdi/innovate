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

class UserController extends Controller
{

    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        
       $this->middleware('assign.guard:users', ['except' => ['login', 'index', 'create']]);
    }

	/**
	 *  Create an user
     * 
     *  @return \Illuminate\Http\JsonResponse
	 */
    public function create(User $user, Request $request)
    {
        $validation = $this->validateRequest($request->all(), $this->createRule());
        if($validation != null)
            return response()->json(['status' => false, 'message' => $validation->toArray()], 422);

        $user =$this->createUser($request);
        if($user == null)
            return response()->json(['status' => false, 'message' => 'Il y a eu un probleme. Veuillez reessayer !', 500]);

        return $this->login($user);
	}
    
    
    /**
	 *  Create an user
     * 
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
     * Update an User.
     *
     * @param  Request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request){
        $userToUpdate = User::where('email' , auth()->user()->email)->first();
        if($userToUpdate == null){
            return response()->json(["status" => false, "message" => "user_not_found"], 404);
        }
        // Validate input
        $validator = Validator::make(request()->all(),$this->updateRule());
        if($validator->fails())
            return response()->json(["status" => false, $validator->messages()->toArray()], 422);
        
        // Now user has to wait for the modifications to be validated by Admin
        $userToUpdate->status = 2;

        if(UpdateUser::create($request, $userToUpdate) && $userToUpdate->save()){
            return response()->json(["status" => true, "message" => "user_waiting_admin_approval"], 200);
        }
        return response()->json(["status" => false, "message" => "error"], 500);
        

    }
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        
        $credentials = request(['email', 'password']);
        
        if (! $token = auth('users')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth('users')->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('users')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('users')->refresh());
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
			'expires_in' => auth('users')->factory()->getTTL() * 60,
			'email' => auth('users')->user()->email
        ]);
    }

    /*
     * Get all users
     *  
     * @return \Illuminate\Http\JsonResponse
     * 
     */ 
    public function index(){ 
        return response()->json(
            User::all()
        );
    }


    /*
     * Get one user with email
     *  
     * @return \Illuminate\Http\JsonResponse
     * 
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
     * 
     * @param String User canal
     * 
     * @return String User code
     */
    protected function setCode($canal){
        return  unique_random('users', 'code', 10, strtoupper(substr($canal,0,1)));
    }

    /**
     * 
     * User Creation validation Rule
     * @return @mixed
     */
    public function createRule(){
        return [
            'first_name' => ['required', 'string', 'max:191'],
            'last_name' => ['required', 'string', 'max:191'],
            'username' => ['required', 'string', 'max:191','unique:users'],
            'telephone' => ['required', 'string', 'max:191'],
            'canal' => ['required','string'],
            'address' => ['required', 'string', 'max:191'],
            'email' => ['required', 'string', 'email', 'max:191', 'unique:users'],
            'password' => ['required', 'string', 'max:191', 'min:6', 'confirmed']
        ];
    }

    /**
     * 
     * User Update validation Rule
     * @return @mixed
     */
    public function updateRule(){
        return [
            'first_name' => ['string', 'max:191'],
            'last_name' => ['string', 'max:191'],
            'username' => ['string', 'max:191','exists:users'],
            'telephone' => ['string', 'max:191'],
            'canal' => ['string'],
            'address' => ['string', 'max:191'],
            'password' => ['string', 'max:191', 'min:6']
        ];
    }


    /**
     * Create user from request 
     */
    public function createUser(Request $request){
        // Create the user
        $user = new User();

        $user->first_name = request("first_name");
        $user->last_name = request("last_name");
        $user->username = request("username");
        $user->telephone = request("telephone");
        $user->address = request("address");
        $user->canal = request("canal");
        $user->code = $this->setCode(request('canal'));
        $user->email = request("email");
        $user->password = Hash::make(request('password'));
        if(! $user->save())
            return null;
        return $user;
    }
}
