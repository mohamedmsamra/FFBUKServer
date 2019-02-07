<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
//return the Post Model so we can use it here
use App\Post;
//if we want to use normal SQL we need to call DB
use DB;

class PostsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //this is the page that index retrieve 
        //http://ffbuk.test/posts
        //return a view named index from posts folder

        // a model function that retrieve all the data from post table without using SQL queries
        // and that actual use Eloquent (object relational mapper) without any sql queries
        //$posts= Post::all();
        

        //we can control how we can return posts so ordered asc or desc by title 
        //$posts = Post::orderBy('title','desc')->get();

        //we can also how many items we can return
        //returns only one item from the whole list
        //$posts = Post::orderBy('title','desc')-> take(1) ->get();

        //or even we can do conditions on the retrival (built in Eliqounet)
        //return only posts which has title== Post Two
        //$posts = Post::where('title','Post Two')->get();

        //we can also use normal sql
        //$posts = DB::select('SELECT * FROM posts');

        //put the posts into pages, each page takes 10 items for now per page
        $posts = Post::orderBy('created_at','desc')->paginate(10);
        return view('posts.index') -> with('posts', $posts);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //return a view within the post folder
        return view('posts.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //here we do our form validation first before returnging that the storage was successful
        // so the form does not submit until the title and the body are there 
       
        $this -> validate($request,[
            'title' => 'required',
            'body' => 'required',
        ]);
        
        //Create Post
        $post = new Post;
        $post -> title = $request->input('title');   
        $post -> body = $request->input('body'); 
        $post -> save();

        //direct the page back to the index
        //set the success message to Post Created
        return redirect('/posts')-> with('success', 'Post Created!');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //it gets the id from the URL
        //http://ffbuk.test/posts/1
       //return this specific post which its id is in the link
        $post=  Post::find($id);
        return view('posts.show') -> with('post', $post);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
