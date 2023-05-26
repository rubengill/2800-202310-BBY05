
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

//Rubens Function 
async function fetchGuitarTab(songName, artist) {
    console.log('Fetching full guitar tab for', songName, 'by', artist);

    const url = `https://www.songsterr.com/a/wa/bestMatchForQueryString?s=${encodeURIComponent(songName)}&a=${encodeURIComponent(artist)}`;
    console.log('URL is', url);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log('Going to page...');
    await page.goto(url, { waitUntil: 'networkidle2' });
    console.log('Page loaded');

    // Select div with data-line=3
    const dataLine = await page.$('div.D2820n[data-line="3"]');
    if (!dataLine) {
        console.log('Could not find a div with data-line=3');
        return null;
    }

    console.log('Loaded data-line 3 into Puppeteer');

    const svgElement = await dataLine.$('svg');
    if (!svgElement) {
        console.log('Could not find an SVG element in div with data-line=3');
        return null;
    }

    // Get the outerHTML of the SVG element
    const svgHtml = await page.evaluate(svgElement => {
        const clone = svgElement.cloneNode(true); // Create a deep clone of the svgElement
        const unwantedPath = clone.querySelector('g > path:last-child');
        if (unwantedPath) unwantedPath.remove();

        // Duplicate the path element
        const pathElement = clone.querySelector('path');
        if (pathElement) {
            const duplicatePath = pathElement.cloneNode(true);
            clone.appendChild(duplicatePath);
            pathElement.setAttribute("stroke", "black"); // Add stroke="black" to the original path
            clone.appendChild(duplicatePath);
        }

        return clone.outerHTML;
    }, svgElement);
    

    console.log('First SVG element without second path:', svgHtml);

    await browser.close();
    return svgHtml;
}

//Function to fetch entire guitar tab 
async function fetchFullGuitarTab(songName, artist) {
    const url = `https://www.songsterr.com/a/wa/bestMatchForQueryString?s=${encodeURIComponent(songName)}&a=${encodeURIComponent(artist)}`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Select section with id "tablature"
    const sectionElement = await page.$('section#tablature');
    if (!sectionElement) {
        console.log('Could not find a section with id "tablature"');
        return null;
    }

    console.log('Loaded section with id "tablature" into Puppeteer');

    // Get all data-line elements within the section#tablature
    const dataLineElements = await sectionElement.$$('div[data-line]');

    // Get elements 1 to 6
    const selectedElements = dataLineElements.slice(1, 7);

    const modifiedElements = [];

    for (let element of selectedElements) {
        const elementHtml = await page.evaluate((element) => {
            const clone = element.cloneNode(true); // Create a deep clone of the element

            // Get all SVG elements within the clone
            const svgElements = clone.getElementsByTagName('svg');

            if (svgElements.length >= 2) {
                // Remove the second SVG
                clone.removeChild(svgElements[1]);
            }

            if (svgElements.length > 0) {
                // Get the path element of the first SVG and add stroke attribute
                const pathElement = svgElements[0].querySelector('path');
                if (pathElement) {
                    pathElement.setAttribute('stroke', 'black');
                }
            }

            // Create XMLSerializer and serialize the cloned element
            var serializer = new XMLSerializer();
            var elementStr = serializer.serializeToString(clone);

            return elementStr;
        }, element);

        modifiedElements.push(elementHtml);
        console.log('Modified element:', elementHtml);
    }

    await browser.close();
    return modifiedElements;
}




//Joes Function
// async function fetchGuitarTab(songName, artist) {
//     const url = `https://www.songsterr.com/a/wa/bestMatchForQueryString?s=${encodeURIComponent(songName)}&a=${encodeURIComponent(artist)}`;

//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.goto(url, { waitUntil: 'networkidle2' });


//     // Select div with data-line=3
//     const dataLine = await page.$('div.D2820n[data-line="3"]');
//     if (!dataLine) {
//         console.log('Could not find a div with data-line=3');
//         return null;
//     }

//     console.log('Loaded data-line 3 into Puppeteer');

//     const svgElement = await dataLine.$('svg');
//     if (!svgElement) {
//         console.log('Could not find an SVG element in div with data-line=3');
//         return null;
//     }
//     function delay(time) {
//         return new Promise(function (resolve) {
//             setTimeout(resolve, time)
//         });
//     }

//Get request to fetch guitar tabs 
app.get('/tab', async function (req, res) {
    const { songName, artist } = req.query;

    if (!songName || !artist) {
        return res.status(400).send("Missing 'songName' or 'artist' query parameters.");
    }

    const guitarTab = await fetchGuitarTab(songName, artist);
    if (guitarTab) {
        res.send(guitarTab); // Send guitarTab as a string
    } else {
        res.status(500).send("Failed to fetch guitar tab.");
    }
});

//Get request to fetch full guitar tab
app.get('/fullguitartab', async function (req, res) {
    console.log('Inside /fulltab endpoint');
    const { songName, artist } = req.query;

    if (!songName || !artist) {
        return res.status(400).send("Missing 'songName' or 'artist' query parameters.");
    }

    const guitarTab = await fetchFullGuitarTab(songName, artist);
    if (guitarTab) {
        console.log(guitarTab)
        res.send(guitarTab); // Send guitarTab as a string
    } else {
        res.status(500).send("Failed to fetch guitar tab.");
    }
});


app.listen(3000, function () {
    console.log("Node application listening on port " + port);
});

