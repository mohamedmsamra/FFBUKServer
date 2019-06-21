<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'SWiFT') }}</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    {{-- <link rel="stylesheet" type="text/css" href="../css/generalstyle.css"/> --}}
    <link rel="stylesheet" type="text/css" href="../css/newMarking.css"/>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    
    {{-- Scripts --}}
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
    <div id="app">
        @include('inc.navbar')
        <div>
            {{-- <main class="py-4"> --}}
                @include('inc.messages')
                <h2>Marking</h2>
                <div>
                    {{-- PDF display side --}}
                    <div class="leftSide">
                            <div class="pdfUpload">
                                <form>
                                    <div class="input-group mb-3">
                                        <div class="custom-file">
                                            <input type="file" class="custom-file-input" name="pdfChoose" id="pdfChoose" accept=".pdf" multiple >
                                            <label class="custom-file-label" for="inputGroupFile01">Choose files to mark</label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            
                            <div class="clear" style="height: 10px"></div>
                            
                            <div class="pdfEmbed"></div> <!--Filled by tabtoggle.js on upload to PDFChoose-->
                    </div>

                    {{-- Template marking side --}}
                    <div class="rightSide">
                        <div id="react-root"></div>
                        
                        <div class="save">
                            <button type="button" class='btn btn-danger' onclick="if(confirm('All entered text will be deleted. Are you sure?')) setup()" id="clearButton">Clear All</button>
                            <button type="button" class='btn btn-success' onclick="Save(event); getPDF()" id="nextButton">Save and Load Next Document</button>
                            Save as:
                            <input type="radio" name="txtorpdf" value="pdf" checked="checked">PDF</input>
                            <input type="radio" name="txtorpdf" value="txt">Text</input>
                        </div>
                        
                        </div>
                        
                    </div>
                    <div class="clear"></div>
                    <div></div>
                </div>
            {{-- </main> --}}
         </div>
    </div>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}"></script>
    <script src="/vendor/unisharp/laravel-ckeditor/ckeditor.js"></script>
    <script>
      CKEDITOR.replace( 'article-ckeditor' );
    </script>
    <script type="text/jsx" src="/marking_app/Section.js"></script>
    <script type="text/jsx" src="/marking_app/App.js"></script>
    <script type="text/jsx" src="/marking_app/index.js"></script>

</body>
</html>
