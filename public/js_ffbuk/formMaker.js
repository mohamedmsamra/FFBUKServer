//check if the thing selected by jQuery exists
//i.e. if the array returned by the selector is not empty
$.fn.exists=function() {
	return this.length !== 0;
}

/* Defining section and module as functions below allows them to be used like objects.
 * They are also used as objects with the same structure in marking.js, but this is
 * implicit as the objects are loaded from the JSON. Hence, the below declarations are not
 * required in marking.js. */

function section(nickname){

	this.heading =null;
	this.nickname = nickname;
	this.imgname=null;
	this.imgdata=null;
	this.positive=[]; 
	this.negative=[];

}

function module(name) {
	this.module = name;
	this.sections = [];
}

/*
***********************************************************************************
								PAGE SETUP
***********************************************************************************
*/

//behaviours of the create/edit buttons
$(document).ready(function() {
	btnInit();
	
	//when either button is clicked, fade them both out
	$('.button').one('click',function(){
		$('.button').fadeOut("slow");
	});

	//Create Template button - create empty form with one section to start with
	$('.button.left').one('click',function(){
		$('.sectionContainer').hide(); //hide div initially so can be faded in later
		var str =`<div id="moduleHeader" style="display:none">
				  Module name:<br> <input type="text" name="moduleName"><br>		
			
			</div>`; //div hidden initially, faded in later

		$('.sectionContainer').before(str);
		addEmptySection();

		$('.sectionContainer').after(`<button type="button" id="submit" onClick = "errorCheck()" style="display:none">Save Form</button>
			<button id="btn" type="button" onClick="addEmptySection()" style="display: none">+Add Section</button>`);
		$('.sectionContainer, #moduleHeader, #submit, #btn').delay(600).fadeIn("slow"); //display all of the above
	});

	//Edit Template button - show file input
	$('.button.right').one('click',function(){
		//add file input
		var str = `<div class="tempUpload" style="float: none; width: 100%; display: none">
					<form>
					<strong>Upload existing template (zip file):</strong>
					<input type="file" name="tempChoose" id="tempChoose" accept=".zip"/>	
					</form>
					</div>`;
		$('.uploadLocation').before(str);
		$('.tempUpload').delay(600).fadeIn("slow");

		//file input behaviour
		$('#tempChoose').on('change',function() {
			if( $(this)[0].files.length === 1 ) {
				readTemplate(event);
			}
			else if ($(this)[0].files.length > 1) {
				alert('Please select only one file.');
			}
		});
	});
});

/*
***********************************************************************************
							LOADING TEMPLATES
***********************************************************************************
*/

//reads uploaded zip file and translates into JSON, for use in fillFormMaker later
//very similar to readFile in marking.js
function readTemplate(event) {
	var file=event.target.files[0];
	if (!file.name.toLowerCase().endsWith('.zip')) {
		alert('Invalid template. Please upload a .zip file.');
		return false;
	}
	var url=window.URL.createObjectURL(file);
	var reader=new FileReader();
	var jsonData;
	var index=-1;
	//begin callback hell
	//get binary content of zip file
	JSZipUtils.getBinaryContent(url,index,function(err,data,index) {
		//callback for getBinaryContent
		
		if (err) {
			console.log("There was an error: "+err);
		}
		
		//load data into zip format that can be navigated and extracted from
		JSZip.loadAsync(data).then(function(zip){
			//callback for loadAsync
			
			//try/catch to make sure zip includes template.json
			try {
				zip.files['template.json'].async("string").then(function(data) {
					//begin callback for template async
					
					jsonData=JSON.parse(data);
					var counter=0; //for tracking how many section loops have finished, as they may finish out of order due to the async
					var errorFound=false;
					
					//loop over sections and load corresponding images
					jsonData.sections.forEach(function(sec, i, sections) {
						//not a callback
						/* each loop creates a new instance of this function, so the async within
						 * it can call the variables from the function scope (e.g. i) without 
						 * fear of them changing before the async is complete */
						var imgname=sec.imgname;
						if (imgname) {
							//try/catch to make sure zip includes all required images
							try {
								//load image into ArrayBuffer format, and store in corresponding section object
								zip.files['img/'+imgname].async("arraybuffer").then(function(imgdata) {
									//begin callback for image async
									
									sections[i].imgdata=imgdata;
									sections[i].imgname=imgname;
									counter++;
									if (counter==sections.length) {
										fillFormMaker(jsonData);
									}
									
									//end callback for image async
								});
							}
							catch (err3) {
								if(!errorFound) {
									alert('The zip file does not contain all the required images. Please upload a valid zip created by this software.');
									errorFound=true;
								}
								return false; //breaks loop
							}
						}
						else { //no image present for this section
							counter++;
							if (counter==sections.length) {
								fillFormMaker(jsonData);
							}
						}
						
						//end not a callback
					});
					
					//end callback for template async
				});
			}
			catch (err2) {
				alert('The zip file does not have the correct format. Please upload a valid zip created by this software.');
			}
			
			//end callback for loadAsync
		});
		
		//end callback for getBinaryContent
	});
	
	//end callback hell
}

