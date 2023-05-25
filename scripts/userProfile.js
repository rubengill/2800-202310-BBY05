firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    // Do something for the user here.
  } else {
    // No user is signed in.
  }
});

var ImageFile; //global variable to store the File Object reference

function chooseFileListener() {
  const fileInput = document.getElementById("mypic-input"); // pointer #1
  const image = document.getElementById("mypic-goes-here"); // pointer #2

  //attach listener to input file
  //when this file changes, do something
  fileInput.addEventListener("change", function (e) {
    //the change event returns a file "e.target.files[0]"
    ImageFile = e.target.files[0];
    var blob = URL.createObjectURL(ImageFile);

    //change the DOM img element source to point to this file
    image.src = blob; //assign the "src" property of the "img" tag
  });
}
chooseFileListener();

chooseFileListener();

function readUserInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      currentUser
        .get()
        .then((doc) => {
          if (doc.exists) {
            var userInfo = doc.data();
            document.getElementById("full-name").value = userInfo.name || "";
            document.getElementById("id").value = userInfo.id || ""; // Updated ID here
            document.getElementById("email").value = userInfo.email || "";
            document.getElementById("genre").value =
              userInfo.favoriteGenre || "";
          } else {
            console.log("No user information found.");
            // Set input fields to empty
            document.getElementById("full-name").value = "";
            document.getElementById("id").value = ""; // Updated ID here
            document.getElementById("email").value = "";
            document.getElementById("genre").value = "";
          }
        })
        .catch((error) => {
          console.error("Error retrieving user information:", error);
        });
    } else {
      console.log("No user currently signed in.");
      // Set input fields to empty
      document.getElementById("full-name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("id").value = ""; // Updated ID here
      document.getElementById("genre").value = "";
    }
  });
}

function saveUserInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;

      // Retrieve the user information from the input fields
      let fullName = document.getElementById("full-name").value;
      let userEmail = document.getElementById("email").value;
      let id = document.getElementById("id").value;
      let genreDropdown = document.getElementById("genre");
      let favoriteGenre = genreDropdown.value;

      // Perform basic field validation
      if (fullName === "" || id === "" || favoriteGenre === "") {
        displayConfirmationMessage("Please fill in all required fields.", true);
        return;
      }

      // Validate email format
      if (!validateEmail(userEmail)) {
        displayConfirmationMessage("Please enter a valid email address.", true);
        return;
      }

      // Update the user information in Firestore
      currentUser
        .update({
          name: fullName,
          email: userEmail,
          id: id,
          favoriteGenre: favoriteGenre,
        })
        .then(() => {
          console.log(
            "User information updated in Firestore for user:",
            userID
          );
          readUserInfo();
          displayConfirmationMessage("User information updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating user information:", error);
          displayConfirmationMessage(
            "An error occurred while updating user information.",
            true
          );
        });
    } else {
      console.log("No user currently signed in.");
    }
  });
}

// Email format validation function
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function displayConfirmationMessage(message, isError = false) {
  var messageElement = document.getElementById("message");
  messageElement.textContent = message;

  if (isError) {
    messageElement.classList.remove("alert-success");
    messageElement.classList.add("alert-danger");
  } else {
    messageElement.classList.remove("alert-danger");
    messageElement.classList.add("alert-success");
  }

  messageElement.style.display = "block";
}

function saveUserPic() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var storageRef = firebase.storage().ref("images/" + user.email + ".jpg");
      var fileInput = document.getElementById("fileInput");
      var ImageFile = fileInput.files[0];

      // Check if a file is selected
      if (ImageFile) {
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
                          populatePicture();
                          fileInput.value = "";
                          displayConfirmationMessage(
                            "Profile picture updated successfully."
                          );
                        })
                        .catch(function (error) {
                          console.error(
                            "Error updating profile picture URL in Firestore:",
                            error
                          );
                          displayConfirmationMessage(
                            "An error occurred while updating the profile picture.",
                            true
                          );
                        });
                    });
                  })
                  .catch(function (error) {
                    console.error(
                      "Error querying user document in Firestore:",
                      error
                    );
                    displayConfirmationMessage(
                      "An error occurred while updating the profile picture.",
                      true
                    );
                  });
              })
              .catch(function (error) {
                console.error(
                  "Error getting download URL from Firebase Storage:",
                  error
                );
                displayConfirmationMessage(
                  "An error occurred while updating the profile picture.",
                  true
                );
              });
          })
          .catch(function (error) {
            console.error("Error uploading image to Firebase Storage:", error);
            displayConfirmationMessage(
              "An error occurred while updating the profile picture.",
              true
            );
          });
      } else {
        console.log("No file selected.");
        displayConfirmationMessage("No file selected.", true);
      }
    } else {
      console.log("No user currently signed in.");
      displayConfirmationMessage("No user currently signed in.", true);
    }
  });
}

function populatePicture() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const currentUser = db.collection("users").doc(user.uid);

      currentUser
        .get()
        .then((userDoc) => {
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
        .catch((error) => {
          console.error("Error retrieving profile picture URL:", error);
        });
    } else {
      console.log("No user is currently logged in");
    }
  });
}

populatePicture();

function changePassword() {
  var newPassword = document.getElementById("new-password").value;
  var confirmPassword = document.getElementById("confirm-password").value;

  // Check if the new password and confirm password match
  if (newPassword !== confirmPassword) {
    console.log("New password and confirm password do not match");
    return;
  }

  var user = firebase.auth().currentUser;

  // Update the password
  user
    .updatePassword(newPassword)
    .then(() => {
      console.log("Password changed successfully");
      displayConfirmationMessage("Password changed successfully.");
      // Redirect the user or show a success message
    })
    .catch((error) => {
      console.error("Error changing password:", error);
      displayConfirmationMessage(
        "An error occurred while changing the password.",
        true
      );
      // Handle the error appropriately
    });
}
