class SongManager {
    constructor() {
      this.songs = [];
    }
  
    async getRandomSongs(uid) {
        console.log("getRandomSongs uid:", uid); // Log the uid at the start of the function
    
        let songs;
    
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
            songs = songsSnapshot.docs.map((doc) => doc.data());
            console.log(`There are ${songs.length} existing songs:`, songs);
    
            if (!(songs.length == 5)) {
                await generateSongs(5 - songs.length);
            }
            console.log('songs after getRandomSongs():', songs);
            return songs;
        }
    
        await generateSongs(5);
    
        async function generateSongs(n) {
            // The user doesn't have any songs yet, so generate some
            const NUM_SONGS = n;
            for (let i = 0; i < NUM_SONGS; i++) {
                let songData;
                let isDuplicate = true;
                while (isDuplicate) {
                    const random = Math.random();
                    try {
                        const songDoc = await db
                            .collection("database")
                            .where("Difficulty", "==", skillLevel)
                            .where("Random", ">=", random)
                            .orderBy("Random")
                            .limit(1)
                            .get();
    
                        if (!songDoc.empty) {
                            songData = songDoc.docs[0].data();
                            // Check if this song already exists in user's songs
                            isDuplicate = songs.some(song => song["Song Name"] === songData["Song Name"]);
                        }
                    } catch (error) {
                        console.error("Error fetching song:", error); // Log any errors
                        return;
                    }
                }
                // If the song does not exist in user's songs, add it
                if (songData) {
                    console.log("songData:", songData); // Log the song data
    
                    songs.push(songData);
                    // Add the song to the user's songs subcollection
                    // Use the song's ID as the document ID
                    await songsCollection.doc(songData["Song Name"]).set(songData);
                }
            }
        }
        console.log('Generated songs:', songs);
        return songs;
    }
  
    getSongs() {
      return this.songs;
    }
  }



firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        // Get UID if user is signed in
        const uid = user.uid;
        // Call getRandomSongs on current user
        //const songs = await getRandomSongs(uid);

        const songManager = new SongManager();

        // Get songs for a user
        await songManager.getRandomSongs(uid);

        // Get the songs array
        const songs = songManager.getSongs();

        // Save songs in a global variable so they can be accessed elsewhere
        //------TODO: delete? may be redundant cuz of songManager
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


//old "non-SongManager" getRandomSongs(uid) fn was here

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