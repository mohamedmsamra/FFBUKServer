<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Section;

class SectionsController extends Controller
{
    public function store(Request $request) {
        $this -> validate($request,[
            'title' => 'required',
            'template_id' => 'required'
        ]);
        
        //Create Section
        $section = new Section;
        $section->title = $request->input('title');
        $section->template_id = $request->input('template_id');
        $section->save();
        
        return json_encode("done");
    }

    public function show($id) {
        $section =  Section::find($id);
        // // Add comments
        // foreach ($templates as $template) {
        //     $sections = Section::where('template_id', "=", $template['id'])->get();
        //     $template['sections'] = $sections;
        // }
        return $section;
    }
}
