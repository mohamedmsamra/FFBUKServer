<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\Section;

class TemplatesController extends Controller
{
    public function index() {
        $templates = Template::get();

        return json_encode($templates);
    }

    public function store(Request $request) {
        $this -> validate($request,[
            'name' => 'required'
        ]);
        
        //Create Template
        $template = new Template;
        $template->name = $request->input('name');
        $template->save();
        
        // //direct the page back to the index
        // //set the success message to Template Created
        // return redirect('/')-> with('success', 'Your Template has been added successfully!');
        return json_encode("done");
    }

    public function show($id) {
        $template = Template::find($id);

        // Add sections
        foreach ($templates as $template) {
            $sections = Section::where('template_id', "=", $template['id'])->get();
            $template['sections'] = $sections;
        }
        
        return $template ? json_encode($template) : "{error: 'Template not found'}";
    }
}
