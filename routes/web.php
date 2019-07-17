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
Route::get('/home', 'PagesController@home');
Route::get('/about', 'PagesController@about');
Route::get('/faqs', 'PagesController@faqs');
Route::get('/survey1', 'PagesController@survey1');
Route::get('/survey2', 'PagesController@survey2');
//Route::get('/courses', 'PagesController@courses');
Route::get('/services', 'PagesController@services');

// will create all the routes associated with the post editing deleteing and so on
Route::group( ['middleware' => 'auth' ], function()
{
    // Assignments
    // Route::resource('assignments', 'AssignmentsController');
    Route::get('/api/assignments/{id}', 'AssignmentsController@apiShow');
    Route::get('/api/assignments', 'AssignmentsController@apiGetAllAssignments');
    Route::post('/api/assignments', 'AssignmentsController@apiStore');
    Route::post('/api/assignments/{id}/edit-name', 'AssignmentsController@apiEditName');
    Route::post('/api/assignments/{id}/clone', 'AssignmentsController@apiCloneAssignment');
    Route::delete('/api/assignments/{id}', 'AssignmentsController@apiDestroy');
    Route::get('/marking/{assignment_id}', 'PagesController@marking');

    // Comments
    Route::post('/api/comments', 'CommentsController@apiStore');
    Route::get('/api/comments/{id}', 'CommentsController@apiShow');
    Route::delete('/api/comments/{id}', 'CommentsController@apiDestroy');
    Route::post('/api/comments/{id}/edit-text', 'CommentsController@apiEditText');

    // Courses
    Route::resource('courses', 'CoursesController');
    Route::post('/api/courses/{course}/image-upload', 'CoursesController@apiImageUpload');
    Route::get('/api/courses/{course}/show-image', 'CoursesController@apiShowImage');
    Route::get('/api/courses/{course}', 'CoursesController@apiShow');
    Route::post('/api/courses/{course}/join', 'CoursesController@apiJoinCourse');
    Route::post('/api/courses/{course}/invite', 'CoursesController@apiInviteToCourse');
    Route::get('/api/courses/{course}/permissions', 'CoursesController@apiGetPermissions');
    Route::post('/api/courses/{course_id}/permissions/{user_id}', 'CoursesController@apiUpdatePermission');
    Route::delete('/api/course-permissions/{id}', 'CoursesController@apiRemoveFromCourse');
    Route::delete('/api/course-permissions/{id}/reject-invite', 'CoursesController@apiRejectCourseInvite');
    
    // Sections
    Route::post('/api/sections', 'SectionsController@apiStore');
    Route::get('/api/sections/{id}', 'SectionsController@apiShow');
    Route::delete('/api/sections/{id}', 'SectionsController@apiDestroy');
    Route::post('/api/sections/{id}/edit-title', 'SectionsController@apiEditTitle');
    Route::post('/api/sections/{id}/upload-image', 'SectionsController@apiUploadImage');
});


Auth::routes();

// TODO: Remove
Route::get('/apitest', function () {
    return view('apitest');
});