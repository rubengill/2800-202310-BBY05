const express = require("express");
const session = require("express-session");
const path = require('path');

const app = express();

//Creating remote paths, for our static files
app.use('/scripts', express.static(path.join(dirname, 'scripts')));
app.use('/css', express.static(path.join(dirname, 'public/css')));
app.use('/img', express.static(path.join(dirname, 'public/img')));
app.use('/template', express.static(path.join(dirname, 'template')));
app.use('/data', express.static(path.join(dirname, 'app/data')));

// Serve login.html
app.get('/', function (req, res) {
    res.sendFile(path.join(dirname, 'app/html/login.html'));
});

app.get('/main.html', function (req, res) {
    res.sendFile(path.join(dirname, 'app/html/main.html'));
});

app.get('/settings.html', function (req, res) {
    res.sendFile(path.join(dirname, 'app/html/settings.html'));
});

app.get('/app/html/userProfile.html', function (req, res) {
    res.sendFile(path.join(dirname, 'app/html/userProfile.html'));
});

app.get('/questions.html', function (req, res) {
    res.sendFile(path.join(dirname, 'app/html/questions.html'));
});

app.get('/login.html', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/html/login.html'));
});


app.listen(3000, function () {
    console.log('App is listening on port 3000!');
  });