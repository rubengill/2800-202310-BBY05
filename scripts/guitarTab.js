// firebase.auth().onAuthStateChanged(async (user) => {
//     if (user) {
//         // Use user's UID here
//         const uid = user.uid;
function putTabStuffIn() {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
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

                    const song = currentSongDoc.data();
                    const songName = song['Song Name'];
                    const artist = song['Artist'];

                    // Create a button for the song
                    const button = document.createElement("button");
                    button.innerHTML = "View Tab";
                    button.classList = "viewTabButton";
                    button.addEventListener('click', function () {
                        button.innerHTML = "Loading";
                        // Request tab endpoint on our server
                        fetch(`/tab?songName=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artist)}`)
                            .then(response => response.text()) // Get the response as text
                            .then(data => {
                                // Create a new div for the SVG data
                                const svgDiv = document.createElement("div");
                                svgDiv.className = "actualTab";

                                if (data) {
                                    svgDiv.innerHTML = data; // Set the innerHTML to the SVG data
                                } else {
                                    svgDiv.textContent = 'No tab available.';
                                }

                                // Append svgDiv to newDiv
                                newDiv.appendChild(svgDiv);
                                button.innerHTML = "Loaded";
                            })
                            .catch(error => console.error('Error:', error));
                    });

                    // Add song name, artist and button to the div
                    //newDiv.textContent = songName + ' by ' + artist;
                    newDiv.appendChild(button);

                    // Append the div to the songList div in the page
                    document.getElementById(myCardTask).appendChild(newDiv);
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
//     }
// });


//--------------rubens code---------------------------------
// firebase.auth().onAuthStateChanged(async (user) => {
//     if (user) {
//         // Use user's UID here
//         const uid = user.uid;

//         db.collection('users').doc(uid).collection('songs').get().then((querySnapshot) => {
//             querySnapshot.forEach((doc) => {
//                 // Create a new div element for each song
//                 const newDiv = document.createElement("div");
//                 const song = doc.data();
//                 const songName = song['Song Name'];
//                 const artist = song['Artist'];

//                 // Create a button for each song
//                 const button = document.createElement("button");
//                 button.innerHTML = "View Tab";
//                 // Inside the event listener for the button:
//                 button.addEventListener('click', function () {
//                     // Request tab endpoint on our server
//                     fetch(`/tab?songName=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artist)}`)
//                         .then(response => response.text()) // Get the response as text
//                         .then(data => {
//                             // Create a new div for the SVG data
//                             const svgDiv = document.createElement("div");
//                             // Create a new SVG for the tab lines
//                             const linesSVG =    
//                 '<svg xmlns="http://www.w3.org/2000/svg" width="610" viewBox="-15 -34 610 143" class="Cw81bf"><path d="M0,0v65M0,0H399.3999938964844M0,13H399.3999938964844M0,26H399.3999938964844M0,39H399.3999938964844M0,52H399.3999938964844M0,65H18m16,0H41m16,0H65m16,0H88m16,0H111m16,0H135m16,0H158m16,0H181m16,0H205m16,0H228m16,0H251m16,0H275m16,0H298m16,0H321m16,0H345m16,0H368m16,0H399.3999938964844" class="B6413b" stroke="black"></path></svg>';

//                             if (data) {
//                                 svgDiv.innerHTML = linesSVG + data; // Add the lines SVG and the tab SVG to the div
//                             } else {
//                                 svgDiv.textContent = 'No tab available.';
//                             }

//                             // Append svgDiv to newDiv
//                             newDiv.appendChild(svgDiv);
//                         })
//                         .catch(error => console.error('Error:', error));
//                 });

//                 // Add song name, artist and button to the div
//                 newDiv.textContent = songName + ' by ' + artist;
//                 newDiv.appendChild(button);

//                 // Append the div to the songList div in the page
//                 document.getElementById('pulled-guitar-tab').appendChild(newDiv);
//             });
//         });
//     }
// });
