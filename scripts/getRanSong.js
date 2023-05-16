const databaseRef = db.collection("database");
databaseRef.get().then((querySnapshot) => {
    const songs = [];
    querySnapshot.forEach((doc) => {
      const song = doc.data();
      songs.push(song);
    });
  
    // Select a random song
    const randomIndex = Math.floor(Math.random() * songs.length);
    const randomSong = songs[randomIndex];
  
    // Display the song on your website
    displaySong(randomSong);
    //displaySong
});


function displaySong(song) {
    const containerIds = ["frmTask1", "frmTask2", "frmTask3", "frmTask4", "frmTask5"];
    
    containerIds.forEach((containerId) => {
      const container = document.getElementById(containerId);
      container.innerHTML += `
        <h2>${song['Song Name']}</h2>
        <p>Artist: ${song.Artist}</p>
        <p>Album: ${song.Difficulty}</p>
        <!-- Add additional song details as needed -->
      `;
    });
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