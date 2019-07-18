<?php

// User group
Route::group(
	[
		'middleware' => ['api'],
		'prefix' => 'user'
	],
	function() {
		// used to validate the user form asynchronously
		Route::post('asyncValidate'		, 'UserController@asyncValidate');

		// used in recover password to validate the form asynchronously
		// positive respond : email exists
		Route::post('exists'			, 'UserController@exists');

		Route::post('uploadLogo'		, 'UserController@uploadLogo');
		Route::post('create'			, 'UserController@create');
		Route::post('login'				, 'UserController@login');
		Route::get ('logout'			, 'UserController@logout');
		Route::post('recover'			, 'UserController@recover');

		Route::get ('get'				, 'UserController@me');
		Route::post('update'			, 'UserController@update');
		Route::post('delete'			, 'UserController@delete');
	}
);




// Admin group 
Route::group(
	[
		'middleware' => ['api'],
		'prefix' => 'admin'
	],
	function() {
		// used to validate the admin form asynchronously
		Route::post('asyncValidate'	, 'AdminController@asyncValidate');
		
		Route::post('create'		, 'AdminController@create');
		Route::post('login'			, 'AdminController@login');
		Route::get ('logout'		, 'AdminController@logout');

		Route::post('index'			, 'AdminController@index');
		Route::post('me'			, 'AdminController@me');
		Route::post('delete'		, 'AdminController@delete');
		Route::post('update'		, 'AdminController@update');
		
		Route::group(['prefix' => 'validate'], function(){
			Route::post('/', 'AdminController@pendingValidations');
			Route::post('user/{id}', 'AdminController@validateUserAccount');
			Route::post('user-update/{id}', 'AdminController@validateUpdateUser');
		});
	}
);





// Auth
Route::group(['prefix' => 'auth', 'middleware' => ['api']], function (){
    // Admin
	Route::post('admin/create', 'AdminController@create');
	Route::post('admin/login', 'AdminController@login');
	
    // Commercial
    Route::post('commercial/create', 'CommercialController@create');
    Route::post('commercial/login', 'AdminController@login');
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
