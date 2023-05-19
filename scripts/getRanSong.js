// const tempDB = db.collection("temp_small_database");
// tempDB.get().then((querySnapshot) => {
//     var docRef = db.collection("temp_small_database").doc("document_0");
//     docRef
//         .get()
//         .then((doc) => {
//                 console.log("small data:", doc.data());
//         })
//         .catch((error) => {
//             console.log("Error getting document:", error);
//         });
// });

const databaseRef = db.collection("database");
const songs = [];
function updateSong() {
    const numSongsPulled = 30;
    const songPromises = [];
  
    for (let i = 0; i < LAST_TASK; i++) {
      var randomDocNum = "document_" + Math.floor(Math.random() * 849);
  
      var docRef = db.collection("database").doc(randomDocNum);
  
      const songPromise = docRef.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          const song = doc.data();
          songs.push(song);
        } else {
          console.log("No such document: " + randomDocNum + "!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
  
      songPromises.push(songPromise);
    }
  
    Promise.all(songPromises).then(() => {
      displaySong();
    });
  }
updateSong();

// firebase.auth().onAuthStateChanged(async (user) => {
//   if (user) {
//       // Get UID if user is signed in 
//       const uid = user.uid;
//       console.log(uid)
//       // Call getRandomSongs on current user
//       const songs = await getRandomSongs(uid);
//       displaySong(songs);
//       console.log(songs);

//       // Log each song's fields
//       for (let song of songs) {
//           console.log('Song Name: ' + song["Song Name"]); // Access the "Song Name" field
//           console.log('Artist: ' + song["Artist"]); // Access the "Artist" field
//           console.log('Difficulty: ' + song["Difficulty"]); // Access the "Difficulty" field
//       }
//   } else {
//       // No user is signed in.
//       console.log('No user is signed in.');
//   }
// });


// async function getRandomSongs(uid) {
//   console.log('getRandomSongs uid:', uid); // Log the uid at the start of the function

//   // Fetch the user's data from Firestore
//   let skillLevel;
//   await db.collection('users').doc(uid).get()
//       .then((doc) => {
//           console.log('doc data for uid ' + uid + ':', doc.data()); // Log the document data

//           if (doc.exists) {
//               // Retrieve the skill level from the document
//               skillLevel = doc.data().skillLevel;
//               console.log('skillLevel:', skillLevel); // Log the skill level
//           } else {
//               console.error("No such document!");
//           }
//       });

//   // Check if the user already has a songs subcollection
//   const songsCollection = db.collection('users').doc(uid).collection('songs');
//   const songsSnapshot = await songsCollection.get();

//   if (!songsSnapshot.empty) {
//       // The user already has songs, so log them and return them
//       let songs = songsSnapshot.docs.map(doc => doc.data());
//       console.log('Existing songs:', songs);
//       return songs;
//   }

//   // The user doesn't have any songs yet, so generate some
//   const NUM_SONGS = 5;
//   let songs = [];
//   for (let i = 0; i < NUM_SONGS; i++) {
//       const random = Math.random();
//       try {
//           const songDoc = await db.collection('database')
//               .where('Difficulty', '==', skillLevel)
//               .where('Random', '>=', random)
//               .orderBy('Random')
//               .limit(1)
//               .get();

//           console.log('songDoc:', songDoc); // Log the song document

//           if (!songDoc.empty) {
//               const songData = songDoc.docs[0].data();
//               console.log('songData:', songData); // Log the song data

//               // Add Song Name, Artist and Difficulty to songs array
//               songs.push({
//                   "Song Name": songData["Song Name"],
//                   "Artist": songData["Artist"],
//                   "Difficulty": songData["Difficulty"]
//               });

//               // Add the song to the user's songs subcollection
//               // Use the song's ID as the document ID
//               await songsCollection.doc(songData["Song Name"]).set(songData);
//           }
//       } catch (error) {
//           console.error('Error fetching song:', error); // Log any errors
//       }
//   }

//   return songs;
// }



function displaySong() {
    const container = document.getElementById(myContainer);
    const bottomSection = container.querySelector(".bottomSection");
    const song = songs[currentTask - 1];//tasks go 1-5, songs[] go 0-4

    bottomSection.innerHTML = `
    <h3>${song["Song Name"]}</h3>
    <p>Artist: ${song.Artist}</p>
    <p>Difficulty: ${song.Difficulty}</p>
    <!-- Add additional song details as needed -->
    `;
    console.log("------displaySong() done----------")
}



//   function displayRandomSongs() {
//     const containerIds = ["frmTask1", "frmTask2", "frmTask3", "frmTask4", "frmTask5"];
//     const songs = [];

//     // Check if songs are already generated for today
//     // const storedSongs = localStorage.getItem('randomSongs');
//     // const storedTimestamp = localStorage.getItem('randomSongsTimestamp');

//     // const currentTimestamp = new Date().toISOString().slice(0, 10);

//     // if (storedSongs && storedTimestamp === currentTimestamp) {
//     //   songs.push(...JSON.parse(storedSongs));
//     // }
//     // else {
//       // Generate random songs
//       const db = firebase.firestore();
//       const databaseRef = db.collection("database");

//       databaseRef.get().then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//           const song = doc.data();
//           songs.push(song);
//         });

//         // Shuffle the songs array
//         for (let i = songs.length - 1; i > 0; i--) {
//           const j = Math.floor(Math.random() * (i + 1));
//           [songs[i], songs[j]] = [songs[j], songs[i]];
//         }

//         // Store the generated songs and timestamp in local storage
//         localStorage.setItem('randomSongs', JSON.stringify(songs));
//         localStorage.setItem('randomSongsTimestamp', currentTimestamp);

//         displaySongsInContainers();
//       });
//     // }

//     function displaySongsInContainers() {
//       containerIds.forEach((containerId, index) => {
//         const container = document.getElementById(containerId);
//         const song = songs[index];

//         container.innerHTML += `
//             <h2>${song['Song Name']}</h2>
//             <p>Artist: ${song.Artist}</p>
//             <p>Album: ${song.Difficulty}</p>
//             <!-- Add additional song details as needed -->
//         `;
//       });
//     }

//     displaySongsInContainers();
//   }

//   displayRandomSongs();