//create pre-filled template sections using JSON read from readTemplate
//similar to createSections in marking.js, but with a different HTML layout
function fillFormMaker(json) {
	$('#moduleHeader').remove(); //delete existing header if there is one
	var header = `<div id="moduleHeader">
				  Module name:<br> <input type="text" name="moduleName" value="`+json.module+`"><br>		
			</div>`

	$('section').remove(); //removes existing sections, if there are any

	$('.sectionContainer').before(header); //add module name field to HTML
	
	//loop over each section and add the necessary HTML using its data
	for (var i=0; i<json.sections.length; i++) {
		var section=json.sections[i];
		var str=`<section class=`+section.nickname+`>
			<div class="invisibleDiv"></div>
			<div class="deleteSection"><img class="deleteIcon" src="../img/Buttons/click4.png"/></div>
			<div class="sectionheading">
			Section Heading: <br><input type="text" name="sectionHeading" value="`+section.heading+`"><br><br>
			</div>
			<div class="positive">
				Positive Comments<br>`;
		
		for (var j=0; j<section.positive.length; j++) {
			str+=`<div class="commentContainer">`
			if (j!=0) {
				str+=`<br>`;
			}
			str+=`<textarea rows="3">`+section.positive[j]+`</textarea><img class="deleteComment" src="../img/Buttons/click4.png"/><br></div>`;			
		}
				
		str+=`<div class="additionalPositiveComment"></div><br>
			<button type="button" class="btn pos">+Add Another Comment</button>
			</div>
			<div class="negative">
				Negative Comments<br>`;
		for (var j=0; j<section.negative.length; j++) {
			str+=`<div class="commentContainer">`
			if (j!=0) {
				str+=`<br>`;
			}
			str+=`<textarea rows="3">`+section.negative[j]+`</textarea><img class="deleteComment" src="../img/Buttons/click4.png"/><br></div>`;	
		}
		str+=`<div class="additionalNegativeComment"></div><br>
			<button type="button" class="btn neg">+Add Another Comment</button>
			</div>
			
			<div class="clear"></div>
			<br>
			<div class="addMarkScheme">
				Add mark scheme image (optional): `
		str+=`<input type="file" class="imgUpload" accept="image/*"><label class="fileLabel">No Image Chosen</label><img class="deleteImg" src="../img/Buttons/click4.png"/>`
		str+=`</div>
			<div class="clear"></div>
			</section>`;

		$('.sectionContainer').append(str);
		
		if (section.imgname) { //if section has an image linked to it, store the image data
			var imgUpload=$('section.'+section.nickname).find('.imgUpload');
			imgUpload.data('imgdata',section.imgdata);
			imgUpload.data('imgname',section.imgname);
			imgUpload.siblings('.fileLabel').html(section.imgname); //displays name of saved image
		}
		
	}
	btnInit(); //add functionality to all the buttons that just appeared on the page
	$('.bottomButton').remove(); //in case any set of bottom buttons already exists
	$('.sectionContainer').after(`<button class="bottomButton" type="button" id="submit" onClick = "errorCheck()">Save Form</button>
		<button id="btn" class="bottomButton" type="button" onClick="addEmptySection()">+Add Section</button>`);
}

