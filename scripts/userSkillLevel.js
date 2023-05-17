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
            } else {
                console.error("No such document!");
            }
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });
}
