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
