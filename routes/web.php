<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

/*
Route::get('/hello', function () {
    return "<h1> Hello World </h1>";
});

//dynamic routing, so when some call the users/(dynamic user)
// the function will get user from url and post it into the page
//that's helpful to retrieve data from database based on this id
Route::get('/users/{id}', function ($id) {
    return 'This is user ' .$id;
});

//another dynamic route example where we can pass more dyanmic values as we want
Route::get('/users/{name}/{id}', function ($name,$id) {
    return 'This is user ' .$name.' with id ' .$id;
});


//when the user ask for about page by calling it. return this view 
//from resources/views/pages/about
Route::get('/about', function () {
    return view('pages.about');
});
*/



//we call here the controller and the function inside this specific controller
//ControllerName@MethodName
//This method should load the specific view
Route::get('/', 'PagesController@index');
Route::get('/about', 'PagesController@about');
Route::get('/services', 'PagesController@services');

// will create all the routes associated with the post editing deleteing and so on
Route:: resource ('posts','PostsController');

Auth::routes();

Route::get('/dashboard', 'DashboardController@index');