/*
***********************************************************************************
							PAGE INTERACTIONS
***********************************************************************************
*/

//add a new empty section
function addEmptySection()
{
	var htmlString = `<section>
	<div class="invisibleDiv"></div>
	<div class="deleteSection"><img class="deleteIcon" src="../img/Buttons/click4.png"/></div>
	<div class="sectionheading">
	Section Heading: <br><input type="text" name="sectionHeading"><br><br>
	</div>

	<div class="clear"></div>

	<div class="positive">
	Positive Comments<br>

	<div class="commentContainer">
	<textarea rows="3"></textarea><img class="deleteComment" src="../img/Buttons/click4.png"/>
	</div>
	<div class="commentContainer">
	<br>
	<textarea rows="3"></textarea><img class="deleteComment" src="../img/Buttons/click4.png"/>
	</div>
	<div class="additionalPositiveComment"></div><br>

	<button type="button" class="btn pos">+Add Another Comment</button>
	</div>

	<div class="negative">

	Negative Comments <br> 
	<div class="commentContainer">
	<textarea rows="3" cols="50"></textarea><img class="deleteComment" src="../img/Buttons/click4.png"/>
	</div>
	<div class="commentContainer">
	<br>
	<textarea rows="3" cols="50"></textarea><img class="deleteComment" src="../img/Buttons/click4.png"/>
	</div>
	<div class="additionalNegativeComment"></div><br>
	<button type="button" class="btn neg">+Add Another Comment</button>
	</div>

	<div class="clear"></div>
	<br>
	<div class="addMarkScheme">
		Add mark scheme image (optional): <input type="file" class="imgUpload" accept="image/*"><label class="fileLabel">No image chosen</label><img class="deleteImg" src="../img/Buttons/click4.png"/>
	</div>
	<div class="clear"></div>
	
	</section>`;

	$('.sectionContainer').append(htmlString); //add all that to the HTML
	btnInit(); //add functionality to those new buttons
}

