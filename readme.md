<h1 align="center">SWiFT</h1>

## What is SWiFT?
SWiFT is a web application built with students in mind. Most students feel dissatisfied with the feedback they receive at University. SWiFT can be used by module leads to create feedback templates they can then share with their Postgraduate Teaching Assistant to ensure a standard structure and increased quality for the feedback. SWiFT can also increase productivity and decrease the time spent marking each assignment.

![SWiFT ScreenShot](/svg/swift-ss.png)

### Functionality
* Users can create courses.
* Courses can have multiple assignments. 
* Courses can be shared with other users with 2 different permission levels: read only and read/write. 
* Assignments are used to produce feedback and mark student work. 
* Assignments are made up of sections. 
* In sections, you write the feedback. 
* Sections can have lists of comments that are predefined, so you can add them easily to your feedback. These are useful and speed thing up if, for instance, there is a common mistake students make then you can create a comment for that and use it whenever appropriate without having to type it every time. 
* The course owner can create new assignments, edit them and remove them. 
* The course owner can give, change and remove permissions to other users.
* Users with read/write permission can edit the content of assignments.
* Both the owner and the read/write permission users can add public or private comments to sections. 
* Public comments are comments that will be available to all other users who have access to the course. 
* Private comments are comments that are only available to the user who created them.
* Users with read-only permissions can see assignments and use them for marking. They can also create private comments.
* All users who have access to a course also have access to analytics for all assignments in the course.
* The course owner can see analytics concerning all the users in the course.
* Users that the course is shared with can only see their personal analytics. 

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
The libraries this project uses include:
* ```react-alert``` for interactive alerts. See documentation [here](https://www.npmjs.com/package/react-alert).
* ```chart.js``` for charts on the Analytics page. Use this library to add more charts. See documentation [here](https://www.chartjs.org/).
* ```dateformat``` for formatting dates in React throughout the project. See documentation [here](https://www.npmjs.com/package/dateformat).
* ```interactjs``` for resizing the pdf and marking side on the Marking page. It has many useful features such as drag and drop, which could be used in the future to reorder sections and comments in Marking. See documentation [here](https://interactjs.io/).
* ```jspdf``` to generate the PDFs for exporting in Marking. The compiled comments and list of marks are both generated using this library. The library supports generating a PDF from HTML code. See documentation [here](https://www.npmjs.com/package/jspdf).
* ```react-bootstrap``` to conveniently add Bootstrap components in React. See documentation [here](https://react-bootstrap.github.io/).
* ```react-quill``` is a Quill component for React. Quill is a JavaScript rich text editor that we are using in Marking and the page for creating courses. See Quill documentation [here](https://quilljs.com/). See react-quill documentation [here](https://www.npmjs.com/package/react-quill).

## Our Custom Components
* ```withTable.js``` is a React Higher Order Component, that we have written to create the tables with the loading effects. In addition, the component allows an easy creation of a Bootstrap table. The documentation of using the component can be found in the file itself (```/resources/js/global_components/withTable.js```).
* ```ConfirmableAlertTemplate.js``` is a template we have written to be used with the ```react-alert``` library. As the library doesn't support alerts with 'Confirm' and 'Cancel' buttons by default, instead of passing the text of the message by itself to the alert, we are also passing the on click functions for the buttons along with the text of the alert, wrapped in an object. The template creates these buttons when these functions are present. See the instructions on how to use in ```/resources/js/global_components/ConfirmableAlertTemplate.js```, and examples throughout the project.

## Future plans
In the future, we would like to add the following imporvements to the website:
* add email verification middleware to pages (restrict access if email is not verified)
* add the ability to reorder sections and comments
* make it possible to edit the course title and description
* redesign course page to be more user friendly
* improve analytics (statistical outliers for averages, only track marking time when the page is actually used)
* add a more interactive pdf display library (that allows highlighting for instance)
* use a consistent color scheme across the website to give it a recognisable identity

