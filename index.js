
const express = require("express");
const session = require("express-session");
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const port = 3000;

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

// Helper function to introduce delay
function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}

async function fetchGuitarTab(songName, artist) {
    const url = `https://www.songsterr.com/a/wa/bestMatchForQueryString?s=${encodeURIComponent(songName)}&a=${encodeURIComponent(artist)}`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    
    await page.goto(url, {waitUntil: 'networkidle2'});

    // Add delay
    await delay(1000); // waits for 1 second

    // Select divs with class D2820n and data-line attribute
    const dataLines = await page.$$('div.D2820n[data-line]');
    console.log(dataLines.length);
    if (!dataLines.length) {
        console.log('Found 0 lines of guitar tab');
        return null;
    }

    //------------JOE STUFF--------------
    const lucky3rdDataLine = dataLines[3];
    const lucky3rdDataLineHtml = await page.evaluate(el => el.outerHTML, lucky3rdDataLine);

    const thirdsvgElements = await lucky3rdDataLine.$$('svg');

    //-----------Ruben stuff ------------
    // const randomDataLine = dataLines[Math.floor(Math.random() * dataLines.length)];
    // const randomDataLineHtml = await page.evaluate(el => el.outerHTML, randomDataLine);

    //const svgElements = await randomDataLine.$$('svg');

    // Add another delay
    await delay(1000); // waits for 1 second

    if (!thirdsvgElements.length) {// if (!svgElements.length) {
        console.log('Found 0 SVG elements in selected line');
        return null;
    }

    console.log('Loaded HTML data into Puppeteer');
    console.log(`Found ${dataLines.length} lines of guitar tab`);
    console.log(`Selected 3rd line outer HTML: ${lucky3rdDataLineHtml}`);
    // console.log(`Selected random line outer HTML: ${randomDataLineHtml}`);
    
    // Get the first SVG element and log its HTML
    const svgElement = thirdsvgElements[0];//svgElements[0];

    // Get the 'g' elements within the SVG
    const gElements = await svgElement.$$('g');
    console.log('Number of g elements:', gElements.length);

    // Iterate over each 'g' element and log its HTML
    for (let gElement of gElements) {
        const gHtml = await page.evaluate(g => g.outerHTML, gElement);
        console.log('g element:', gHtml);
    }

    // Get the outerHTML of the SVG element
    const svgHtml = await page.evaluate(svg => svg.outerHTML, svgElement);
    console.log('First SVG element:', svgHtml);

    await browser.close();
    //return svgHtml;
    return lucky3rdDataLineHtml; //------------JOSEPH'S, EDIT -----------------------
}




//Get request to fetch guitar tabs 
app.get('/tab', async function (req, res) {
    const { songName, artist } = req.query;
    console.log(`=============From .get(/tab) -- songname: ${songName} -- artist ${artist}=================`);
    
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

app.listen(3000, function () {
    console.log("Node application listening on port " + port);
});

// async function fetchGuitarTab(songName, artist) {
//     try {
//         const response = await axios.get(`https://www.songsterr.com/a/wa/search?pattern=${songName}+${artist}`);
//         const $ = cheerio.load(response.data);

        
//         const guitarTab = $('.guitar-tab-class').text();

//         return guitarTab;
//     } catch (error) {
//         console.error('Error fetching guitar tab:', error);
//         return null;
//     }
// }
