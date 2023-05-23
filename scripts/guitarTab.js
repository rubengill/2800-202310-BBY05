firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        // Use user's UID here
        const uid = user.uid;

        db.collection('users').doc(uid).collection('songs').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // Create a new div element for each song
                const newDiv = document.createElement("div");
                const song = doc.data();
                const songName = song['Song Name'];
                const artist = song['Artist'];
    
                // Create a button for each song
                const button = document.createElement("button");
                button.innerHTML = "View Tab";
                button.addEventListener('click', function() {
                    fetch(`/tab?songName=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artist)}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data && data.guitarTab) {
                                newDiv.textContent = data.guitarTab;
                            } else {
                                newDiv.textContent = 'No tab available.';
                            }
                        })
                        .catch(error => console.error('Error:', error));
                });
    
                // Add song name, artist and button to the div
                newDiv.textContent = songName + ' by ' + artist;
                newDiv.appendChild(button);
    
                // Append the div to the songList div in the page
                document.getElementById('songList').appendChild(newDiv);
            });
        });
    }
});



document.getElementById('fetchTab').addEventListener('click', function() {
    var songName = "Your Song Name"; // Replace with actual song name
    var artist = "Your Artist"; // Replace with actual artist

    fetch(`/tab?songName=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artist)}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.guitarTab) {
                document.getElementById('tab').textContent = data.guitarTab;
            } else {
                document.getElementById('tab').textContent = 'No tab available.';
            }
        })
        .catch(error => console.error('Error:', error));
});