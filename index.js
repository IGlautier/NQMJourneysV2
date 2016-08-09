process.env.DEBUG = "nqm-app-minimal*";
var log = require("debug")("nqm-app-minimal");
var express = require('express');
var app = express();
var path = require('path');
var util = require("util");
var config = require("./config.json");
var session = require('express-session');
var _fleetManager = require('./fleetManager.js');
var _journeyManager = require('./journeyManager.js');

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'blahblahblah', resave: true, saveUninitialized: true })); 
app.set('view engine', 'pug');

// Authentication helper - include this on any route that should be secure
function ensureAuthenticated(req,res,next) {
  // Check if have a valid token for this session.
  if (req.session && req.session.token) {
    next();    
  } else {
    res.redirect("/login");
  }  
}

// Default route 
app.get('/', ensureAuthenticated, function(req, res) {
  _fleetManager.getFleet(req.session.token, function(data) {
    res.render('index', {fleet: data});
  });  
});

app.get('/journeys', ensureAuthenticated, function(req, res){
  _journeyManager.getJourneys(req.query.vehicle, req.session.token, function(data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
  });
});

// Render login page, which will redirect to the TDX auth server with a return URL to our /authCB route.
app.get("/login", function(req, res) {
  var tdxURL = util.format("%s/auth?rurl=%s/authCB", config.authServer, config.hostURL);  
  res.render("login", { loginURL: tdxURL });
});

// TDX auth server will callback here after authentication.
app.get("/authCB", function(req, res) {
  if (req.query.access_token) {
    // Store the access token with the session.
    log("token is %s",req.query.access_token);
    req.session.token = req.query.access_token;
  } else {
    log("failed to get access token");
  }
  // Redirect to home page.
  res.redirect("/");
});

app.get("/logout", function(req,res) {
  // Clear session
  req.session.destroy();
  res.redirect("/");
});

app.listen(8084);