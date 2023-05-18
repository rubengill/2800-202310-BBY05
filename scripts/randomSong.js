function getRandomSongs() {
    // Get current user's uid
    const uid = firebase.auth().currentUser.uid;

    // Fetch the user's data from Firestore
    let skillLevel;
    db.collection('users').doc(uid).get()
        .then((doc) => {
            if (doc.exists) {
                // Retrieve the skill level from the document
                skillLevel = doc.data().skillLevel;
            } else {
                console.error("No such document!");
            }
        });

    // Pull random songs, which includes all of the documents fields
    const NUM_SONGS = 5;
    let songs = [];
    for (let i = 0; i < NUM_SONGS; i++) {
        const random = Math.random();
        const songDoc = db.collection('database')
            .where('Difficulty', '==', skillLevel)
            .where('Random', '>=', random)
            .orderBy('Random')
            .limit(1)
            .get();

        if (!songDoc.empty) {
            songs.push(songDoc.docs[0].data());
        }
    }

    return songs;
}


//Test to see if it correctly pulls songs by logging it to the console 
getRandomSongs().then(songs => {
    for (let song of songs) {
        console.log(song["Song Name"]); // Access the "Song Name" field
        console.log(song["Artist"]); // Access the "Artist" field
        console.log(song["Difficulty"]); // Access the "Difficulty" field
        console.log(song["Random"]); // Access the "Random" field
    }
});