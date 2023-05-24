firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        // Get UID if user is signed in
        const uid = user.uid;
        console.log(`uid ` + uid);
        // Call getRandomSongs on current user
        const songs = await getRandomSongs(uid);

        // Save songs in a global variable so they can be accessed elsewhere
        window.songs = songs;
         
        displaySong(songs);

        // Log each song's fields
        for (let song of songs) {
            console.log("Song Name: " + song["Song Name"]); // Access the "Song Name" field
            console.log("Artist: " + song["Artist"]); // Access the "Artist" field
            console.log("Difficulty: " + song["Difficulty"]); // Access the "Difficulty" field
        }
    } else {
        // No user is signed in.
        console.log("No user is signed in.");
    }
});

async function getRandomSongs(uid) {
    console.log("getRandomSongs uid:", uid); // Log the uid at the start of the function

    // Fetch the user's data from Firestore
    let skillLevel;
    await db
        .collection("users")
        .doc(uid)
        .get()
        .then((doc) => {
            console.log("doc data for uid " + uid + ":", doc.data()); // Log the document data

            if (doc.exists) {
                // Retrieve the skill level from the document
                skillLevel = doc.data().skillLevel;
                console.log("skillLevel:", skillLevel); // Log the skill level
            } else {
                console.error("No such document!");
            }
        }).catch((error) => {
            console.error('Error fetching user data:', error);
        });

    // Check if the user already has a songs subcollection
    const songsCollection = db.collection("users").doc(uid).collection("songs");
    const songsSnapshot = await songsCollection.get();

    if (!songsSnapshot.empty) {
        // The user already has songs, so log them and return them
        let songs = songsSnapshot.docs.map((doc) => doc.data());
        console.log(`There are ${songs.length} existing songs:`, songs);

        if (!(songs.length == 5)) {
            generateSongs(5 - songs.length);
        }
        console.log('Gen. songs from getRandomSongs():', songs);
        return songs;
    }

    generateSongs(5);

    async function generateSongs(n) {
        // The user doesn't have any songs yet, so generate some
        const NUM_SONGS = n;
        let songs = [];
        for (let i = 0; i < NUM_SONGS; i++) {
            const random = Math.random();
            try {
                const songDoc = await db
                    .collection("database")
                    .where("Difficulty", "==", skillLevel)
                    .where("Random", ">=", random)
                    .orderBy("Random")
                    .limit(1)
                    .get();

                console.log("songDoc:", songDoc); // Log the song document

                if (!songDoc.empty) {
                    const songData = songDoc.docs[0].data();
                    console.log("songData:", songData); // Log the song data

                    // Add Song Name, Artist and Difficulty to songs array
                    songs.push({
                        "Song Name": songData["Song Name"],
                        Artist: songData["Artist"],
                        Difficulty: songData["Difficulty"],
                    });

                    // Add the song to the user's songs subcollection
                    // Use the song's ID as the document ID
                    await songsCollection
                        .doc(songData["Song Name"])
                        .set(songData);
                }
            } catch (error) {
                console.error("Error fetching song:", error); // Log any errors
            }
        }
    }
    console.log('Generated songs:', songs);
    return songs;
}

function displaySong(songs, taskNumber = 1) {
    const container = document.getElementById(myContainer);
    const bottomSection = container.querySelector(".bottomSection");
    const song = songs[taskNumber - 1];
    
    if (song) {
        bottomSection.innerHTML = `
        <h3>${song["Song Name"]}</h3>
        <p>Artist: ${song.Artist}</p>
        <p>Difficulty: ${song.Difficulty}</p>
        `;
        console.log("------displaySong() done----------")
    } else {
        console.error('No song to display for task number:', taskNumber);
    }
}