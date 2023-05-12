const express = require("express");
const admin = require("firebase-admin");
const session = require("express-session");
const path = require('path');

const app = express();

// Serve static assets
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Serve login.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/login.html'));
});

app.get('/main.html', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/main.html'));
});

app.get('/settings.html', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/settings.html'));
});

app.get('/userProfile.html', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/userProfile.html'));
});

app.get('/login.html', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/login.html'));
});


app.listen(3000, function () {
    console.log('App is listening on port 3000!');
  });