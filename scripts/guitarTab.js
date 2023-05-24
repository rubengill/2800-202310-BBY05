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
                button.addEventListener('click', function () {
                    //Request tab endpoint on our serer, and the parameters are used in the fetchGuitar function
                    fetch(`/tab?songName=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artist)}`)
                        .then(response => response.text()) // Get the response as text
                        .then(data => {
                            if (data) {
                                newDiv.innerHTML = data; // Set the innerHTML to the SVG data
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
