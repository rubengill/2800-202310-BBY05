// Function to fetch and display the skill level
function fetchAndDisplaySkillLevel(uid) {

  // Fetch the user's data from Firestore
  db.collection('users').doc(uid).get()
    .then((doc) => {
      if (doc.exists) {
        // Retrieve the skill level from the document
        const skillLevel = doc.data().skillLevel;

        // Set the text content of the "skill" div to the skill level
        document.getElementById('skill').textContent = skillLevel;
        console.log("Success")
      } else {
        console.error("No such document!");
      }
    })
    .catch((error) => {
      console.error("Error getting document:", error);
    });
}

//Call the fetchAndDisplaySkillLevel function when the page is done loading
window.onload = function () {
  //Check if the user is signed in 
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      const uid = user.uid;

      // Call fetchAndDisplaySkillLevel
      fetchAndDisplaySkillLevel(uid);
    } else {
      // No user is signed in.
      console.log("No user is signed in.");
    }
  });
}

