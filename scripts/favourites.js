document.addEventListener("DOMContentLoaded", function () {
    console.log('Page loaded');
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Current user:', user.uid);
            var userDocRef = db.collection('users').doc(user.uid);
            var favouritesSubCollectionRef = userDocRef.collection('favourites');

            favouritesSubCollectionRef.get().then((querySnapshot) => {
                console.log('Got favourites');
                var resultsContainer = document.getElementById("favourites-results");
                resultsContainer.innerHTML = "";
                var songData = {};

                if (querySnapshot.empty) {
                    console.log('No favourites found');
                    resultsContainer.innerHTML = "<p>No Favourites Found</p>";
                } else {
                    console.log('Processing favourites');
                    querySnapshot.forEach((doc) => {
                        console.log('Processing doc:', doc.id);
                        var docData = doc.data();
                        songData[doc.id] = {
                            songName: docData['songName'],
                            artist: docData['artist']
                        };

                        console.log('Creating result div for doc:', doc.id);
                        var resultDiv = document.createElement("div");
                        resultDiv.className = "search-result card mb-3"; // Using Bootstrap card and margin-bottom
                        resultDiv.innerHTML = `
                            <h5 class="card-header">${'Song: ' +songData[doc.id].songName}</h5> <!-- Song Name as card-header -->
                            <div class="card-body">
                                <h6 class="card-subtitle mb-2 text-muted">Artist: ${songData[doc.id].artist}</h6> <!-- Artist as card-subtitle -->
                                <button class="view-tab-button btn btn-success" data-id="${doc.id}">View Tab</button>
                                <button class="remove-from-favourites-button btn btn-danger ml-2" data-id="${doc.id}">Remove from favourites</button>
                            </div>
                        `;
                        resultsContainer.appendChild(resultDiv);
                        console.log('Appended result div for doc:', doc.id);
                    });

                    // Adding event listener to view tab buttons
                    var viewTabButtons = document.querySelectorAll(".view-tab-button");
                    viewTabButtons.forEach((button) => {
                        button.addEventListener("click", function (event) {
                            var docId = event.target.getAttribute("data-id");
                            var songName = songData[docId].songName;
                            var artist = songData[docId].artist;
                            console.log('View tab button clicked for doc:', docId, songName, artist);

                            console.log('Before fetch call');
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