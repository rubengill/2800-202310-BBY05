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
                // Inside the event listener for the button:
                button.addEventListener('click', function () {
                    // Request tab endpoint on our server
                    fetch(`/tab?songName=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artist)}`)
                        .then(response => response.text()) // Get the response as text
                        .then(data => {
                            // Create a new div for the SVG data
                            const svgDiv = document.createElement("div");
                            svgDiv.classList.add("svg-container");  // Add the class "svg-container" to the div

                            if (data) {
                                svgDiv.innerHTML = data; // Inject the SVG HTML into the div
                            } else {
                                svgDiv.textContent = 'No tab available.';
                            }

                            // Append svgDiv to the SVG container in the page
                            document.getElementById('pulled-guitar-tab').appendChild(svgDiv);
                        })
                        .catch(error => console.error('Error:', error));
                });

                // Add song name, artist and button to the div
                newDiv.textContent = songName + ' by ' + artist;
                newDiv.appendChild(button);

                // Append the div to the song card container in the page
                document.getElementById('songList').appendChild(newDiv);
            });
        });
    }
});


