firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    const currentUserRef = firebase.firestore().collection("users").doc(user.uid);

    // Get the current timestamp
    const currentTimestamp = firebase.firestore.FieldValue.serverTimestamp();

    // Retrieve the previous login timestamp from Firestore
    currentUserRef.get()
      .then(doc => {
        if (doc.exists) {
          const userData = doc.data();
          const previousLoginTimestamp = userData.lastLogin;

          // Update the lastLogin field with the current timestamp
          currentUserRef.update({ lastLogin: currentTimestamp })
            .then(() => {
              // Proceed with the rest of the login process

              // Check if the user has a streak data in Firestore
              const streakRef = firebase.firestore().collection("users").doc(user.uid).collection("streak");
              streakRef
                .doc("streak")
                .get()
                .then(doc => {
                  if (doc.exists) {
                    const streakData = doc.data();
                    const currentCount = streakData.count;

                    if (isConsecutiveLogin(previousLoginTimestamp, currentTimestamp)) {
                      // Streak continues, update the streak count
                      updateStreak(streakRef, currentCount);
                    } else {
                      // Streak reset, start a new streak
                      startStreak(streakRef);
                    }
                  } else {
                    // No streak data found, start a new streak
                    startStreak(streakRef);
                  }
                })
                .catch(error => {
                  console.error("Error checking streak data:", error);
                });
            })
            .catch(error => {
              console.error("Error updating last login timestamp:", error);
            });
        } else {
          // User document does not exist
          console.log("User document not found.");
        }
      })
      .catch(error => {
        console.error("Error retrieving user document:", error);
      });
  } else {
    // No user is signed in, redirect to the login page
    window.location.href = "/";
  }
});

function isConsecutiveLogin(previousLoginTimestamp, currentTimestamp) {
  // Get the previous login timestamp from streakData (assuming it is stored as 'previousLogin')
  const previousLogin = previousLoginTimestamp;

  // Get the current login timestamp
  const currentLogin = currentTimestamp;

  // Check if previousLogin and currentLogin are valid timestamps
  if (previousLogin && currentLogin) {
    // Calculate the time difference between the current and previous login
    const timeDifference = currentLogin.toMillis() - previousLogin.toMillis();

    // Define the time threshold for consecutive logins (e.g., 24 hours)
    const timeThreshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Check if the time difference is within the threshold
    if (timeDifference <= timeThreshold) {
      // The login is consecutive
      return true;
    }
  }

  // The login is not consecutive
  return false;
}

function startStreak(streakRef) {
  // Create a new streak document in Firestore with an initial count of 1
  streakRef
    .doc("streak")
    .set({ count: 1 })
    .then(() => {
      console.log("Streak started.");
    })
    .catch(error => {
      console.error("Error starting streak:", error);
    });
}

function updateStreak(streakRef, currentCount) {
  const newCount = currentCount + 1;

  // Update the streak count in Firestore
  streakRef
    .doc("streak")
    .update({ count: newCount })
    .then(() => {
      console.log("Streak updated:", newCount);
    })
    .catch(error => {
      console.error("Error updating streak:", error);
    });
}
