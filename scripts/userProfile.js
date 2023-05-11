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

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;

      // Update the user information in Firestore
      currentUser
        .update({
          fullName: fullName,
          email: userEmail,
          mobile: userMobile,
          favoriteGenre: favoriteGenre
        })
        .then(() => {
          console.log("User information updated in Firestore for user:", userID);
        })
        .catch(error => {
          console.error("Error updating user information:", error);
        });
    } else {
      console.log("No user currently signed in.");
    }
  });
}

function readUserInfo() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      currentUser
        .get()
        .then(doc => {
          if (doc.exists) {
            var userInfo = doc.data();
            document.getElementById("full-name").value = userInfo.fullName;
            document.getElementById("email").value = userInfo.email;
            document.getElementById("mobile").value = userInfo.mobile;
            document.getElementById("genre").value = userInfo.favoriteGenre;
          } else {
            console.log("No user information found.");
          }
        })
        .catch(error => {
          console.error("Error retrieving user information:", error);
        });
    } else {
      console.log("No user currently signed in.");
    }
  });
}
