firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        // Get UID if user is signed in 
        const uid = user.uid;
        console.log(uid)
        // Call getRandomSongs on current user
        const songs = await getRandomSongs(uid);
        console.log(songs);

        // Log each song's fields
        for (let song of songs) {
            console.log('Song Name: ' + song["Song Name"]); // Access the "Song Name" field
            console.log('Artist: ' + song["Artist"]); // Access the "Artist" field
            console.log('Difficulty: ' + song["Difficulty"]); // Access the "Difficulty" field
        }
    } else {
        // No user is signed in.
        console.log('No user is signed in.');
    }
});

//Function to assign new users 5 random songs based on their skill level 
async function getRandomSongs(uid) {
    // Log the uid at the start of the function
    console.log('getRandomSongs uid:', uid);

    // Fetch the user's data from Firestore
    let skillLevel;
    await db.collection('users').doc(uid).get()
        .then((doc) => {
            console.log('doc data for uid ' + uid + ':', doc.data()); // Log the document data

            if (doc.exists) {
                // Retrieve the skill level from the document
                skillLevel = doc.data().skillLevel;
                console.log('skillLevel:', skillLevel); // Log the skill level
            } else {
                console.error("No such document!");
            }
        });

    // Check if the user already has a songs subcollection
    const songsCollection = db.collection('users').doc(uid).collection('songs');
    const songsSnapshot = await songsCollection.get();

    if (!songsSnapshot.empty) {
        // The user already has songs, so log them and return them
        let songs = songsSnapshot.docs.map(doc => doc.data());
        console.log('Existing songs:', songs);
        return songs;
    }

    // Pull 5 random songs for the user if their songs collection is empty
    const NUM_SONGS = 5;
    let songs = [];
    for (let i = 0; i < NUM_SONGS; i++) {
        const random = Math.random();
        try {
            const songDoc = await db.collection('database')
                .where('Difficulty', '==', skillLevel)
                .where('Random', '>=', random)
                .orderBy('Random')
                .limit(1)
                .get();

            console.log('songDoc:', songDoc); // Log the song document

            if (!songDoc.empty) {
                const songData = songDoc.docs[0].data();
                // Log the song data if collection is not empty
                console.log('songData:', songData);

                // Add Song Name, Artist and Difficulty to songs array
                songs.push({
                    "Song Name": songData["Song Name"],
                    "Artist": songData["Artist"],
                    "Difficulty": songData["Difficulty"]
                });

                // Add the song to the user's songs subcollection
                // Use the song's ID as the document ID
                await songsCollection.doc(songData["Song Name"]).set(songData);
            }
        } catch (error) {
            // Log any errors
            console.error('Error fetching song:', error);
        }
    }

    return songs;
}