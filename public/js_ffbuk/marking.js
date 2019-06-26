//check if the thing selected by jQuery exists
//i.e. if the array returned by the selector is not empty
$.fn.exists=function() {
	return this.length !== 0;
}

/*
***********************************************************************************
								PAGE SETUP
***********************************************************************************
*/

$(document).ready(function() {
	setup();

	//hide loaded marking template until user chooses a template
	$('.markingWrapper').hide();

	//disable PDF upload button until file(s) selected
	$('#pdfChoose').on('change',function() {
		if ($(this)[0].files.length!==0) { //make sure at least one file has been selected
			$('.pdfEmbed').attr('id',""); //reset embedded PDF ID to empty to prevent errors
			getPDF();
		}
	});

	//resize sections when window size is changed - accounts for dynamic sizing of tabs and markschemes
	$(window).on('resize',function() {
		$('section').each(function() {
			var sectionClass=$(this).attr('class');
			calcSectionHeight(sectionClass);
		});
	});

	//load template when one is selected
	$('#tempChoose').on('change',function() {
		if( $(this)[0].files.length === 1 ) {
			readFile(event);
		}
		else if ( $(this)[0].files.length > 1) {
			alert("Please select only one file.");
		}
	});
});

//reset all elements of page, without removing the loaded marking template and PDF
function setup() {
	//clear all text boxes, hide all tabs and mark schemes, reset section heights
	$("textarea").val("");
	$(".tab").removeClass('active');
	$(".markScheme").removeClass('active');
	$("section").each(function() {
		var sectionClass=$(this).attr('class');
		calcSectionHeight(sectionClass);
	});
	markingInit();
}

/*
***********************************************************************************
							LOADING TEMPLATES
***********************************************************************************
*/

