function addButton() {
    const container = document.getElementById(myContainer);
    const topSection = container.querySelector(".topSection");
    topSection.innerHTML =
        `<h3> TASK ${currentTask} </h3> ` +
        "<button onclick='previousTask(event);'>previous</button>" +
        `<button onclick='skipTask(event);'>skip</button>` +
        "<button onclick='nextTask(event);'>next</button>";
}

window.onload = function () {
    addButton();
};

function previousTask(event) {
    event.preventDefault();
    if (currentTask != FIRST_TASK) {
        currentTask--;
    }
    updatePage();
}

async function skipTask(event) {
    event.preventDefault();
    
    // Get the current user
    const user = firebase.auth().currentUser;
    if (user) {
        const uid = user.uid;
        
        // Get the current song
        const song = songs[currentTask - 1];  // Assumes 'songs' array is globally accessible

        // Delete the current song from Firestore
        await db.collection('users').doc(uid).collection('songs').doc(song["Song Name"]).delete();
        
        // Get a new song and add it to Firestore
        const newSongs = await getRandomSongs(uid);
        songs = newSongs; // Update the 'songs' array

        // Update the display
        updatePage();
    } else {
        console.log('No user is signed in.');
    }
}

function nextTask(event) {
    event.preventDefault();
    if (currentTask != LAST_TASK) {
        currentTask++;
    }
    updatePage();
}

function updatePage() {
    updateMyContainer();
    addButton();

    // Display the song for the current task
    if (window.songs) {
        displaySong(window.songs, currentTask);
    }
    currContainer = "cardTask" + currentTask;
    const container = document.getElementById(currContainer);

    // container.style = "display: none;";
//---------might be useful if you need to check the css of an element---------------------
    // if ($(container).css("display") == "none") {
    //     // true
    // }
    container.style = "display: block;";

    for (let i = 1; i <= LAST_TASK; i++) {
        //show this task card
        if (i != currentTask) {
            currContainer = "cardTask" + i;
            const others = document.getElementById(currContainer);
            others.style = "display: none;";
        }
        //hide all others
    }
    console.log("------updatePage()  done----------")
}
