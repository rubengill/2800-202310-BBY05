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
                    resultDiv.className = "search-result card p-3 mb-3"; // Added padding and margin using Bootstrap spacing classes
                    resultDiv.innerHTML = `
                        <div class="d-flex flex-column"> <!-- Added flexbox container for vertical alignment -->
                            <h3 class="card-title mt-2">${songData[doc.id].songName}</h3> <!-- Added top margin -->
                            <p class="card-text flex-grow-1">Artist: ${songData[doc.id].artist}</p> <!-- Added flex-grow-1 class for vertical alignment -->
                            <div class="d-flex justify-content-center gap-2"> <!-- Added gap-2 class for spacing between buttons -->
                                <button class="btn btn-success narrower-button smaller-height view-tab-button" data-id="${doc.id}">View Tab</button> <!-- Added narrower-button and smaller-height classes -->
                                <button class="btn btn-secondary narrower-button smaller-height add-to-favourites-button" data-id="${doc.id}">Add to favourites</button> <!-- Added narrower-button and smaller-height classes -->
                            </div>
                        </div>
                    `;
                    resultsContainer.appendChild(resultDiv);
                });

                // Event listeners for 'Add to favourites' button
                var addToFavouritesButtons = document.querySelectorAll(".add-to-favourites-button");
                addToFavouritesButtons.forEach((button) => {
                    button.addEventListener("click", function (event) {
                        var docId = event.target.getAttribute("data-id");
                        var addToFavouritesButton = event.target;

                        // Disable the button and change the text to "Added"
                        addToFavouritesButton.disabled = true;
                        addToFavouritesButton.textContent = "Added";

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

// Helper function for adding songs to favourites
function addToFavourites(docId, songData) {
    var currentUser = firebase.auth().currentUser;
    if (currentUser) {
        var userDocRef = db.collection('users').doc(currentUser.uid);
        var favouritesSubCollectionRef = userDocRef.collection('favourites');
        var songDocRef = favouritesSubCollectionRef.doc(docId);

        songDocRef.set({
            songName: songData[docId].songName,
            artist: songData[docId].artist
        }).then(() => {
            console.log('Song added to favourites');
        }).catch((error) => {
            console.error('Error adding song to favourites: ', error);
        });
    }
}


