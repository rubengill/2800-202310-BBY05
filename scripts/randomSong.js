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


async function getRandomSongs(uid) {
    console.log('getRandomSongs uid:', uid); // Log the uid at the start of the function

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

    // Pull random songs, which includes all of the documents fields
    const NUM_SONGS = 5;
    //Create an array to store the desired song information, in this case the Song Name, Artist
    //and the Difficulty
    let songs = [];
    for (let i = 0; i < NUM_SONGS; i++) {
        //Generatre a random number, and only pull songs that are greater than the random number
        //And that have the same Difficulty as skill level
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
                console.log('songData:', songData); // Log the song data

                // Add Song Name, Artist and Difficulty to songs array
                songs.push({
                    "Song Name": songData["Song Name"],
                    "Artist": songData["Artist"],
                    "Difficulty":songData["Difficulty"]

                });
            }
        } catch (error) {
            console.error('Error fetching song:', error); // Log any errors
        }
    }

    return songs;
}




//Test to see if it correctly pulls songs by logging it to the console 
// getRandomSongs().then(songs => {
//     for (let song of songs) {
//         console.log(song["Song Name"]); // Access the "Song Name" field
//         console.log(song["Artist"]); // Access the "Artist" field
//         console.log(song["Difficulty"]); // Access the "Difficulty" field
//         console.log(song["Random"]); // Access the "Random" field
//     }
// });