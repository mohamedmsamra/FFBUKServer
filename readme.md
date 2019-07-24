<h1 align="center">SWiFT</h1>

## Project Setup
* Create a database for the project
* Download composer https://getcomposer.org/download/
* Pull the project from git
* Rename ```.env.example``` file to ```.env``` inside your project root and fill the database information. (windows wont let you do it, so you have to open your console cd your project root directory and run ```mv .env.example .env``` )
* Open the console and cd your project root directory
* Run composer install or php composer.phar install
* Run ```php artisan key:generate```
* Run ```php artisan storage:link``` to create a symlink to storage in the public directory
* Run ```php artisan migrate```
* Run ```php artisan db:seed``` to run seeders, if any.
* Run ```php artisan serve```
* Run ```npm install``` to install the dependencies
* Run ```npm run dev``` to compile the project

## Libraries
The following libraries are used within the project:
* [```react-alert```](https://www.npmjs.com/package/react-alert) for interactive alerts.

## Our Custom Components
* ```withTable.js``` is a React Higher Order Component, that we have written to create the tables with the loading effects. In addition, the component allows an easy creation of a Bootstrap table. The documentation of using the component can be found in the file itself (```/resources/js/global_components/withTable.js```).
* ```ConfirmableAlertTemplate.js``` is a template we have written to be used with the ```react-alert``` library. As the library doesn't support alerts with 'Confirm' and 'Cancel' buttons by default, instead of passing the text of the message by itself to the alert, we are also passing the on click functions for the buttons along with the text of the alert, wrapped in an object. The template creates these buttons when these functions are present. See the instructions on how to use in ```/resources/js/global_components/ConfirmableAlertTemplate.js```, and examples throughout the project.