//reads uploaded zip file and translates into JSON, for use in createSections later
//very similar to readTemplate in formMaker.js
function readFile(event) {
	var file=event.target.files[0];
	if (!file.name.toLowerCase().endsWith('.zip')) {
		alert('Invalid template. Please upload a .zip file.');
		event.target.val("");
		return false;
	}
	var url=window.URL.createObjectURL(file);
	var reader=new FileReader();
	var jsonData;
	var index=-1;
	//begin callback hell
	//get binary content of zip file
	JSZipUtils.getBinaryContent(url,index,function(err,data,index) {
		//begin callback for getBinaryContent

		if (err) {
			console.log("There was an error: "+err);
		}

		//load data into zip format that can be navigated and extracted from
		JSZip.loadAsync(data).then(function(zip){
			//begin callback for loadAsync

			//try/catch to make sure zip includes template.json
			try {
				zip.files['template.json'].async("string").then(function(data) {
					//begin callback for template async

					jsonData=JSON.parse(data);
					var counter=0; //for tracking how many section loops have finished, as they may finish out of order due to the async
					var errorFound=false;
					$('.markingWrapper').attr('id',jsonData.module); //save module name into HTML

					//loop over sections and load corresponding images
					jsonData.sections.forEach(function(sec, i, sections) {
						//not a callback
						/* each loop creates a new instance of this function, so the async within
						 * it can call the variables from the function scope (e.g. i) without
						 * fear of them changing before the async is complete */
						var imgname=sec.imgname;
						if (imgname) {
							try {
								//load image into ArrayBuffer format, and store in corresponding section object
								zip.files['img/'+imgname].async("arraybuffer").then(function(imgdata) {
									//begin callback for image async

									sections[i].imgdata=imgdata;
									sections[i].imgname=imgname;
									counter++;
									if (counter==sections.length) {
										createSections(jsonData.sections);
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
								createSections(jsonData.sections);
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

//create sections using JSON read from readFile
//similar to fillFormMaker in formMaker.js, but with a different HTML layout
function createSections(sections) {
	$('section').remove(); //delete existing sections (in case a template has already been read before this one)
	var div=$('.sectionContainer'); //section HTML will be added inside this div

	//loop over each section and add the necessary HTML using its data
	for (var i=0; i<sections.length; i++) {
		var sectionHeading=sections[i].heading; //display heading
		var sectionName=sections[i].nickname; //internal use only - user does not see this

		//get image if one exists for the section and render using base64 encoding
		var imgdata=sections[i].imgdata;
		var imgstr="";

		if (imgdata) {
			var imgdataBytes=new Uint8Array(imgdata); //converts ArrayBuffer to array
			var binary='';
			for (var j=0; j<imgdataBytes.byteLength; j++) {
				binary += String.fromCharCode(imgdataBytes[j]);
			}
			var imgdataEncoded= window.btoa(binary); //encodes into base 64

			imgstr+='<p class="markShow"><a href="#'+sectionName+'_markScheme">Show mark scheme</a></p>\n'
			imgstr+='<div class="clear"></div>\n'
			imgstr+='<div class="markScheme" id="'+sectionName+'_markScheme"><img src="data:image/png;base64,'+imgdataEncoded+'"/></div>\n'
			//image rendered by telling src it is a base64 input, it converts this to a png
		}
		else {
			imgstr+='<br><br>'; //for consistent spacing with/without markscheme
		}
		//image processing done

		//add HTML to string
		//see documentation for clearer explanation of class assignments
		var str='<section class="'+sectionName+'">\n';
		str+='<h2>'+sectionHeading+'</h2>\n';
		str+=imgstr;
		str+='<textarea type="text" contenteditable="true" id="'+sectionName+'Text" rows=6 cols=70></textarea>\n';
		str+='<br>\n';
		str+='<button type="button" onclick="clearText(\''+sectionName+'\')" id="'+sectionName+'Clear" class="clearSec">Clear</button>\n';
		str+='<br>\n';
		str+='<div class="tabContainer">\n';
		str+='<div class="tabs '+sectionName+'" id="'+sectionName+'_tabs">\n';
		str+='<ul class="tab-links">\n';
		str+='<li class="positive"><a href="#'+sectionName+'_positive">Positive</a></li>\n';
		str+='<li class="negative"><a href="#'+sectionName+'_negative">Negative</a></li>\n';
		str+='</ul>\n';
		str+='</div>\n';
		str+='<div class="tab-content '+sectionName+'" id="'+sectionName+'_tab_content">\n';
		str+='<div id="'+sectionName+'_positive" class="tab positive">\n'
		str+='<ol>\n';
		var posComments=sections[i].positive;
		for (var j=0; j<posComments.length; j++) {
			str+='<li>'+posComments[j]+'</li>\n';
		}
		str+='</ol>\n';
		str+='</div>\n';
		str+='<div id="'+sectionName+'_negative" class="tab negative">\n'
		str+='<ol>\n';
		var negComments=sections[i].negative;
		for (var j=0; j<negComments.length; j++) {
			str+='<li>'+negComments[j]+'</li>\n';
		}
		str+='</ol>\n';
		str+='</div>\n';
		str+='</div>\n';
		str+='</div>\n';
		str+='</section>\n';

		div.append(str); //add string into HTML - only after this runs will the above HTML be displayed
	}

	//compilation section - not present in template so add manually
	var str2='<section class="compile">\n';
	str2+='<h2 class="compile">Compiled Feedback</h2><br><br>\n';
	str2+='<textarea  type ="text" name = "compile" id = "compileText" class="compile" rows=6 cols=70></textarea>\n';
	str2+='<br><br>\n';
	str2+='<button class="compile" type="button" onclick="Compile()" id="compileButton">Compile Comments</button>\n';
	str2+='</section>\n';
	div.append(str2); //add to HTML

	$('.markingWrapper').show();
	if ( $('.markingWrapper').height() > $(window).height() ) {
		stickifyPDF(); //make PDF sticky if the sections are long enough to justify it
	}

	markingInit(); //add functionality to all the buttons that just appeared on the page
}

/*
***********************************************************************************
							PAGE INTERACTIONS
***********************************************************************************
*/

//sets up behaviour of tabs/links etc. when clicked
//separated from $(document).ready so these can be re-set after template load
//if only run in $(document).ready, buttons/tabs generated after the page has loaded do not do anything on click
function markingInit() {

	//show/hide clicked pos/neg tabs
	$('.tab-links a').off('click'); //failsafe in case function is called multiple times
	$('.tab-links a').on('click',function(e) {
		var currentAttrValue=$(this).attr('href'); //gets link to corresponding tab-content div
		$(currentAttrValue).toggleClass('active');
		$(currentAttrValue).siblings().removeClass('active'); //hide all sibling tabs to the active tab

		var sectionClass=$(this).parents('section').attr('class');
		calcSectionHeight(sectionClass);

		e.preventDefault(); //prevents clicked tab name appearing in URL
	});

	//add clicked list element to text box
	$('ol li').off('click');
	$('ol li').one('click',function(e) {
		var className=$(this).parents('section').attr('class');
		addText(event,className);
	});

	//show/hide mark scheme
	$('.markShow a').off('click');
	$('.markShow a').on('click',function(e) {
		var currentAttrValue=$(this).attr('href');
		var markScheme=$(currentAttrValue);
		if (markScheme.hasClass('active')) { //if currently shown, hide
			markScheme.removeClass('active');
			$(this).text('Show mark scheme');
		}
		else { //if currently hidden, show
			$(currentAttrValue).addClass('active');
			$(this).text('Hide mark scheme');
		}

		//change size of parent section to accomodate size of image
		var sectionClass=$(this).parents('section').attr('class');
		calcSectionHeight(sectionClass);

		e.preventDefault();
	});
}

//add clicked line to corresponding text box
function addText(event,str) { //str = section class
	var targ = event.target || event.srcElement; // using || accounts for different browsers
	var textToAdd=targ.textContent || targ.innerText;
	var textName="#"+str+"Text"; //ID of corresponding textarea
	var currentText=$(textName).val(); //text already entered into textarea
	if(!textToAdd.includes("***"))
	{
		if (currentText==="") { //if no text is present, add clicked text without spaces
			$(textName).val(textToAdd);
		}
		else { //if box is not empty, add clicked text with a space
			$(textName).val($(textName).val()+" "+ targ.textContent || targ.innerText);
		}
	}
}

//clear single textarea
function clearText(str) { //str = section class
	var textAreaID='#'+str+'Text';
	$(textAreaID).val("");
	resetLists(str);
}

//allow clicked list elements to be clicked again after clearing of corresponding textarea
function resetLists(str) {//str = section class
	var section=$('section.'+str); //get parent section
	var elements=section.find('ol li');
	elements.off('click');
	elements.one('click',function(e) {
		addText(event,str);
	});
}

//re-calculate required section height based on changes to its visible content
//e.g. pos/neg or markscheme being opened/closed
function calcSectionHeight(sectionClass) {

	var minHeight=0;
	var imgDivID='#'+sectionClass+'_markScheme'; //section markscheme container
	var section=$(imgDivID).parents('section');
	/* if a long tab is closed with markscheme open, at the time of click the
	 * height of the section is greater than the height of the markscheme
	 * image, so the section will not shrink. Therefore, reset section height
	 * so that it will shrink to cover just the tabs and then expand
	 * according to the markscheme image*/
	section.height('unset');

	//if markscheme is being viewed, find min height of section to contain
	if ($(imgDivID).hasClass('active')) {
		var imgDivOffsetTop=$(imgDivID).position().top; //distance from top of markscheme to top of section (closest direct ancestor with position: relative)
		var imgDivHeight=$(imgDivID).height(); //height of image (well, container of image, but that is the height of the image)
		minHeight=imgDivOffsetTop+imgDivHeight; //smallest height that section can be to contain all content including open markscheme
	}

	//check if open pos/neg tabs are longer than image
	if(section.find('.tab.active').exists()) {
		var activeTab=section.find('.tab.active'); //locate active tab - should only be one
		var tabHeight=activeTab.height();
		var tabOffsetTop=activeTab.position().top; //distance from top of tab to top of section (closest direct ancestor with position: relative)
		var minHeightForTab=tabHeight+tabOffsetTop; //smallest height that section can be to contain all content including open tab
		if (minHeightForTab>minHeight) { //compare pos/neg tab height to markscheme height and take the larger value
			minHeight=minHeightForTab;
		}
	}

	//set section height
	if (minHeight>section.height()) {
		section.height(minHeight);
	}
	else {
		section.height('unset'); //section will shrink but still contain all content
	}

}

/*
***********************************************************************************
							SAVING FEEDBACK
***********************************************************************************
*/

//compile comments from all boxes
function Compile() {
	$("#compileText").val(""); //clears any previous compilation to prevent duplication

	//loop through all sections and get text from them
	$("section").each(function() {
		var className=$(this).attr('class'); //get section nickname
		if (className==="compile") {
			return true; //ignore compile section - this is the jQuery equivalent to 'continue;' inside an each() loop
		}

		var textId="#"+className+"Text"; //textarea ID corresponding to section
		var textContent=$(textId).val();
		if (textContent==="") { //ignore empty sections
			return true;
		}
		else {
			var sectionName=$("."+className+" h2").text(); //get section display name

			var textToAdd=sectionName+"\r\n"+textContent+"\r\n\r\n";
			$("#compileText").val($("#compileText").val()+textToAdd);
		}
	});
	return $("#compileText").val();
}

//save compiled comments to file
function Save(event) {
	Compile(); //in case user has not compiled before saving
	var name=$(".pdfEmbed").attr("id"); //name of input file, minus extension
	var module=$(".markingWrapper").attr("id"); //name of module
	var compileText=$("#compileText").val(); //compiled comments
	/* Make sure all newlines are \r\n for correct display in .txt file.
	 * To avoid converting \r\n to \r\r\n, first convert all \r\n to \n,
	 * and then convert all \n to \r\n. */
	compileText=compileText.replace(/\r\n/g, "\n");
	compileText=compileText.replace(/\n/g, "\r\n");
	fileHeading="Module name: "+module+"\r\n"+"File name: "+name+"\r\n\r\n"; //header with module and file names
	var val=$('input[name="txtorpdf"]:checked').val(); //get file type choice
	if (val=="pdf") {
		printToPDF(compileText,name,fileHeading);
	}
	else if (val=="txt") {
		textToWrite=fileHeading+compileText;
		printToTXT(textToWrite,name);
	}
	else {
		alert("There was an error.");
	 }
}

//save feedback into PDF format
function printToPDF(text,name,headerText) {
	var filename=name+'.pdf';
	var doc=new jsPDF('p','pt','a4'); //portrait, point measurement, a4
	const totalPagesExp = "{total_pages_count_string}";
	/* jsPDF doesn't like putting page breaks (or line breaks) in raw text, so
	 * all the compiled comments are put into a cell of a table and saved using
	 * the jsPDF-AutoTable plugin, which does do page breaks. The column header
	 * is the module name and the file name. */
	var cols=[{title: headerText,dataKey: "feedback"}];
	var rows=[{"feedback": text}];
	//create table in PDF
	doc.autoTable(cols,rows,{
		pageBreak: 'always',
		theme: 'plain',
		styles: {
			font:'helvetica',
			fontSize: number = 10,
			overflow: 'linebreak',
		},
		addPageContent: data => {
		let footStr = "Page " + doc.internal.getNumberOfPages();
		// Total page number plugin requires use of jspdf v1.0+
		if (typeof doc.putTotalPages === 'function') {
			footStr = footStr + " of " + totalPagesExp;
		}
		doc.setFontSize(10);
		doc.text(footStr, data.settings.margin.left, doc.internal.pageSize.height - 20);
	}
	});

	if (typeof doc.putTotalPages === 'function') {
  doc.putTotalPages(totalPagesExp);
	}

	doc.save(filename);
}

//save feedback into text format
function printToTXT(text,name) {
	var filename=name+'.txt';
	//Blob used to create downloadable file
	var textFileAsBlob=new Blob([textToWrite],{type:'text/plain'});

	/* create link in page that links to file download, then click said link, and delete it.
     * This just appears as a download to the user. */
	var downloadLink=document.createElement("a");
	downloadLink.download=filename; //default save name is filename as defined above
	downloadLink.innerHTML="Download File";
	if (window.URL!=null) {
		downloadLink.href=window.URL.createObjectURL(textFileAsBlob);
	}
	else {
		downloadLink.href=window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick=destroyClickedElement;
		downloadLink.style.display="none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();
}

/*
***********************************************************************************
							PDF LOADING AND DISPLAYING
***********************************************************************************
*/

function getPDF() {
	var name=$('.pdfEmbed').attr("id"); //name of current embedded PDF (if one exists)
	var file;
	var index=-1;
	console.log(name);
	if (name) { //if a file is already present, find which point in the file list that file is at
		var fileList=$('#pdfChoose')[0].files;
		for (var i=0; i<fileList.length; i++) {
			elemName=fileList[i].name; //name of file in list
			if (elemName.indexOf(name)!==-1) { //search that name for the name of the currently embedded PDF, returns -1 if it is not found
				index=i;
				break;
			}
		}
		if (index===-1) { //currently embedded file is no longer in file list, due to a change in selected files
			file=$('#pdfChoose')[0].files[0];
		}
		if (++index>=fileList.length) { //reached end of list
			file=0; //used later
		}
		else {
			file=fileList[index]; //next PDF in list (1 has been added to index by previous if statement)
		}
	}
	else { //if no file already embedded, choose first file in list
		file=$('#pdfChoose')[0].files[0];
	}
	if (file) { //check file exists
		if (!file.name.toLowerCase().endsWith('.pdf'))
		{
			alert('Invalid file type. Please upload .pdf files only.');
			return false;
		}
		//embed PDF and reset page
		url=URL.createObjectURL(file);
		embedPDF(url,file.name);
		setup(); //clear textareas, close all tabs etc
		if ($('section').exists()) { //if a template is loaded, scroll to the top of the marking section to correspond to starting a new PDF
			var secTop=$('section').offset().top; //distance from top of first section to top of document
			$('html,body').animate({scrollTop: secTop},'fast');
		}
	}
	else if (file===0) {
		alert("All files completed.");
	}
	else if (!file) {
		alert("No file present.");
	}
	else {
		alert("There was an error.");
	}
}

//embed PDF
function embedPDF(url,filename) {
	var options = {
		fallbackLink: "<p>This browser does not support embedded PDFs. Please use Google Chrome or view the PDF in another application.</p>"
	}
	PDFObject.embed(url,".pdfEmbed",options);
	//get filename without extension and store as attribute of embedded PDF for later recovery
	var dotLocation=filename.lastIndexOf(".");
	var name=filename.substring(0,dotLocation);
	$(".pdfEmbed").attr("id",name);

	$(".pdfEmbed").height($(window).height());
}

//fix embedded PDF position on page after user scrolls past header
function stickifyPDF() {
	var stickyTop=$(".pdfEmbed").offset().top; //distance from top of PDF to top of page
	$(window).scroll(function() {
		//check if top of scrolled view is below the top of the PDF - if it is, make the PDF fixed on the page
		if ($(window).scrollTop() > stickyTop) {
			$(".pdfEmbed").css({
				position: 'fixed',
				top: '0px',
			});
		}
		else {
			$(".pdfEmbed").css({
				position: 'static',
				top: '0px'
			});
		}
	});
}
