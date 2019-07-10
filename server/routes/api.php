<?php

// Auth
Route::group(['prefix' => 'auth', 'middleware' => ['api']], function (){
    // User
    Route::post('user/login', 'UserController@login');
	Route::get('user/logout', 'UserController@logout');
	Route::post('user/uploadLogo', 'UserController@uploadLogo');
	Route::post('user/lightlyValidate', 'UserController@lightlyValidate'); // used to validate th form asynchronously
	Route::post('user/userEmailExists', 'UserController@userEmailExists'); // used in recover password (good case : email exist)
	Route::post('user/recover', 'UserController@recover'); // used in recover
	Route::post('user/create', 'UserController@create');

    // Admin
	Route::post('admin/create', 'AdminController@create');
	Route::post('admin/login', 'AdminController@login');
	
    // Commercial
    Route::post('commercial/create', 'CommercialController@create');
    Route::post('commercial/login', 'AdminController@login');
});


// User group 
Route::group(['prefix' => 'user', 'middleware' => ['api', 'assign.guard:admins', 'jwt.auth']], function () {
	Route::post('update'		, 'UserController@update');
    Route::post('index'			, 'UserController@index');
    Route::post('me'			, 'UserController@me');
    Route::post('delete'		, 'UserController@delete');
});


// Admin group 
Route::group(['prefix' => 'admin','middleware' => ['api', 'assign.guard:admins', 'jwt.auth']], function ()
{
    Route::post('index'            , 'AdminController@index'            );
    Route::post('me'               , 'AdminController@me'               );
    Route::post('delete'           , 'AdminController@delete'           );
    Route::post('update'           , 'AdminController@update'           );
    Route::group(['prefix' => 'validate'], function(){
        Route::post('/', 'AdminController@pendingValidations');
        Route::post('user/{id}', 'AdminController@validateUserAccount');
        Route::post('user-update/{id}', 'AdminController@validateUpdateUser');
    });
});


// Commercial group 
Route::group(['prefix' => 'commercial','middleware' => ['api', 'assign.guard:commercials','jwt.auth']],function ()
{
    Route::post('/index'            , 'CommercialController@index'       );
    Route::post('/me'               , 'CommercialController@me'          );
    Route::post('/delete'           , 'CommercialController@delete'      );
    Route::post('/update'           , 'CommercialController@update'      );
});


// Product Group
Route::group(['prefix' => 'product', 'middleware' => 'api'], function() {
    Route::post('/'                , 'ProductController@product'       ); // Get a product with id
    Route::post('index'            , 'ProductController@index'         ); // Get all products
    Route::post('create'           , 'ProductController@create'        ); // Create new Product
});


// Command Group
Route::group(['prefix' => 'commande', 'middleware' => 'api'], function() {
    Route::post('create'           , 'CommandeController@create'        ); // Create new Product
});
