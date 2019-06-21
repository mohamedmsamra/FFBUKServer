<!DOCTYPE html>
<html>
<head>
	<title>Api Test</title>
    <script
  src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
  integrity="sha256-pasqAKBDmFT4eHoN2ndd6lN370kFiGUFyTiUHWhU7k8="
  crossorigin="anonymous"></script>
  <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <form>
        Location:<br>
        <input type="text" id="location" name="location" value="/api/"><br>
        Data:<br>
        <input type="text" id="data" name="data" value="{}">
    </form>
    <input type="submit" id="submitGet" value="GET">
    <input type="submit" id="submitPost" value="POST">
    <script>
        $('#submitGet').click(() => {
            fetch($('#location').val())
                .then(data => data.json())
                .then(data => console.log(data));
        });

        $('#submitPost').click(() => {
            fetch($('#location').val(), {
                method: 'post',
                body: $("data").val(),
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                console.log(data);
            });
        });

        function get(loc) {
            fetch(loc)
                .then(data => data.json())
                .then(data => console.log(data));
        }

        function post(loc, data) {
            fetch(loc, {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text-plain, */*",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
                }
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                console.log(data);
            });
        }
    </script>
    <style>
        input {
            width: 100%;
        }
    </style>
</body>
</html>