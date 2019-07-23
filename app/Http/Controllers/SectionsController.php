<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Models\Comment;

/**
 * The Sections Controller deals with saving and returning information to and from storage about sections.
 */
class SectionsController extends Controller
{
    /**
     * Save a new section to storage
     * 
     * @param Illuminate\Http\Request $request what needs to be sent in the post request
     * @return string a string containing the JSON representation of the section object
     */
    public function apiStore(Request $request) {
        // Validate the request data
        // The section title and assignment id are mandatory
        $this -> validate($request,[
            'title' => 'required',
            'assignment_id' => 'required'
        ]);

        // If the authenticated user does not have authorisation to edit this assignment, abort
        // i.e. if they are not the course owner nor have a course permission level of read/write
        if (!AssignmentsController::canEdit($request->assignment_id)) abort(401);
        
        // Create the new section with the given information
        $section = new Section;
        $section->title = $request->input('title');
        $section->assignment_id = $request->input('assignment_id');
        // Save the section to storage
        $section->save();
        
        // Return the section in JSON representation
        return json_encode($section);
    }

    /**
     * Get all the information for one section given its id
     * 
     * @param int $id the section id
     * @return string a string containing the JSON representation of the section object
     */
    public function apiShow($id) {
        // Find the section and return it
        $section =  Section::find($id);
        return $section;
    }

    /**
     * Remove a section from storage
     * 
     * @param int $id the id of the section
     * @return string the title of the removed section
     */
    public function apiDestroy($id) {
        // If the authenticated user does not have authorisation to remove this section, abort
        // i.e. if they are not the course owner nor have a course permission level of read/write
        if (!$this->canEdit($id)) abort(401);

        // Find the section, save its title and then remove it from storage
        $section = Section::find($id);
        $title = $section->title;
        $section -> delete();

        // Return the section title
        return json_encode($title);
    }


    /**
     * Change the title of a section
     * 
     * @param Illuminate\Http\Request $request what needs to be sent in the update request
     * @param int $id the id of the section
     * @return string a confirmation message
     */
    public function apiEditTitle(Request $request, $id)
    {
        // If the authenticated user does not have authorisation to edit the section title, abort
        // i.e. if they are not the course owner nor have a course permission level of read/write
        if (!$this->canEdit($id)) abort(401);

        // The new section title is required
        $this -> validate($request,[
            'title' => 'required'
        ]);

        // Find the section, change the title and save the updates to storage
        $section = Section::find($id);
        $section -> title = $request->input('title'); 
        $section -> save();

        // Return a success message
        return json_encode("Section Updated!");
    }

    /**
     * Store a section marking scheme image in storage and return the stored filename.
     * 
     * @param \Illuminate\Http\Request $request the image to be sent in the post request
     * @param int $id the id of the section the image needs to be uploaded to
     * @return string the file path to the image withing the storage folder
     */
    public function apiUploadImage(Request $request, $id)
    {
        // If the authenticated user does not have authorisation to edit the section, abort
        if (!$this->canEdit($id)) abort(401);
        
        // The image is required for this request
        $this -> validate($request,[
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg'
        ]);

        // Get image from the request
        $img = $request -> image;

        $user_id = auth()->user()->id;

        // Check if user folder exists and create it if not
        $path = storage_path('app/public/user_'.$user_id);
        if(!file_exists($path)) {
            // Path does not exist, so create it
            \File::makeDirectory($path);
        }

        // If the user already has any other images for this section, remove them
        $matches = glob($path.'/markingScheme_'.$id.'*');
        foreach ($matches as $match) {
            \Log::info($match);
            unlink($match);
        }

        // Generate unique image name
        $imageName = 'markingScheme_'.$id.'_'.date("YmdHis").'.'.$img->getClientOriginalExtension();

        // Save image to user folder
        $img->move($path, $imageName);
        \Log::info(date("YmdHis"));
               
        // Save the image path inside the storage folder to store to the database
        $toDB = 'user_'.$user_id.'\\'.$imageName;

        // Find the section and save the marking scheme path to storage
        $section = Section::find($id);
        $section -> marking_scheme = $toDB; 
        $section -> save();

        // Return the path that is saved in storage
        return json_encode($toDB);
    }

    /**
     * Check if the authenticated user can edit a section given the section id
     * 
     * @param int $id the id of the section to check
     * @return boolean if the authenticated user can edit the section
     */
    public static function canEdit($id) {
        // Find the assignment this section belongs to
        $assignment = Section::find($id)->assignment()->first();

        // Return if the assignment exists and the authenticated user has permission to edit the assignment
        return $assignment && AssignmentsController::canEdit($assignment->id);
    }

    /**
     * Check if the authenticated user has permission to view a section given the section id
     * 
     * @param int $id the id of the section to check
     * @return boolean if the authenticated user has permission to view the section
     */
    public static function canView($id) {
        // Find the assignment this section belongs to
        $assignment = Section::find($id)->assignment()->first();

        // Return if the assignment exists and the authenticated user has permission to view the assignment
        return $assignment && AssignmentsController::canView($assignment->id);
    }
}
