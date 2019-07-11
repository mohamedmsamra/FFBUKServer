<!DOCTYPE html>
<html>
	<style>
	iframe {
		height: 400px;
		width: 715px;
	}
	</style>
	<head>
		<title>Fast Feedback UK (fFBUK)</title>
		<link rel="shortcut icon" type="image/x-icon" href="../img/Tab_Icons/favicon.ico" />
		<link rel="stylesheet" type="text/css" href="../css/generalstyle.css"/>
		<script src="../js/jquery-3.2.1.min.js"></script>
		<script src="../js/tabtoggle.js"></script>
	</head>
	<body>
		<header>
			<div>
			<a href="../courses">
				<p style="float: left;"><img src="{{ asset('stuff/icons8-exam-50.png') }}" height="150px" width="150px"></p>
				<br><br><br>
				<b><p style="font-size:150%;">Fast FeedBack UK (fFBUK)</p></b>
				<br>
				<p style="color: blue"> &larr; Return to Homepage</p>
			</a>
			</div>    
		</header>
		<br><br><br>
		
		<section>
		<h1>Tutorial Videos</h1>
		<p>This series of videos will take you through all the functionality of the fFBUK software. Click on the icon in the top left of the video to skip to other videos in the playlist.</p>
		<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PL3k51Gbd96lYLxLhES9asWtfWisC70hfV" frameborder="0" allowfullscreen>
		</iframe>
		</section>

		<section>
		<h1>Frequently Asked Questions</h1>
		<strong>Why isn't the PDF loading?</strong>
		<p>The software requires you use an up-to-date version of Google Chrome. To update or check the version of Google Chrome, follow the instructions <a href="https://support.google.com/chrome/answer/95414?co=GENIE.Platform%3DDesktop&hl=en">here</a>.</p>
		<strong>Why isn't my template/feedback saving?</strong>
		<p>Did any error messages appear when you clicked 'Save Form'? You must make sure all sections are completed.</p>
		<p>If no error messages appear but the download does not start, check that you have not blocked downloads for the page. If you have blocked downloads, there will be a red icon on the right end of the URL bar. Click this to change the download settings to allow downloads from the page.</p>
		</section>
		
		<section>
		<h1>Further Queries</h1>
		<p>If you have a question that isn't answered here, please contact us at&nbsp;<a href="mailto:ffbukcontact@gmail.com">ffbukcontact@gmail.com</a>.</p>
		</section>		
		
		<br><br>
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
