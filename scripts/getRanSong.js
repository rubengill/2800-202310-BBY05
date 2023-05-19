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

//const databaseRef = db.collection("database");
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
