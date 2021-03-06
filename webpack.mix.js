const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

// mix.react('resources/js/app.js', 'public/js')
mix.react('./resources/js/marking_app/index.js', './public/builds/js/marking_app/')
   .react('./resources/js/course_page/index.js', './public/builds/js/course_page/')
   .react('./resources/js/statistics_page/index.js', './public/builds/js/statistics_page/')
   .react('./resources/js/create_course_form/index.js', './public/builds/js/create_course_form/')
   .sass('resources/sass/app.scss', 'public/builds/css');