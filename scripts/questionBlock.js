firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in, check if they have a skill level
      db.collection('users').doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            // Check if the user has a skill level
            const userData = doc.data();
            if (userData.skillLevel) {
              // If the user has a skillLevel, they have already completed the questionnaire
              console.log("User has already completed the questionnaire.");
  
              // Redirect to main page
              window.location.assign("/main"); // Replace with your main page URL
            } else {
              // If the user does not have a skillLevel, show the page content
              document.getElementById("page-content").style.display = "block";
            }
          } else {
            console.error("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    } else {
      // No user is signed in, redirect to the login page
      window.location.href = "/";
    }
  });