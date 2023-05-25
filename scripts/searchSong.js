document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("search-button").addEventListener("click", function () {
        var searchInput = document.getElementById("search-input").value;

        // Get a reference to the Firestore collection
        var collection = firebase.firestore().collection('database');

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
                    resultDiv.innerHTML = `
                    <h3>${docData['Song Name']}</h3>
                    <p>Artist: ${docData.Artist}</p>
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
                        // call a function to handle viewing the tab, you need to implement it.
                        viewTab(docId);
                    });
                });
            }
        });
    });
});

