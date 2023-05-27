// Wait for the DOM to be fully loaded before running the function
document.addEventListener("DOMContentLoaded", function () {
    console.log('Page loaded');
    // Set an observer for changes in the authentication state
    firebase.auth().onAuthStateChanged(function(user) {
        // If a user is logged in
        if (user) {
            console.log('Current user:', user.uid);
            // Get a reference to the user's document in the 'users' collection
            var userDocRef = db.collection('users').doc(user.uid);
            // Get a reference to the 'favourites' sub-collection for the current user
            var favouritesSubCollectionRef = userDocRef.collection('favourites');

            // Fetch all documents from the 'favourites' collection
            favouritesSubCollectionRef.get().then((querySnapshot) => {
                console.log('Got favourites');
                // Get the HTML element where the results should be displayed
                var resultsContainer = document.getElementById("favourites-results");
                // Clear any existing content
                resultsContainer.innerHTML = "";
                // Initialize an object to store song data
                var songData = {};

                // If the query didn't return any documents
                if (querySnapshot.empty) {
                    console.log('No favourites found');
                    // Display a message saying that no favourites were found
                    resultsContainer.innerHTML = "<p>No Favourites Found</p>";
                } else {
                    console.log('Processing favourites');
                    // For each document in the query results
                    querySnapshot.forEach((doc) => {
                        console.log('Processing doc:', doc.id);
                        // Get the data from the document
                        var docData = doc.data();
                        // Store the song name and artist in the songData object
                        songData[doc.id] = {
                            songName: docData['songName'],
                            artist: docData['artist']
                        };

                        console.log('Creating result div for doc:', doc.id);
                        // Create a new div to display the song data
                        var resultDiv = document.createElement("div");
                        resultDiv.className = "favourite-result";
                        // Fill the div with the song name, artist, and a button to view the tab
                        resultDiv.innerHTML = `
                            <h5 class="card-header">${'Song: ' +songData[doc.id].songName}</h5> <!-- Song Name as card-header -->
                            <div class="card-body">
                                <h6 class="card-subtitle mb-2 text-muted">Artist: ${songData[doc.id].artist}</h6> <!-- Artist as card-subtitle -->
                                <button class="view-tab-button btn btn-success" data-id="${doc.id}">View Tab</button>
                                <button class="remove-from-favourites-button btn btn-danger ml-2" data-id="${doc.id}">Remove from favourites</button>
                            </div>
                        `;
                        // Add the new div to the results container
                        resultsContainer.appendChild(resultDiv);
                        console.log('Appended result div for doc:', doc.id);
                    });

                    // Adding event listener to view tab buttons
                    var viewTabButtons = document.querySelectorAll(".view-tab-button");
                    viewTabButtons.forEach((button) => {
                        // When a button is clicked
                        button.addEventListener("click", function (event) {
                            // Get the ID of the document associated with the button
                            var docId = event.target.getAttribute("data-id");
                            // Get the song name and artist from the songData object
                            var songName = songData[docId].songName;
                            var artist = songData[docId].artist;
                            console.log('View tab button clicked for doc:', docId, songName, artist);

                            console.log('Before fetch call');
                            // Make a fetch call to get the guitar tab for the song
                            fetch(`/fullguitartab?songName=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artist)}`)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    console.log('Fetch response:', response);
                                    return response.json(); // Get the response as JSON
                                })
                                .then(data => {
                                    console.log('Data received:', data);
                                    // Create a new div for the SVG data
                                    const svgDiv = document.createElement("div");
                                    svgDiv.classList.add("svg-container");  // Add the class "svg-container" to the div

                                    if (data && data.length > 0) {
                                        // Parse each SVG string into a document fragment using the DOMParser API
                                        const parser = new DOMParser();
                                        data.forEach(svgStr => {
                                            const doc = parser.parseFromString(svgStr, "image/svg+xml");
                                            svgDiv.appendChild(doc.documentElement);
                                        });
                                    } else {
                                        svgDiv.textContent = 'No tab available.';
                                    }

                                    // Append svgDiv to the SVG container in the page
                                    document.getElementById('full-guitar-tab').appendChild(svgDiv);
                                })
                                .catch(error => console.error('Error:', error));
                            console.log('After fetch call');
                        });
                    });
                }
            }).catch((error) => {
                console.error('Error getting favourites: ', error);
            });
        } else {
            console.log('No current user');
        }
    });
});