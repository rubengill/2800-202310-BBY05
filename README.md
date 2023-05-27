# Project Title
Guitar Genius 

## 1. Project Description
Our team, BBY5, is developing GuitarGenius, an application aimed at guitarists who are trying to improve their guitar skills by offering a catered and customized learning experience.

## 2. Names of Contributors
*  Ruben Gill 
*  Joseph Louwerse - Hello
*  Markus Lum-De Guzman, lets have some fun! o7
*  Jeffery M Joseph 
	
## 3. Technologies and Resources Used
* HTML
* CSS
* JavaScript
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* Puppeteer
* Song Tablature were retrieved from songsterr.com, with permission from our instructor. 
* Puppeteer API

## 4. Complete setup/installion/usage
Here are the steps ...
* First, we click on the Signup/Login button on the introductory page
* Then we are redirected to the login page, where we are asked to input our credentials or make new account credentials
* Upon clicking Continue, we are taken to the Main page of the app
* Here, we have access to the Practice Room by clicking 'Begin Lesson'
* The Practice Room assigns 5 songs to the user as a challenge, they are asked to try playing those songs in their own time
* The second icon in the footer redirects us to the Friends page, where we can search for and/or remove friends
* The third icon is our Search page, where users can search for whatever song they desire
* The fourth icon, is the Favorites page, where the user can view songs that they have saved for easy access
* The fifth icon is the Settings page, from where the user has the option to signout of their current account and is redirected to the login page
* Lastly, the first icon sends us back to the Main page
* If the user wants to access/modify their profile info, the 'Profile' button on the top-right corner will help them do just that
* The user can change their Email ID, username, favorite genre and even their password

## 5. Known Bugs and Limitations
Here are some known bugs:
* We're not able to pull the entirety of the tabs from the source
* We're not able to pull the guitar tabs for some of the songs
* Our Tab Pull API and 404 page wouldn't work together due to optimization issues, so we excluded the 404 page from the path temporarily
* If you exit the practice room, the completed task is not saved.

## 6. Features for Future
What we'd like to build in the future:
* A more visually attractive UI. 
* Figure out how to pull the entire guitar tab. 
* Display the activities that were recommended to other users. 
* Format the pulled tablature to look nicer. 
* Generate 5 new random songs for the current user every day at 12:01 AM
	
## 7. Contents of Folder
Content of the project folder:

```
 Top level of project folder: 
├── app                      # Folder for HTML & json files
    /data                    # Subfolder for json files
        /questions.JSON      # Contains the questionaire questions in JSON format. 
    /html                    # Subfolder for HTML files
        /404.html            # HTML file for 404 page
        /aboutus.html        # HTML file for About us page (accessed on clicking logo when logged in)
        /addFriend.html      # HTML file for Searching and Adding friends
        /favourties.html     # HTML file for viewing Favourited songs
        /index.html          # HTML file for Index page before sign-in
        /login.html          # HTML file for Logging in
        /main.html           # HTML file for Welcome page
        /practiceRoom.html   # HTML file for Practice Room
        /privacyPolicy.html  # HTML file for Privacy Policy
        /questions.html      # HTML file for Skill Assessment
        /settings.html       # HTML file for Logout button (accessed via Settings icon)
        /social.html         # HTML file for Viewing Friends
        /tab.html            # HTML file for Searching songs from Kaggle Dataset
        /template.html       # HTML template file
        /tos.html            # HTML file for Terms of Service
        /userProfile.html    # HTML file for User Profile
        /userskill.html      # HTML file for displaying User Skill Assessment result

├── public                   # Folder for CSS & image files
    /css                     # Folder for CSS files
        /404.css             # CSS file for 404 page elements
        /aboutus.css         # CSS file for About us page
        /footer.css          # CSS file for Footer elements
        /index.css           # CSS file for Index page elements
        /login.css           # CSS file for Firebase login contents
        /main.css            # CSS file for Welcome page contents
        /practiceRoom.css    # CSS file for Practice Room contents
        /privacyPolicy.css   # CSS file for Privacy Policy page
        /questions.css       # CSS file for Skill Assessment questions
        /settings.css        # CSS file for Settings page
        /social.css          # CSS file for Social page
        /tos.css             # CSS file for Terms of Service page
        /userProfile.css     # CSS file for User Profile page
        /userSkill.css       # CSS file for Skill Assessment results

    /img                     # Folder for HTML files
        /acdc.jpg            # Image for Easter Egg
        /bg.png              # Image for Index page
        /bowie.jpg           # Image for Easter Egg
        /home.svg            # Image for Footer icons
        /jeff.jpg            # Image for About us page
        /jimi.jpg            # Image for Easter Egg
        /jimi.png            # Image for Easter Egg
        /joe.jpg             # Image for About us page
        /list.svg            # Image for Footer icons
        /logo_transparent.png    # Image for Header
        /markus-ok.png       # Image for Easter Egg
        /markuz.jpeg         # Image for About us page
        /music note.jpg      # Image for Easter Egg
        /profileplaceholder.png  # Image for Profile page
        /search.svg          # Image for Footer icons
        /setting.svg         # Image for Footer icons
        /star.svg            # Image for Footer icons
        /taylor.jpg          # Image for Easter Egg
        /taylor.webp         # Image for Easter Egg

├── scripts                  # Folder for JavaScript files
    /addFriend.js            # Client Side Javascript to add friends
    /addQuestions.js         # Client Side Javascript to add the questions.JSON questions to firestore
    /authentication.js       # Client Side Javascript that uses Firebase to authenticate users, and store them in firestore
    /favourites.js           # Client Side Javascript that adds searched songs to the favourites sub collection of the current user
    /getRanSong.js           # Client Side Javascript that pulls a random song from the current users songs sub collection 
    /guitarTab.js            # Client Side Javascript that pulls a section of tablature when the view tab button is clicked in the activity room 
    /loginHeader.js          # Client Side Javascript that shows the proper header if the is not logged in
    /main.js                 # Client Side Javascript that shows the users name, song of the day and presents the begin lesson button
    /questionBlock.js        # Client Side Javascript that blocks the skill assessment questionaire if it has already been completed
    /randomSong.js           # Client Side JavascriptAssigns that assigns users 5 random songs if their songs sub collection is empty 
    /retrieveName.js         # Client Side Javascript that retrieves the name of the current user and injects it in the HTML
    /searchSong.js           # Client Side Javascript that searches the Kaggle dataset for a song match and returns it if there is a match
    /session.js              # Client Side Javascript that checks if the user is currently signed in 
    /skeleton.js             # Client Side Javascript that injects the footer and navbar into the HTML pages
    /skillAssessment.js      # Client Side Javascript that shows the users the questions from the questionaire
    /social.js               # Client Side Javascript that shows current friends, and allows you to remove them 
    /userProfile.js          # Client Side Javascript that allows the user to edit their profile
    /userSkillLevel.js       # Client Side Javascript that calculates the users skill level 
|    
├── template                 # Folder for Header & Footer templates
├── .gitignore               # Git ignore file
├── index.js                 # JavaScript file containing server side JavaScript
├── package-lock.json        # json file for all the node modules
├── package.json             # json file for all the node modules
└── README.md                # Read Me Folder
```

## 8. Image Reference