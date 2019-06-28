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
    <link href="https://fonts.googleapis.com/css?family=Montserrat|Raleway&display=swap" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('builds/css/app.css') }}" rel="stylesheet">
    {{-- <link rel="stylesheet" type="text/css" href="../css/generalstyle.css"/> --}}
    <link rel="stylesheet" type="text/css" href="../css/newMarking.css"/>

    {{-- Bootstrap --}}
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    {{-- <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"> --}}
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    
    {{-- Font Awesome icons --}}
    <script src="https://kit.fontawesome.com/736a6a7946.js"></script>

    
    
    <script src="{{ asset('../js_ffbuk/pdfobject.js')}}"></script>
    <script src="{{ asset('../js_ffbuk/marking.js')}}"></script>

    <!-- zip file library -->
    <script src="{{ asset('../js_ffbuk/jszip.js')}}"></script>
    <script src="{{ asset('../js_ffbuk/fileSaver.js')}}"></script>
    <script mimeType=text/plain; charset=x-user-defined src="{{ asset('../js_ffbuk/jszip-utils.js')}}"></script>

    {{-- <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script> --}} {{-- TODO: Only temporary --}}
	<meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <div id="app">
        @include('inc.navbar')
        <div>
            {{-- <main class="py-4"> --}}
                @include('inc.messages')
                <h2>{{ $assignment['name'] }}</h2>
                <div>
                    {{-- PDF display side --}}
                    <div class="leftSide">
                            <div class="pdfUpload">
                                <form>
                                    <div id="select-pdfs" class="input-group mb-3">
                                        <div class="custom-file">
                                            <input type="file" class="custom-file-input" name="pdfChoose" id="pdfChoose" accept=".pdf" multiple >
                                            <label class="custom-file-label" for="inputGroupFile01">Choose files to mark</label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            
                            <div class="clear" style="height: 10px"></div>
                            
                            {{-- <embed id="myEmbed" src="/Report 1.pdf" width= "500" height= "375"> --}}

                            <div class="pdfEmbed"></div> <!--Filled by tabtoggle.js on upload to PDFChoose-->
                    </div>

                    {{-- Template marking side --}}
                    <div class="rightSide">
                        <div id="react-root"></div>
                        
                        {{-- <div class="save">
                            <button type="button" class='btn btn-danger' onclick="if(confirm('All entered text will be deleted. Are you sure?')) setup()" id="clearButton">Clear All</button>
                            <button type="button" class='btn btn-success' onclick="Save(event); getPDF()" id="nextButton">Save and Load Next Document</button>
                            Save as:
                            <input type="radio" name="txtorpdf" value="pdf" checked="checked">PDF</input>
                            <input type="radio" name="txtorpdf" value="txt">Text</input>
                        </div> --}}
                        
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
    <script>
        const assignment_id = {{ $assignment['id'] }};
    </script>
    {{-- <script type="text/jsx" src="/marking_app/components/modals/CreateTemplateModal.js"></script>
    <script type="text/jsx" src="/marking_app/components/modals/LoadTemplateModal.js"></script>
    <script type="text/jsx" src="/marking_app/components/Loading.js"></script>
    <script type="text/jsx" src="/marking_app/components/modals/NewSectionModal.js"></script>
    <script type="text/jsx" src="/marking_app/components/Section.js"></script>
    <script type="text/jsx" src="/marking_app/App.js"></script> --}}
    <script src="/builds/js/marking_app/index.js"></script>
</body>
</html>
