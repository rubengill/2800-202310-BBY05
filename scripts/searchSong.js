document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("search-button").addEventListener("click", function () {
        var searchInput = document.getElementById("search-input").value;
        searchInput = capitalizeWords(searchInput);
        var collection = db.collection('database');
        var query = collection.where('Song Name', '==', searchInput);

        query.get().then((querySnapshot) => {
            var resultsContainer = document.getElementById("search-results");
            resultsContainer.innerHTML = "";
            var songData = {};

            if (querySnapshot.empty) {
                resultsContainer.innerHTML = "<p>No Results Found</p>";
            } else {
                querySnapshot.forEach((doc) => {
                    var docData = doc.data();
                    songData[doc.id] = {
                        songName: docData['Song Name'],
                        artist: docData['Artist']
                    };

                    var resultDiv = document.createElement("div");
                    resultDiv.className = "search-result";
                    resultDiv.innerHTML = `
                    <h3>${songData[doc.id].songName}</h3>
                    <p>Artist: ${songData[doc.id].artist}</p>
                    <p>Difficulty: ${docData.Difficulty}</p>
                    <button class="view-tab-button" data-id="${doc.id}">View Tab</button>
                    <button class="add-to-favourites-button" data-id="${doc.id}">Add to favourites</button>
                    `;
                    resultsContainer.appendChild(resultDiv);
                });

                // Event listeners for 'Add to favourites' button
                var addToFavouritesButtons = document.querySelectorAll(".add-to-favourites-button");
                addToFavouritesButtons.forEach((button) => {
                    button.addEventListener("click", function (event) {
                        var docId = event.target.getAttribute("data-id");
                        addToFavourites(docId, songData);
                    });
                });

                // Adding event listener to view tab buttons
                var viewTabButtons = document.querySelectorAll(".view-tab-button");
                viewTabButtons.forEach((button) => {
                    button.addEventListener("click", function (event) {
                        var docId = event.target.getAttribute("data-id");
                        var songName = songData[docId].songName;
                        var artist = songData[docId].artist;
                        console.log(songName, artist);

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
        });
    });
});


//Helper function that searches song properly by accounting for various user capitalization.
//Takes the user input and ensures only the first letter of a word is capitalized
function capitalizeWords(input) {
    return input.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

/// Function to add a song to a user's favourites in a Firebase database
function addToFavourites(docId, songData) {
    // Get the current logged in user
    var currentUser = firebase.auth().currentUser;
    
    // Check if a user is logged in
    if (currentUser) {
        // Get a reference to the current user's document in the 'users' collection
        var userDocRef = db.collection('users').doc(currentUser.uid);
        
        // Get a reference to the 'favourites' sub-collection for the current user
        var favouritesSubCollectionRef = userDocRef.collection('favourites');
        
        // Get a reference to the specific song document within the 'favourites' collection
        var songDocRef = favouritesSubCollectionRef.doc(docId);

        // Set the song document with the song name and artist
        songDocRef.set({
            songName: songData[docId].songName,
            artist: songData[docId].artist
        })
        // If the song is successfully added to favourites, log a success message
        .then(() => {
            console.log('Song added to favourites');
        })
        // If there is an error adding the song to favourites, log an error message
        .catch((error) => {
            console.error('Error adding song to favourites: ', error);
        });
    }
}

