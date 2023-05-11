const express = require("express");
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


app.listen(3000, function () {
    console.log('App is listening on port 3000!');
  });