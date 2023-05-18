// Check if the user has a streak data in Firestore
const streakRef = firebase.firestore().collection("users").doc(userUid);

streakRef.get()
  .then(doc => {
    if (doc.exists) {
      const streakData = doc.data();
      const previousLoginTimestamp = streakData.lastLogin;
      const currentTimestamp = firebase.firestore.FieldValue.serverTimestamp();

      if (isConsecutiveLogin(previousLoginTimestamp, currentTimestamp)) {
        // Streak continues, update the streak count
        updateStreak(streakRef, streakData.streakCount);
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
    .set({ streakCount: 1 })
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
    .update({ streakCount: newCount })
    .then(() => {
      console.log("Streak updated:", newCount);
    })
    .catch(error => {
      console.error("Error updating streak:", error);
    });
}
