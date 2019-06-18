<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Template;

class TemplatesController extends Controller
{
    public function create()
    {
        //return a view within the post folder
        return view('templates.create');
    }
    public function store(Request $request)
    {
        //here we do our form validation first before returning that the storage was successful
        // so the form does not submit until each component are present
       
        $this -> validate($request,[
            'heading' => 'required',
            'category' => 'required',
            'comment' => 'required',
        ]);
        
        //Create Template
        $template = new Template;
        $template ->heading = $request->input('heading');   
        $template ->category = $request->input('category'); 
        $template ->comment = $request->input('comment'); 
        $template ->save();
        
        //direct the page back to the index
        //set the success message to Template Created
        return redirect('/')-> with('success', 'Your Template has been added successfully!');
    }
    public function index()
    {
        //put the posts into pages, each page takes 10 items for now per page
        $templates = Template::orderBy('heading')->paginate(10);
        return view('templates.index') -> with('templates', $templates);

    }
    public function show($id)
    {
        //it gets the id from the URL
        //http://ffbuk.test/posts/1
       //return this specific post which its id is in the link
        $template=  Template::find($id);
        return view('templates.show') -> with('template', $template);

    }

}
