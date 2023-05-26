var isPlaying = false;
var memoryItems = ["bowie", "acdc", "taylor", "jimi"];
var memoryValues = [];
var memoryTilesIds = [];
var tilesFlipped = 0;
var noClicks = 0;

// duplicate array to get pairs
memoryItems = memoryItems.concat(memoryItems);


let favClicked = false;
let shareClicked = false;

document.getElementById("readyToRock").addEventListener("click", function() {
        shareClicked = true;
        checkBothClicked();
        document.getElementById("fav").style.backgroundColor = "#197040";     
});

document.getElementById("fav").addEventListener("click", function() {
    if(shareClicked == true) {
        favClicked = true;
        checkBothClicked();
    } else {
        //normal
        console.log("Favourite button pressed normally.");
    }
});

function checkBothClicked() {
    if (favClicked && shareClicked) {
        // Reset the click status
        favClicked = false;
        shareClicked = false;
        document.getElementById("fav").style.backgroundColor = "#198754"; 

        noClicks++;
        console.log("rock and fav" + noClicks);
        easterEgg();
        if(noClicks == 8) {
            isPlaying = true;
            document.getElementById("easterEgg").innerHTML = "";
            newBoard();
        }
    }
}

function easterEgg() {
    if(!isPlaying) {
        let easterEgg = document.getElementById("easterEgg");
        easterEgg.innerHTML +=
            "<img src='/img/markus-ok.png' alt='Image description here' width='150' height='80'>";
    }
}



function newBoard() {
    tilesFlipped = 0;
    var output = '';
    memoryItems = shuffle(memoryItems);

    for (var i = 0; i < memoryItems.length; i++) {
        output += '<div id="tile_' + i + '" class="memory-item" onclick="flipTile(this,\'' + memoryItems[i] + '\')">'
            + "<img src='/img/markus-ok.png' alt='Image description here' width='150' height='80'>"
            +'</div>';
    }

    document.getElementById('game').innerHTML = output;
}

function shuffle(array) {
    var currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function flipTile(tile, val) {
    
    console.log("flipTile(" + tile + " " + val + ")");

    // if (tile.innerHTML == "e" && memoryValues.length < 2) {
    if (memoryValues.length < 2) {
        tile.style.background = '#FFF';
        tile.innerHTML = val;

        if (memoryValues.length == 0) {

            memoryValues.push(val);
            memoryTilesIds.push(tile.id);
            var tile_1 = document.getElementById(memoryTilesIds[0]);
            tile_1.innerHTML = `<img src='/img/${val}.jpg' alt='${val}' width='150' height='80'>`;
            console.log("pushed into memoryVlues[0]");

        } else if (memoryValues.length == 1) {

            memoryValues.push(val);
            memoryTilesIds.push(tile.id);
            var tile_2 = document.getElementById(memoryTilesIds[1]);
            tile_2.innerHTML = `<img src='/img/${val}.jpg' alt='${val}' width='150' height='80'>`;
            console.log("pushed into memoryVlues[1]");

            if (memoryValues[0] == memoryValues[1]) {

                console.log("match made");

                tilesFlipped += 2;
                // Clear both arrays
                memoryValues = [];
                memoryTilesIds = [];
                // Check to see if the whole board is cleared
                if (tilesFlipped == memoryItems.length) {
                    alert("You've won the easter egg!");
                    document.getElementById('game').innerHTML = "";

                    noClicks = 0;
                    isPlaying = false;
                    //newBoard(); -- this resets the board
                }
            } else {
                function flipBack() {
                    // Flip the 2 tiles back over
                    var tile_1 = document.getElementById(memoryTilesIds[0]);
                    var tile_2 = document.getElementById(memoryTilesIds[1]);
                    tile_1.style.background = 'url(markus-ok.png) no-repeat';
                    tile_1.innerHTML = "<img src='/img/markus-ok.png' alt='Image description here' width='150' height='80'>";
                    tile_2.style.background = 'url(markus-ok.png) no-repeat';
                    tile_2.innerHTML = "<img src='/img/markus-ok.png' alt='Image description here' width='150' height='80'>";
                    // Clear both arrays
                    memoryValues = [];
                    memoryTilesIds = [];
                }
                setTimeout(flipBack, 700);
            }
        }
    }
}

let timeInterval = 60 * 60 * 1000;

function updateSongOfTheDay() {
    const lastUpdate = sessionStorage.getItem('lastUpdate');
    const now = Date.now();

    // Check if it's been more than two minutes since the last update
    if (lastUpdate && now - lastUpdate < timeInterval) {
        const songData = JSON.parse(sessionStorage.getItem('songData'));

        // Use stored song data
        updateSongData(songData);
        return;
    }

    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            let uid = user.uid;
            let songData;
            const random = Math.random();

            let skillLevel;
            try {
                const doc = await db
                    .collection("users")
                    .doc(uid)
                    .get();
                
                if (doc.exists) {
                    skillLevel = doc.data().skillLevel;
                }

                const songDoc = await db
                    .collection("database")
                    .where("Random", ">=", random)
                    .orderBy("Random")
                    .limit(1)
                    .get();
        
                if (!songDoc.empty) {
                    songData = songDoc.docs[0].data();

                    // Store song data and update time in sessionStorage
                    sessionStorage.setItem('songData', JSON.stringify(songData));
                    sessionStorage.setItem('lastUpdate', String(now));

                    // Use new song data
                    updateSongData(songData);
                }
            } catch (error) {
                console.error("Error fetching data:", error); // Log any errors
                return;
            }
        }
    });
}

function updateSongData(songData) {
    let songCon = document.getElementById("songcon");
    let name = songCon.querySelector("#songname");
    let author = songCon.querySelector("#author");

    name.innerHTML = songData["Song Name"];
    author.innerHTML = songData.Artist;
}

window.onload = function() {
    updateSongOfTheDay();
    setInterval(updateSongOfTheDay, timeInterval); // 2 minutes
};

