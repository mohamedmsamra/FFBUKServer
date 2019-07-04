<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\Section;
use App\Models\Comment;

class TemplatesController extends Controller
{
    public function index(Request $request) {
        $templates;

        // If assignment id is provided
        if ($request->input('assignment_id')) {
            $templates = Template::where('assignment_id', "=", $request->input('assignment_id'))->get();
        } else {
            $templates = Template::get();
        }

        return json_encode($templates);
    }

    public function store(Request $request) {
        $this -> validate($request,[
            'name' => 'required',
            'assignment_id' => 'required'
        ]);
        
        //Create Template
        $template = new Template;
        $template->name = $request->input('name');
        $template->assignment_id = $request->input('assignment_id');
        $template->save();
        
        // //direct the page back to the index
        // //set the success message to Template Created
        // return redirect('/')-> with('success', 'Your Template has been added successfully!');
        return json_encode($template);
    }

    public function show($id) {
        $template = Template::find($id);

        // Add sections
        $sections = Section::where('template_id', "=", $template['id'])->get();
        \Log::info($sections);
        foreach ($sections as $section) {
            \Log::info('Section '.$section->id.': ');
            \Log::info($section->marking_scheme);
            $pos_comments = Comment::where('section_id', '=', $section['id'])->where('type', '=', 'positive')->get();
            $neg_comments = Comment::where('section_id', '=', $section['id'])->where('type', '=', 'negative')->get();
            $section['positiveComments'] = $pos_comments;
            $section['negativeComments'] = $neg_comments;
        }
        
        $template['sections'] = $sections;
        \Log::info($template['sections']);

        return $template ? json_encode($template) : "{error: 'Template not found'}";
    }
}