//set up behaviour of buttons etc. when clicked
//separated from $(document).ready so these can be re-set at will, when new elements are added
function btnInit() {

	//add another empty comment textarea
	$('.btn').off('click');
	$('.btn').on('click',function() {
		
		var divToAddTo;
		var par;

		//check if textarea is being added to positive or negative div
		if ($(this).hasClass('pos')) {
			divToAddTo=$(this).siblings('.additionalPositiveComment');
			par=$(this).parent('.positive');
		}
		else if ($(this).hasClass('neg')) {
			divToAddTo=$(this).siblings('.additionalNegativeComment');
			par=$(this).parent('.negative');
		}
		
		//create new textarea string
		var htmlString=`<div class="commentContainer">`;
		//if a textarea already exists in the desired div, add a break between them for spacing
		if (par.find('textarea').exists()){
			htmlString+=`<br>`;
		}
		htmlString+=`<textarea rows="3" cols="50"></textarea><img class="deleteComment" src="../img/Buttons/click4.png"/><br></div>`; //click4.png is the delete cross icon
		divToAddTo.before(htmlString);	
		btnInit();
	});

	//delete whole section
	$('.deleteIcon').off('click');
	$('.deleteIcon').on('click',function(){
		var section=$(this).parents('section');
		var heading = section.find('input[name="sectionHeading"]').val();
		var sectionEmpty=true;
		//check if section is empty
		if(heading=="")
		{
			section.find('textarea').each(function()
			{
				if ($(this).val()!="")
				{
					sectionEmpty=false;
					return false;
				}
			});
			if (section.find('.imgUpload').val()!="") {
				sectionEmpty=false;
			}
		}
		else {
			sectionEmpty=false;
		}
		//if section is not empty, warn before deleting
		if (!sectionEmpty) {
			if (confirm('This section is not empty. Delete it anyway?')) {
				section.remove();
			}
		}
		//if section is empty, delete without warning
		else {
			section.remove();
		}
	});

	//delete single comment textarea
	$('.deleteComment').off('click');
	$('.deleteComment').on('click',function(){
		var textareas=$(this).parents('.positive, .negative').find('textarea');
		var correspText=$(this).siblings('textarea');
		//if comment is not empty, confirm before deleting it
		if (correspText.val()!="") {
			if (confirm('This comment is not empty. Delete it anyway?')) {
				if (textareas.first().get(0)==correspText.get(0)) {
					var sib=$(this).parents('.positive, .negative').find('textarea:eq(1)');
					sib.siblings('br').first().remove();
				}
				$(this).parent('.commentContainer').remove();
			}
		}
		//if empty, no need to confirm
		else { 
			if (textareas.first().get(0)==correspText.get(0)) {
				var sib=$(this).parents('.positive, .negative').find('textarea:eq(1)');
				sib.siblings('br').first().remove();
			}
			$(this).parent('.commentContainer').remove();
		}		
	});
	
	//image input
	$('.imgUpload').on('change',function() {
		var imgUpload = $(this);
		var fileLabel = imgUpload.siblings('.fileLabel');
		//check if an image is present or not. val()=="" if no image is selected
		if($(this).val() == "") {
			if ($(this).data('imgname')) {
				fileLabel.html($(this).data('imgname'));
			}
			else {
				fileLabel.html("No image chosen");
			}
		}
		else {
			//check if file type is valid (mainstream image types) then display name in HTML
			if (imgUpload.val().toLowerCase().endsWith('.png') || imgUpload.val().toLowerCase().endsWith('.jpg') || imgUpload.val().toLowerCase().endsWith('.jpeg') ) {			
				var arr = imgUpload.val().split('\\');
				fileLabel.html(arr[arr.length-1]);
			}
			else {
				alert('Invalid file type. Please upload an image file (format .png, .jpg or .jpeg).');
				imgUpload.val(null);
				fileLabel.html("No image chosen");
			}
		}
	});
	
	//delete stored image
	$('.deleteImg').off('click');
	$('.deleteImg').on('click',function() {
		var imgUpload=$(this).siblings('.imgUpload');
		//if image exists, warn before deleting
		if (imgUpload.val()!="") {
			if (confirm('Are you sure?')) {
				imgUpload.data('imgname',null);
				imgUpload.data('imgdata',null);
				imgUpload.val(null);
				var fileLabel=$(this).siblings('.fileLabel');
				fileLabel.html("No image chosen");
			}
		}
		//if no image exists, no need to warn
		else {
			imgUpload.data('imgname',null);
			imgUpload.data('imgdata',null);
			imgUpload.val(null);
			var fileLabel=$(this).siblings('.fileLabel');
			fileLabel.html("No image chosen");
		}
	});
	
}

/*
***********************************************************************************
							SAVING TEMPLATES
***********************************************************************************
*/

//check that form is valid
/* Cases checked here:
	- module name is filled in
	- both section headings and at least one positive and negative comment are filled for each non-empty section
	- not all sections are empty
 * Completely empty sections do not generate alerts, but have a class 'ignore' added so they will be skipped in the save process. */
