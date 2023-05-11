firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    // Do something for the user here. 
  } else {
    // No user is signed in.
  }
});

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
            var userInfo = doc.data()
            document.getElementById("full-name").value = userInfo.name || '';
            document.getElementById("id").value = userInfo.id || '';
            document.getElementById("email").value = userInfo.email || '';
            document.getElementById("genre").value = userInfo.favoriteGenre || '';
          } else {
            console.log("No user information found.");
            // Set input fields to empty
            document.getElementById("full-name").value = '';
            document.getElementById("id").value = '';
            document.getElementById("email").value = '';
            document.getElementById("genre").value = '';
          }
        })
        .catch(error => {
          console.error("Error retrieving user information:", error);
        });
    } else {
      console.log("No user currently signed in.");
      // Set input fields to empty
      document.getElementById("full-name").value = '';
      document.getElementById("email").value = '';
      document.getElementById("mobile").value = '';
      document.getElementById("genre").value = '';
    }
  });
}

function saveUserPic() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var storageRef = firebase.storage().ref("images/" + user.email + ".jpg");
      var fileInput = document.getElementById("fileInput");
      var ImageFile = fileInput.files[0];

      // Asynchronous call to put File Object onto Cloud Storage
      storageRef
        .put(ImageFile)
        .then(function (snapshot) {
          console.log("Uploaded to Cloud Storage.");

          // Asynchronous call to get the download URL of the uploaded image
          storageRef
            .getDownloadURL()
            .then(function (url) {
              // Get the download URL of the uploaded image

              // Asynchronous call to save the download URL into Firestore
              firebase
                .firestore()
                .collection("users")
                .where("email", "==", user.email)
                .get()
                .then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    doc.ref
                      .update({
                        profilePic: url, // Save the download URL into the "users" collection
                      })
                      .then(function () {
                        console.log("Added Profile Pic URL to Firestore.");
                        document.getElementById("personalInfoFields").disabled = true;
                      })
                      .catch(function (error) {
                        console.error("Error updating profile picture URL in Firestore:", error);
                      });
                  });
                })
                .catch(function (error) {
                  console.error("Error querying user document in Firestore:", error);
                });
            })
            .catch(function (error) {
              console.error("Error getting download URL from Firebase Storage:", error);
            });
        })
        .catch(function (error) {
          console.error("Error uploading image to Firebase Storage:", error);
        });
    } else {
      console.log("No user currently signed in.");
    }
  });
}

function populatePicture() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const currentUser = db.collection("users").doc(user.email);

      currentUser
        .get()
        .then(userDoc => {
          const userProfile = userDoc.data();
          const picUrl = userProfile && userProfile.profilePic;
          
          if (picUrl) {
            // Set the image source
            const imgElement = document.getElementById("mypic-goes-here");
            imgElement.src = picUrl;
          } else {
            console.log("Profile picture URL is missing or empty");
          }
          
        })
        .catch(error => {
          console.error("Error retrieving profile picture URL:", error);
        });
    } else {
      console.log("No user is currently logged in");
    }
  });
}

populatePicture();
