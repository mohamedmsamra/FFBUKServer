<!DOCTYPE html>
<html>
	<head>
		<title>SWiFT</title>
		<link rel="shortcut icon" type="image/x-icon" href="../img/Tab_Icons/favicon.ico" />
		<link rel="stylesheet" type="text/css" href="../css/generalstyle.css"/>
		<link rel="stylesheet" type="text/css" href="../css/marking.css"/>
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
		<script src="{{ asset('../js_ffbuk/jquery-3.2.1.min.js') }}"></script>
		<script src="{{ asset('../js_ffbuk/jspdf.min.js') }}"></script>
		<script src="{{ asset('../js_ffbuk/jspdf.plugin.autotable.js')}}"></script>
		
		<script src="{{ asset('../js_ffbuk/pdfobject.js')}}"></script>
		<script src="{{ asset('../js_ffbuk/marking.js')}}"></script>
		
		<!-- zip file library -->
		<script src="{{ asset('../js_ffbuk/jszip.js')}}"></script>
		<script src="{{ asset('../js_ffbuk/fileSaver.js')}}"></script>
		<script mimeType=text/plain; charset=x-user-defined src="{{ asset('../js_ffbuk/jszip-utils.js')}}"></script>
		<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
		<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
		<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script> {{-- TODO: Only temporary --}}
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
		<div id="react-root"></div>
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
		<script type="text/jsx" src="/marking_app/Section.js"></script>
		<script type="text/jsx" src="/marking_app/App.js"></script>
		<script type="text/jsx" src="/marking_app/index.js"></script>
	</body>
</html>