//----------------------------------------------------------
// This function is the only function that's called.
// This strategy gives us better control of the page.
//----------------------------------------------------------
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            insertNameFromFirestore(user);
            getBookmarks(user)
        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();

//----------------------------------------------------------
// This function takes input param User's Firestore document pointer
// and retrieves the "saved" array (of bookmarks) 
// and dynamically displays them in the gallery
//----------------------------------------------------------
function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {

					  // Get the Array of bookmarks
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);
						
						// Get pointer the new card template
            let newcardTemplate = document.getElementById("savedCardTemplate");

						// Iterate through the ARRAY of bookmarked hikes (document ID's)
            bookmarks.forEach(thisHikeID => {
                console.log(thisHikeID);
                db.collection("hikes").doc(thisHikeID).get().then(doc => {
                    var title = doc.data().name; // get value of the "name" key
                    var hikeCode = doc.data().code; //get unique ID to each hike to be used for fetching right image
                    var hikeLength = doc.data().length; //gets the length field
                    var docID = doc.id;  //this is the autogenerated ID of the document
                    
                    //clone the new card
                    let newcard = newcardTemplate.content.cloneNode(true);

                    //update title and some pertinant information
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-length').innerHTML = hikeLength + "km";
                    newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg
                    newcard.querySelector('a').href = "eachHike.html?docID=" + docID;

                    //NEW LINE: update to display length, duration, last updated
                    newcard.querySelector('.card-length').innerHTML =
                        "Length: " + doc.data().length + " km <br>" +
                        "Duration: " + doc.data().hike_time + "min <br>" +
                        "Last updated: " + doc.data().last_updated.toDate().toLocaleDateString();

										//Finally, attach this new card to the gallery
                    hikeCardGroup.appendChild(newcard);
                })
            });
        })
}