function errorCheck()
{
	var modulename = $('input[name="moduleName"]').val();
	var sectionNo=0; //how many sections there are in total
	var completed=0; //how many sections have passed error checking
	var fileImgs=[];
	var fileNames=[];
	//check if module name is empty
	if(modulename=="")
	{
		alert("Please fill in module name");
		return false; //return statements used only to break, false value just used to indicate failure
	}
	else
	{
		//check if all sections are empty
		if(isFormEmpty()==true)
		{
			alert("Please fill in at least one section");
			return false;
		}
		else
		{
			//check each section has both its heading and at least one positive and negative comment
			$('section').each(function(){
				sectionNo++;
				var heading = $(this).find('input[name="sectionHeading"]').val();
				//check if section heading is empty
				if(heading=="")
				{
					var hasValue =false;
					//check if heading-less section contains any filled comments
					$(this).find('textarea').each(function()
					{
						if ($(this).val()!="")
						{
							hasValue=true;
							return false;
						}
					});
					//alert user if heading-less section contains filled comments
					if (hasValue==true)
					{
						alert("Please insert section names");
						return false;
					}
					//if section is totally empty, do not throw error, just add tag to ignore that section when saving
					else
					{
						$(this).addClass('ignore');
						completed++; //passed tests
					}
				}
				//if section heading is not empty, check that one positive and one negative comment are filled
				else
				{
					var isEmpty = true;
					//check positive section to see if any comment textareas are filled
					$(this).find('.positive').find('textarea').each(function(){
						if($(this).val()!="")
						{
							isEmpty = false;
						}
					});

					//if all positive comments are empty, alert
					if (isEmpty==true)
					{
						alert("There are no POSITIVE comments with the section heading: " + heading);
						return false;
					}
					//if there is at least one filled positive comment, check negative comments by the same process
					else
					{
						isEmpty = true;
						//check negative section to see if any comment textareas are filled
						$(this).find('.negative').find('textarea').each(function(){
							if($(this).val()!="")
							{
								isEmpty = false;
							}
						});

						//if all negative comments are empty, alert
						if(isEmpty==true)
						{
							alert("There are no NEGATIVE comments with the section heading: " + heading);
							return false;
						}
					}
					//at this point, it is confirmed that there are valid positive and negative comments in the section
					//now confirm that section image does not have same name but different file size to another image in the template
					var imgUpload=$(this).find('.imgUpload');
					var fileImg=imgUpload[0].files[0];
					if (fileImg) {
						var fileName=imgUpload[0].files[0].name;
						var errorFound=false;
						//compare image with all other images stored so far
						for (var i=0; i<fileNames.length; i++) {
							//if two images have the same name but different sizes, alert user
							//not foolproof, but we have assumed that if two images have exactly identical names and sizes, they are the same image
							if (fileName==fileNames[i] && fileImg.size!=fileImgs[i].size) {
								alert("There are two different image files with the same name. Please check all unique images have different names.");
								errorFound=true;
								break;
							}
						}
						//store image data for comparison against later sections
						fileNames.push(fileName);
						fileImgs.push(fileImg);
						if (errorFound) {
							return false;
						}					
					}

					completed++; //passed tests
				}

			})
		}
	}
	if (sectionNo===completed && sectionNo!=0) { //only save if all sections have passed error tests
		formToJson();
	}
}

//check if all sections are empty or not
function isFormEmpty(){
	var isEmpty = true;
	$('section').each(function(){
		var heading = $(this).find('input[name="sectionHeading"]').val();
		if(heading!="") {			
			isEmpty =  false;
		}
		else {
			$(this).find('textarea').each(function(){
				if($(this).val()!="")
				{
					isEmpty = false;
				}
			});
		}
	});

	return isEmpty;
}

//escape " in comments and make empty comments be ignored when saving
//(it has already been checked that there is at least one filled comment in the section)
function validateInputs() {
	$('input[type="text"], textarea').each(function() {
		if ($(this).val()=="") {
			$(this).addClass("ignore");
		}
		else {
			var inputText=$(this).val();
			inputText.split('"').join('\"');
		}
	});
}

