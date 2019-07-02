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
   .react('./resources/js/assignments_table/index.js', './public/builds/js/assignments_table/')
   .sass('resources/sass/app.scss', 'public/builds/css');