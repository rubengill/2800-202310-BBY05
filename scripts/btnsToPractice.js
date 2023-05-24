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

async function skipSong(event) {
    event.preventDefault(); //default is to refresh the page

    // Get the songs
    let songs = songManager.getSongs();

    // Remove the current song
    songs.splice(currentTask - 1, 1);

    // Fetch a new song and add it to the array
    await songManager.getRandomSongs(uid);
    const newSongs = songManager.getSongs();
    const newSong = newSongs[newSongs.length - 1]; // The last song is the new one

    // Add the new song to the same position
    songs.splice(currentTask - 1, 0, newSong);

    // Update the page
    updatePage();
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

    let songs = songManager.getSongs();
    // Display the song for the current task
    displaySong(songs, currentTask);
    // if (window.songs) {
    //     displaySong(window.songs, currentTask);
    // }
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
