<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Admin;
use Config;
use App\User;

class AdminController extends Controller
{

    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('assign.guard:admins', ['except' => ['login', 'index', 'create']]);
    }

	/**
	 *  Create an admin
     * 
     *  @return \Illuminate\Http\JsonResponse
	 */
    public function create(Admin $admin, Request $request)
    {
		// Validation
        $validator = Validator::make($request->toArray(), [
            'first_name' => ['required', 'string', 'max:191'],
            'last_name' => ['required', 'string', 'max:191'],
            'username' => ['required', 'string', 'max:191','unique:admins'],
            'telephone' => ['required', 'string', 'max:191'],
            'address' => ['string', 'max:191'],
            'is_super_admin' => ['required','boolean'],
            // Code is first letter of TYPE concatenated with a random string
            'email' => ['required', 'string', 'email', 'max:191', 'unique:admins'],
            'password' => ['required', 'string']
        ]);

        if($validator -> fails()){
            return response()->json(["status" => false, "message" => $validator->messages()->toArray()], 409);
        }

		// Create the user
        $newAdmin = $admin->firstOrCreate(
            [
                'email' => request('email')
            ],    
            [
                'first_name' => request('first_name'),
                'last_name' => request('last_name'),
                'username' => request('username'),
                'address' => request('address'),
                'telephone' => request('telephone'),
                'is_super_admin' => request('is_super_admin'),
                'code' =>  unique_random('admins', 'code', 10, $this->setType(request("is_super_admin"))),  // First letter of type concatenated with a random 10char string         
                'email' => request('email'),
                'password' => Hash::make(request('password')),
                'remember_token' => Str::random(10),
            ]);

        // Admin was created 
        return response()->json(["status" => true, "message" => "Admin created successfully"]);
	}
    
    
    /**
	 *  Create an admin
     * 
     *  @return \Illuminate\Http\JsonResponse
	 */
    public function delete(Admin $admin, Request $request){
        $adminToDelete = $admin::where('email' , request("email"))->first();
        if($adminToDelete != null){
            $adminToDelete->delete();
            return response()->json(["status" => true, "message" => "admin_deleted"]);
        }
        else{
            return response()->json(["status" => false, "message" => "admin_not_found"]);
        }
    }


    /**
     * Update an Admin.
     *
     * @param  Request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Admin $admins, Request $reqest){
        $adminToUpdate = $admins::where('email' , request("email"))->first();
        if($adminToUpdate == null){
            return response()->json(["status" => false, "message" => "admin_not_found"]);
        }
        // Validate input
        $this->validate(request(), [
            'first_name' => ['required', 'string', 'max:191'],
            'last_name' => ['required', 'string', 'max:191'],
            'username' => ['required', 'string', 'max:191','unique:admins'],
            'telephone' => ['required', 'string', 'max:191'],
            'address' => ['string', 'max:191'],
            'is_super_admin' => ['required','boolean'],
            // Code is first letter of TYPE concatenated with a random string
            'email' => ['required', 'string', 'email', 'max:191'], // Suppose that email is unchangeable
            'password' => ['required', 'string']
        ]);
        
        // Set new values
        $adminToUpdate->first_name = request("first_name");
        $adminToUpdate->last_name = request("last_name");
        $adminToUpdate->username = request("username");
        $adminToUpdate->telephone = request("telephone");
        $adminToUpdate->address = request("address");
        $adminToUpdate->is_super_admin = request("is_super_admin");
        $adminToUpdate->code = unique_random('admins', 'code', 10, $this->setType(request("is_super_admin")));
        //$adminToUpdate->email = request("email");
        $adminToUpdate->password = Hash::make(request('password'));

        // Save
        $adminToUpdate->save();

        // Respond
        return response()->json(["status" => true, "message" => "admin_updated"]);

    }
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {

        $credentials = request(['email', 'password']);
        
        if (! $token = auth('admins')->attempt($credentials)) {
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
        return response()->json(auth('admins')->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('admins')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('admins')->refresh());
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
			'expires_in' => auth('admins')->factory()->getTTL() * 60,
			'user' => auth('admins')->user()
        ]);
    }

    /*
     * Get all admins
     *  
     * @return \Illuminate\Http\JsonResponse
     * 
     */ 
    public function index(){
        $allAdmins = Admin::all();
        return response()->json(
            $allAdmins
        );
    }


    /*
     * Get one admin with email
     *  
     * @return \Illuminate\Http\JsonResponse
     * 
     */ 
    public function admin(Admin $admins, Request $request){
        // Suppose that email is sent with request
        $admin = $admins::where('email' , request("email"))->first();
        
        return response()->json(
            $admin
        );
    }


    /**
     * Validate A User Account (User->status = 0) 
     * @param $id 
     * 
     */
    public function validateUserAccount($id){
        
        $user = User::find($id);
        if($user == null)   
            return response()->json(['status' => false, 'message' => 'user_not_found'], 404);
        $user->status = 1;
        if($user->save())
            return response()->json(['status' => true, 'message' => 'user_account_validated'], 200);
        return response()->json(['status' => false, 'message' => 'server_error'], 500); 
    }

    /**
     * 
     * Validate User Account Update 
     * @param user id 
     */
    public function validateUpdateUser($id){
        $user = User::find($id);
        if($user == null)
            return response()->json(['status' => false, 'message' => 'user_not_found'], 404);
        // Get last Record from user Update associated to User 
        $updateUser = DB::table('update_users')->where('user_id', $user->id)->orderBy('created_at', 'desc')->first();;
        if($updateUser == null) 
            return response()->json(['status' => false, 'message' => 'no_modifications_waiting_for_approval'], 404);
        
        // Migrate Attributes from UpdateUser to User
        if($user->updateFromUpdateUser($updateUser))
            return response()->json(['status' => true, 'message' => 'user_updated'], 200);
        return response()->json(['status' => false, 'message' => 'error'], 500);
    }


    /**
     * Get pending Users
     * 
     */
    public function pendingValidations(){
        // Select Users with status != 1
        $users = User::where('status', '!=', 1)->get();
        if($users->count() == 0)
            return response()->json(['status' => false, 'message' => 'no_users_waiting_for_approvals'], 404);
        return response()->json(['status' => true, 'users' => $users]);
    }


    /*
     * Set Admin Code 
     * 
     * @param Boolean User Type
     * 
     * @return tring Admin code
     */
    protected function setType($isSuperAdmin){
        $type = "A ";// Admin
        if($isSuperAdmin) {
            $type = null;
            $type="SA"; // Super Admin
        }
        return $type;
    }
    
}