function formToJson() {
	validateInputs();

	var counter=0; //section counter used to generate nicknames
	
	//create module object to store all data in
	var modulename = $('input[name="moduleName"]').val();
	var jsonObject = new module(modulename);
	
	//create arrays for image data, used in stage 2
	var imgLinks=[];
	var imgNames=[];
	
	//BEGIN STAGE 1: Populating module object
	//loop over all sections and enter data into a section object contained within the module object
	$('section').each(function(){
		//if errorCheck assigned class 'ignore' to this section, it is empty, so ignore it
		if ($(this).hasClass('ignore')) {
			return true;
		}
		nickname = "section" + counter; //for internal section labelling only - user does not see this
		var sec = new section(nickname); //create section object
		sec.heading = $(this).find('input[name="sectionHeading"]').val();

		//loop over all comments and store them
		$(this).find('.positive').find(	'textarea').each(function()	{
			if (!$(this).hasClass('ignore')) { //if not empty, add comment to positive array
				(sec.positive).push($(this).val());
			}
		});
		$(this).find('.negative').find(	'textarea').each(function()	{
			if (!$(this).hasClass('ignore')) {
			(sec.negative).push($(this).val());
			}
		});
		
		//get image
		var imgUpload=$(this).find('.imgUpload');
		var imageFile=imgUpload[0].files[0];
		//if file exists, store a link to it for use in stage 2, and store its name in the section object
		if (imageFile) {
			var imageFilePath = window.URL.createObjectURL(imageFile);
			imgLinks.push(imageFilePath);
			imgNames.push(imageFile.name);
			sec.imgname=imageFile.name;
		}
		/* if no file was selected, but the user loaded a template which already had an image 
		 * applied to the section, this data has been stored in the input, and should be
		 * recovered and re-stored as above */
		else if (imgUpload.data('imgdata')) {
			imgLinks.push(imgUpload.data('imgdata')); //pushes ArrayBuffer instead of link, handled in stage 2
			imgNames.push(imgUpload.data('imgname'));		
			sec.imgname=imgUpload.data('imgname');
		}
		//if no image chosen and no previous image is stored, push null to maintain correct array length
		else {
			imgLinks.push(null);
			imgNames.push(null);
		}

		counter++;

		jsonObject.sections.push(sec); //add section to module
		
	})
	
	//convert module object into json string
	var toSave = JSON.stringify(jsonObject,null,2);
	
	//END STAGE 1
	
	//BEGIN STAGE 2: Saving content to zip file
	
	var filename="template.json"; 

	var zip = new JSZip();
	//save JSON data to zip as template.json
	zip.file(filename, toSave);
	
	//check if at least one image exists to be stored
	var imgLinksNotEmpty=imgLinks.some(function (element) {
		return element !== null;
	});
	
	if (imgLinksNotEmpty) {
		var img = zip.folder("img"); //create image folder inside zip
		var count=0; //for keeping track of how many images have been stored, since some functions run asychronously

		//loop over image array and store images
		for(var i=0; i<imgLinks.length; i++)
		{ 
			var link=imgLinks[i];
			
			if (link) {
				//link could be an ArrayBuffer or a URL, so account for both
				//if ArrayBuffer, can add to the folder directly
				if (link instanceof ArrayBuffer) {
					var name=imgNames[i];
					img.file(name,link,{binary:true});
					count++;
					if (count==imgLinks.length) {
						zip.generateAsync({type:"blob"}).then(function (content) {
							saveAs(content,modulename+".zip");
						});
					}	
				}
				//if URL, must first extract binary data, then add the resulting ArrayBuffer to the folder
				else {
					JSZipUtils.getBinaryContent(link, i, function (err, data, index) {
						if(err) {
							console.log("There was an error: " +err); //error failed
						} 
						else {
							//this is the same as the (link instanceof ArrayBuffer) code above
							var name=imgNames[index];
							img.file(name, data, {binary:true});
							count++;
							if (count==imgLinks.length) {
								zip.generateAsync({type:"blob"}).then(function (content) {
									saveAs(content,modulename+".zip");
								});
							}			 
						}
					 });   
				}
			}
			//if no image, just add to counter
			else {
				count++;
				if(count==imgLinks.length) {
					zip.generateAsync({type:"blob"}).then(function (content) {
						saveAs(content,modulename+".zip");
					});
				}
			}
		}  
	}
	//if no images to store, just save zip immediately
	else {
		zip.generateAsync({type:"blob"}).then(function (content) {
			saveAs(content,modulename+".zip");
		});
	}
	
	//scroll back to top
	$('html,body').animate({scrollTop: 0},'fast');
}