
const express = require("express");
const session = require("express-session");
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const port = 3000;
const puppeteer = require('puppeteer');

const app = express();

//Creating remote paths, for our static files
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/template', express.static(path.join(__dirname, 'template')));
app.use('/data', express.static(path.join(__dirname, 'app/data')));

// Serve index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/index.html'));
});

app.get('/main', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/main.html'));
});

app.get('/settings', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/settings.html'));
});

app.get('/userProfile', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/userProfile.html'));
});

app.get('/questions', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/questions.html'));
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/login.html'));
});

app.get('/dummyRoom', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/dummyRoom.html'));
});

app.get('/practiceRoom', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/practiceRoom.html'));
});

app.get('/userskill', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/userSkill.html'));
});

app.get('/addFriend', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/addFriend.html'));
});

app.get('/social', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/social.html'));
});

app.get('/fullTab', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/tab.html'));
});

app.get('/favourites', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/favourites.html'));
});


//Function to fetch a segment from a guitar tab, data-line="3"
async function fetchGuitarTab(songName, artist) {
    // Log the song and artist being fetched
    console.log('Fetching full guitar tab for', songName, 'by', artist);

    // Construct the URL for fetching the guitar tab
    const url = `https://www.songsterr.com/a/wa/bestMatchForQueryString?s=${encodeURIComponent(songName)}&a=${encodeURIComponent(artist)}`;
    console.log('URL is', url);

    // Launch a new browser instance using Puppeteer
    const browser = await puppeteer.launch();
    // Open a new page in the browser
    const page = await browser.newPage();

    console.log('Going to page...');
    // Navigate to the URL and wait until the network is idle
    await page.goto(url, { waitUntil: 'networkidle2' });
    console.log('Page loaded');

    // Select a div element on the page with a data-line attribute of "3"
    const dataLine = await page.$('div.D2820n[data-line="3"]');
    if (!dataLine) {
        console.log('Could not find a div with data-line=3');
        return null;
    }

    console.log('Loaded data-line 3 into Puppeteer');

    // Select an SVG element within the div
    const svgElement = await dataLine.$('svg');
    if (!svgElement) {
        console.log('Could not find an SVG element in div with data-line=3');
        return null;
    }

    // Get the HTML of the SVG element
    const svgHtml = await page.evaluate(svgElement => {
        // Create a deep clone of the svgElement
        const clone = svgElement.cloneNode(true); 
        // Remove the last path element within a 'g' element
        const unwantedPath = clone.querySelector('g > path:last-child');
        if (unwantedPath) unwantedPath.remove();

        // Find the path element and duplicate it
        const pathElement = clone.querySelector('path');
        if (pathElement) {
            // Create a deep clone of the pathElement
            const duplicatePath = pathElement.cloneNode(true);
            // Append the duplicate path to the clone
            clone.appendChild(duplicatePath);
            // Add a stroke attribute with a value of "black" to the original path
            pathElement.setAttribute("stroke", "black"); 
            // Append the duplicate path to the clone again
            clone.appendChild(duplicatePath);
        }

        // Return the HTML of the cloned and modified SVG element
        return clone.outerHTML;
    }, svgElement);
    

    console.log('First SVG element without second path:', svgHtml);

    // Close the browser
    await browser.close();
    // Return the modified SVG HTML
    return svgHtml;
}

//Function to fetch entire guitar tab 
async function fetchFullGuitarTab(songName, artist) {
    // Define the URL using query strings for songName and artist
    const url = `https://www.songsterr.com/a/wa/bestMatchForQueryString?s=${encodeURIComponent(songName)}&a=${encodeURIComponent(artist)}`;

    // Launch a new Puppeteer browser and open a new page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to the defined URL, waiting until the network is idle
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Select the section with the id "tablature" on the page
    const sectionElement = await page.$('section#tablature');
    if (!sectionElement) {
        console.log('Could not find a section with id "tablature"');
        return null;
    }

    console.log('Loaded section with id "tablature" into Puppeteer');

    // Get all data-line elements within the "tablature" section
    const dataLineElements = await sectionElement.$$('div[data-line]');

    // Select elements 1 to 6 from the dataLineElements array
    const selectedElements = dataLineElements.slice(1, 7);

    const modifiedElements = [];

    // Loop through each selected element
    for (let element of selectedElements) {
        // Use Puppeteer's evaluate() function to manipulate the DOM in the page context
        const elementHtml = await page.evaluate((element) => {
            // Deep clone the current element
            const clone = element.cloneNode(true);

            // Get all SVG elements within the cloned element
            const svgElements = clone.getElementsByTagName('svg');

            if (svgElements.length >= 2) {
                // If there are at least 2 SVG elements, remove the second one
                clone.removeChild(svgElements[1]);
            }

            if (svgElements.length > 0) {
                // If there's at least one SVG element, add a 'stroke' attribute to the path of the first SVG
                const pathElement = svgElements[0].querySelector('path');
                if (pathElement) {
                    pathElement.setAttribute('stroke', 'black');
                }
            }

            // Create an XMLSerializer and use it to convert the cloned element to string
            var serializer = new XMLSerializer();
            var elementStr = serializer.serializeToString(clone);

            return elementStr;
        }, element);

        // Add the stringified element to the modifiedElements array
        modifiedElements.push(elementHtml);
        console.log('Modified element:', elementHtml);
    }

    // Close the Puppeteer browser
    await browser.close();

    // Return the array of modified elements
    return modifiedElements;
}

//Get request to fetch guitar tabs 
app.get('/tab', async function (req, res) {
    // Destructure songName and artist from the query parameters in the request
    const { songName, artist } = req.query;

    // If either 'songName' or 'artist' are missing, send a 400 status code with an error message
    if (!songName || !artist) {
        return res.status(400).send("Missing 'songName' or 'artist' query parameters.");
    }

    // Call the fetchGuitarTab function with songName and artist as arguments
    const guitarTab = await fetchGuitarTab(songName, artist);
    // If the fetchGuitarTab function returns something truthy (i.e., the fetch was successful),
    if (guitarTab) {
        // then send the guitar tab to the client
        res.send(guitarTab);
    } else {
        // If the fetchGuitarTab function returns something falsy (i.e., the fetch was not successful),
        // then send a 500 status code with an error message
        res.status(500).send("Failed to fetch guitar tab.");
    }
});

//Get request to fetch full guitar tab
app.get('/fullguitartab', async function (req, res) {
    // Log that we have entered the '/fulltab' endpoint
    console.log('Inside /fulltab endpoint');
    
    // Destructure songName and artist from the query parameters in the request
    const { songName, artist } = req.query;

    // If either 'songName' or 'artist' are missing, send a 400 status code with an error message
    if (!songName || !artist) {
        return res.status(400).send("Missing 'songName' or 'artist' query parameters.");
    }

    // Call the fetchFullGuitarTab function with songName and artist as arguments
    const guitarTab = await fetchFullGuitarTab(songName, artist);
    
    // If the fetchFullGuitarTab function returns something truthy (i.e., the fetch was successful),
    if (guitarTab) {
        // then log the fetched guitar tab and 
        console.log(guitarTab)
        // send the guitar tab to the client
        res.send(guitarTab); 
    } else {
        // If the fetchFullGuitarTab function returns something falsy (i.e., the fetch was not successful),
        // then send a 500 status code with an error message
        res.status(500).send("Failed to fetch guitar tab.");
    }
});


app.listen(3000, function () {
    console.log("Node application listening on port " + port);
});

