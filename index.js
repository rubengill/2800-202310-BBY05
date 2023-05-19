const express = require("express");
const session = require("express-session");
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

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
    res.sendFile(path.join(__dirname, 'app/html/userskill.html'));
});

app.get('/addFriend', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/addFriend.html'));
});

app.get('/social', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/social.html'));
});

// async function fetchGuitarTab(songName, artist) {
//     console.log('fetchGuitarTab called with songName:', songName, 'and artist:', artist);

//     try {
//         const songNameFormatted = songName.toLowerCase().replace(/ /g, '-');
//         const artistFormatted = artist.toLowerCase().replace(/ /g, '-');
//         console.log('Formatted songName:', songNameFormatted, 'and artist:', artistFormatted);

//         const url = `https://www.songsterr.com/a/wsa/${artistFormatted}-${songNameFormatted}-tab-s`;
//         console.log('Fetching data from URL:', url);

//         const response = await axios.get(url);
//         console.log('Received response from Songsterr API:', response);

//         const $ = cheerio.load(response.data);
//         console.log('Loaded HTML data into Cheerio');

//         const lines = $('[data-line]');
//         console.log('Found', lines.length, 'lines of guitar tab');

//         const randomLineIndex = Math.floor(Math.random() * lines.length);
//         console.log('Selected random line index:', randomLineIndex);

//         const randomLine = lines[randomLineIndex];
//         console.log('Selected line:', randomLine);

//         const guitarTab = $(randomLine).html();
//         console.log('Extracted guitar tab:', guitarTab);

//         return guitarTab;
//     } catch (error) {
//         console.error('Error fetching guitar tab:', error);
//         return null;
//     }
// }

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
