document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("search-button").addEventListener("click", function () {
        var searchInput = document.getElementById("search-input").value;

        // Capitalize the first letter of each word in the user's input
        searchInput = capitalizeWords(searchInput);

        // Get a reference to the Firestore collection
        var collection = db.collection('database');

        // Create a query against the collection.
        var query = collection.where('Song Name', '==', searchInput);

        query.get().then((querySnapshot) => {
            var resultsContainer = document.getElementById("search-results");
            // Clear results container
            resultsContainer.innerHTML = "";

            if (querySnapshot.empty) {
                resultsContainer.innerHTML = "<p>No Results Found</p>";
            } else {
                querySnapshot.forEach((doc) => {
                    var docData = doc.data();
                    var resultDiv = document.createElement("div");
                    resultDiv.className = "search-result";
                    var pulledSongName = `${docData['Song Name']}`;
                    var pulledArtist = `${docData['Artist']}`;
                    resultDiv.innerHTML = `
                    <h3>${pulledSongName}</h3>
                    <p>Artist: ${pulledArtist}</p>
                    <p>Difficulty: ${docData.Difficulty}</p>
                    <button class="view-tab-button" data-id="${doc.id}">View Tab</button>
                `;
                    resultsContainer.appendChild(resultDiv);
                });

                // Adding event listener to view tab buttons
                var viewTabButtons = document.querySelectorAll(".view-tab-button");
                viewTabButtons.forEach((button) => {
                    button.addEventListener("click", function (event) {
                        var docId = event.target.getAttribute("data-id");
                        var songName = capitalizeWords(document.querySelector(`[data-id="${docId}"]`).innerText);
                        var artist = capitalizeWords(document.querySelector(`[data-id="${docId}"]`).nextElementSibling.innerText.slice(8));

                        fetch(`/fulltab?songName=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artist)}`)
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


