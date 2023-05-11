// Initialize Firebase Firestore
firebase.initializeApp(config);
var db = firebase.firestore();

var ImageFile;      //global variable to store the File Object reference

function chooseFileListener(){
    const fileInput = document.getElementById("mypic-input");   // pointer #1
    const image = document.getElementById("mypic-goes-here");   // pointer #2

    //attach listener to input file
    //when this file changes, do something
    fileInput.addEventListener('change', function(e){

        //the change event returns a file "e.target.files[0]"
	      ImageFile = e.target.files[0];
        var blob = URL.createObjectURL(ImageFile);

        //change the DOM img element source to point to this file
        image.src = blob;    //assign the "src" property of the "img" tag
    })
}
chooseFileListener();

function saveUserInfo() {
    let fullName = document.getElementById("full-name").value;
    let userEmail = document.getElementById("email").value;
    let userMobile = document.getElementById("mobile").value;
    let favoriteGenre = document.getElementById("genre").value;
  
    console.log(fullName, userEmail, userMobile, favoriteGenre);
  
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;
  
        // Update the user information in Firestore
        currentUser.update({
          fullName: fullName,
          email: userEmail,
          mobile: userMobile,
          favoriteGenre: favoriteGenre
        })
          .then(() => {
            console.log('User information updated in Firestore for user:', userID);
            // Reset the form after saving
            document.getElementById('full-name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('mobile').value = '';
            document.getElementById('genre').value = '';
          })
          .catch(error => {
            console.error('Error updating user information:', error);
          });
      } else {
        console.log('No user currently signed in.');
      }
    });
  }
  