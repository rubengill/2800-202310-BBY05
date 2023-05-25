
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
    console.log(url)

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // await page.setViewport({ width: 1920, height: 1080 });
    
    await page.goto(url, {waitUntil: 'networkidle2'});

    

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
        return clone.outerHTML;
    }, svgElement);

    console.log('First SVG element without second path:', svgHtml);

    await browser.close();
    return svgHtml;
}






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
