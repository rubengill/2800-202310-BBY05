function putTabStuffIn() {

    firebase.auth().onAuthStateChanged(async (user) => {
        
        const card = document.getElementById(myCardTask);
        let value = card.getAttribute('value');

        if (user && (value == "incomplete")) {
            
            const uid = user.uid;
            console.log(`uid from guitattab ${uid}`);
            db.collection('users').doc(uid).collection('songs').get().then((querySnapshot) => {
                const songs = querySnapshot.docs;
                const currentSongDoc = songs[currentTask - 1];

                if (currentSongDoc) {
                    console.log("****** currentSongDoc from guitarTab.js:" + currentSongDoc + "**********");

                    // Create a new div element for the song
                    const newDiv = document.createElement("div");
                    newDiv.id = "guitarTabThing";
                    const completeDiv = document.createElement("div");
                    completeDiv.id = "completeDiv";

                    const song = currentSongDoc.data();
                    const songName = song['Song Name'];
                    const artist = song['Artist'];

                // Create a button for each song
                const button = document.createElement("button");
                button.innerHTML = `View Tab`;
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

                                // Append svgDiv to newDiv
                                newDiv.appendChild(svgDiv);
                                button.innerHTML = "Loaded";

                                //-----Add complete button

                                const completeBtn = document.createElement("button");
                                completeBtn.innerHTML = "Complete Task";
                                completeBtn.id = "completeBtn";
                                completeBtn.addEventListener('click', completeTask);
                                completeDiv.appendChild(completeBtn);

                            })
                            .catch(error => console.error('Error:', error));
                    });

                // Add song name, artist and button to the div
                newDiv.appendChild(button);

                    // Append the div to the songList div in the page
                    card.appendChild(newDiv);
                    card.appendChild(completeDiv);
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        } else {
            console.log("somehow no user from guitartab.js");
        }
    });
}
putTabStuffIn();

// Function that hides the task after the "Complete" button is complete. 
function completeTask() {
    // Set the value of a task to "complete"
    value = "complete";
    
    // Get the element representing the task card
    const card = document.getElementById(myCardTask);
    
    // Set the 'value' attribute of the task card to 'complete'
    card.setAttribute('value', 'complete');

    // Get the elements inside the task card that we want to remove
    const newDiv = card.querySelector("#guitarTabThing");
    const completeDiv = card.querySelector("#completeDiv");
    
    // Remove these elements from the task card
    document.getElementById(myCardTask).removeChild(newDiv);
    document.getElementById(myCardTask).removeChild(completeDiv);

    // Get the container element for the form
    const container = document.getElementById(myForm);
    
    // Get the 'topSection' element inside the form container
    const topSection = container.querySelector(".topSection");
    
    // Get the 'taskDiv' element inside the 'topSection'
    const label = topSection.querySelector(".taskDiv");
    
    // Append the text ' -- complete!' to the 'taskDiv' element
    label.innerHTML += "<h3> -- complete! </h3>";
}