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

Route::prefix('api')->group(function () {
    Route::resource('sidebar', 'SidebarController');
});

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
Route::get('/home', 'PagesController@home');
Route::get('/about', 'PagesController@about');
Route::get('/marking/{assignment_id}', 'PagesController@marking');
Route::get('/faqs', 'PagesController@faqs');
Route::get('/survey1', 'PagesController@survey1');
Route::get('/survey2', 'PagesController@survey2');
//Route::get('/courses', 'PagesController@courses');
Route::get('/services', 'PagesController@services');

// will create all the routes associated with the post editing deleteing and so on
Route::resource('courses', 'CoursesController');
Route::post('/courses/{course}/imageUpload', 'CoursesController@imageUpload');
Route::get('/courses/{course}/show-image', 'CoursesController@showImage');

// will create all the routes associated with the assignment editing deleteing and so on
Route::resource('assignments', 'AssignmentsController');
Route::get('/courses/{course_id}/assignments/create', ['uses' => 'AssignmentsController@create']);

// Create all routes associated with the template editing deleting and so on
Route::resource('templates', 'TemplatesController');

// Resources for the API
Route::resource('/api/templates', 'Api\TemplatesController');
Route::resource('/api/sections', 'Api\SectionsController');
Route::post('api/sections/new-section', 'Api\SectionsController@postNewSection');
Route::resource('/api/comments', 'Api\CommentsController');
Route::resource('/api/assignments', 'Api\AssignmentsController');
Route::post('/api/assignments/edit-name', 'Api\AssignmentsController@editName');

Auth::routes();

Route::get('/dashboard', 'DashboardController@index');

Route::get('/api/sections/{section}/image-upload', 'Api\SectionsController@imageUpload');
Route::post('/api/sections/{section}/image-upload', 'Api\SectionsController@imageUploadPost');

// TODO: Remove
Route::get('/apitest', function () {
    return view('apitest');
});