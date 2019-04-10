<!DOCTYPE html>
<html>
	<head>
		<title>SWiFT</title>
		<link rel="shortcut icon" type="image/x-icon" href="../img/Tab_Icons/favicon.ico" />
		<link rel="stylesheet" type="text/css" href="../css/generalstyle.css"/>
		<script src="{{ asset('../js_ffbuk/jquery-3.2.1.min.js') }}"></script>
		<script src="{{ asset('../js_ffbuk/jspdf.min.js') }}"></script>
		<script src="{{ asset('../js_ffbuk/jspdf.plugin.autotable.js')}}"></script>
		
		<script src="{{ asset('../js_ffbuk/pdfobject.js')}}"></script>
		<script src="{{ asset('../js_ffbuk/marking.js')}}"></script>
		
		<!-- zip file library -->
		<script src="{{ asset('../js_ffbuk/jszip.js')}}"></script>
		<script src="{{ asset('../js_ffbuk/fileSaver.js')}}"></script>
		<script mimeType=text/plain; charset=x-user-defined src="{{ asset('../js_ffbuk/jszip-utils.js')}}"></script>
	</head>
	
	<body>
		<header>
			<div>
				<b><p style="font-size:150%;">SoftWare Integrated Feedback Tool (SWiFT) - Marking Made Easier</p></b>
				<br>
				<a href="../courses/2" style="color: blue">&larr; Return to Course Page</a>
			</div>    
		</header>
		<br><br><br>
		
		<div class="pdfUpload">
		<form>
			<strong>File to mark:</strong>
			<input type="file" name="pdfChoose" id="pdfChoose" accept=".pdf" multiple />
		</form>
		</div>
		<div class="tempUpload">
		<form>
			<strong>Marking template (zip file):</strong>
			<input type="file" name="tempChoose" id="tempChoose" accept=".zip"/>
		</form>
		</div>
		<div class="clear" style="height: 10px"></div>
		
		<div class="pdfEmbed"></div> <!--Filled by tabtoggle.js on upload to PDFChoose-->
		
		<div class="markingWrapper"> <!--Hidden until a template is chosen, including save buttons-->
		<div class="sectionContainer"> <!--Filled by fillform.js on upload to tempChoose-->
		</div>
		
		<div class="save">
			<button type="button" onclick="if(confirm('All entered text will be deleted. Are you sure?')) setup()" id="clearButton">Clear All</button>
			<button type="button" onclick="Save(event); getPDF()" id="nextButton">Save and Load Next Document</button>
			Save as:
			<input type="radio" name="txtorpdf" value="pdf" checked="checked">PDF</input>
			<input type="radio" name="txtorpdf" value="txt">Text</input>
		</div>
		
		</div>
		<div class="clear"></div>
		<footer></footer>
		
	</body>
</html>
<style>
	* {
	font-family: Calibri, Arial, sans-serif;
}

html {
	font-size: 18px;
}

header a, header a:visited, header a:hover {
	text-decoration: none;
	color: black;
}

section {
	padding: 20px;
	border: 3px solid gray;
	border-radius: 15px;
	margin: 20px 0px;
	position: relative;
}

select {
	font-size: 1rem;
}

textarea {
	width: 90%;
	font-size: 1rem;
}

a:visited {
	text-decoration: none;
}

a {
	text-decoration: none;
}

.pdfEmbed, .pdfUpload {
	box-sizing: border-box;
	width: 50%;
	float: left;
	padding-right: 10px;
}

.markingWrapper, .tempUpload {
	box-sizing: border-box;
	width: 50%;
	float: right;
	padding-left: 10px;
}

.clear {
	clear: both;
}

footer {
	height: 50px;
}

section h2 {
	float: left;
	display: inline;
	margin: 0;
}

.markShow {
	display: inline;
	font-size: 80%;
	float: right;
}

.markShow a:visited {
	color: blue;
}

.markScheme {
	display: none;
}

.markScheme.active {
	display: block;
	position: absolute;
	right: 5px;
	z-index: 1;
}

ol li {
	cursor: pointer;
}


/* pos/neg tab formatting */

.tabs {
	width: 100%;
	display: inline-block;
}

.tab-links ul {
	margin: 0;
}

.tab-links li {
	margin: 0px 5px;
	float: left;
	list-style: none;
	width: 40%;
	text-align: center;
	font-weight: bold;
	font-size: 1.1rem;
	height: 2.25rem;
}

.tab-links a {
	color: black;
	display: inline-block;
	border-radius: 15px;
	text-decoration: none;
	width: 100%;
	height: 2.25rem;
	line-height: 2.25rem;
}

.tab-links a:visited {
	color: black;
	text-decoration: none;
}

.tab {
	display: none;
}

.tab.active {
	display: block;
}

.negative {
	/*background-color: #D61D00;*/
	border: 2px solid #D61D00;
	border-radius: 15px;
}

.positive {
	/*background-color: #009E30;*/
	border: 2px solid #009E30;
	border-radius: 15px;
}

/* markscheme tab formatting*/
.markScheme.tab-links li {
	font-size: 80%;
	width: 100%;
	list-style: none;
	margin: 0px;
	font-weight: normal;
	height: 1rem;
	display: inline-block;
	float: none;
}

.markScheme.tabs {
	width: 45%;
	display: none;
}

.markScheme.tabs.active{
	display: inline-block;
}

.markScheme.tab-links a {
	color: blue;
	border-radius: 0px;
	height: 1rem;
	line-height: 1rem;
	display: inline-block;
	width: 100%;
}

.markScheme.tab-links a:visited {
	color: blue;
}

img {
	max-width: 50vw;
	max-height: 75vh;
}

.markScheme img {
	max-width: 22.5vw;
	min-width: 200px;
	max-height: none;
}

.clearSec {
	float: right;
	margin-top: 5px;
}

#tempChoose {
	color: transparent;
	width: 90px;
}
</style>