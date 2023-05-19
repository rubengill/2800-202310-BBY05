const express = require("express");
const session = require("express-session");
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

//Creating remote paths, for our static files
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/template', express.static(path.join(__dirname, 'template')));
app.use('/data', express.static(path.join(__dirname, 'app/data')));

// Serve login.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/login.html'));
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

app.get('/userskill', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/userskill.html'));
});

// app.get('/api/guitar-tabs', async (req, res) => {
//     const { songName, artist } = req.query;

//     try {
//         const guitarTab = await fetchGuitarTab(songName, artist);
//         res.json({ guitarTab });
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while fetching guitar tab data' });
//     }
// });

app.listen(3000, function () {
    console.log('App is listening on port 3000!');
});

