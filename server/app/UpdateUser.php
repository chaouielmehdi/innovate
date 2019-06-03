<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class UpdateUser extends Model
{
    protected $guarded = [];

    /**
     * Insert a row in User Update 
     * @param Object
     * @return boolean
     */
    public static function create($object, $user){
        $updateUser = new UpdateUser();

        $updateUser->user_id = $user->id;
        $updateUser->first_name = $object->first_name;
        $updateUser->last_name = $object->last_name;
        $updateUser->username = $object->username;
        $updateUser->telephone = $object->telephone;
        $updateUser->address = $object->address;
        $updateUser->code = $user->code;
        $updateUser->canal = $object->canal;
        $updateUser->password = Hash::make($object->password);
        return $updateUser->save();
    }
}
