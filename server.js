/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Praveen Shanmugalingam Student ID: 156224230 Date: 2024-07-17
*
* Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require('path');
var app = express();

app.use(express.urlencoded({ extended: true }));

var collegeData = require('./modules/collegeData');

app.use(express.static(path.join(path.resolve(), 'public')));

// Serve home page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Serve about page
app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Serve HTML demo page
app.get("/htmlDemo", function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
});

// Serve add student page
app.get('/students/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
});

// Add student
app.post('/students/add', (req, res) => {
    console.log('request body',req.body);
    collegeData.addStudent(req.body).then(() => {
        res.redirect('/students');
    }).catch(err => {
        res.redirect('/students');
    });
});

// Get students
app.get("/students", function(req, res) {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then(function(students) {
                res.json(students);
            })
            .catch(function(err) {
                res.json({ message: err });
            });
    } else {
        collegeData.getAllStudents()
            .then(function(students) {
                res.json(students);
            })
            .catch(function(err) {
                res.json({ message: "No results" });
            });
    }
});

// Serve add student page
app.get('/students/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
});

// Add student
app.post('/students/add', (req, res) => {
    console.log('request body',req.body);
    collegeData.addStudent(req.body).then(() => {
        res.redirect('/students');
    }).catch(err => {
        res.redirect('/students');
    });
});

// Get TAs
app.get("/tas", function(req, res) {
    collegeData.getTAs()
        .then(function(tas) {
            res.json(tas);
        })
        .catch(function(err) {
            res.json({ message: "No results" });
        });
});

// Get courses
app.get("/courses", function(req, res) {
    collegeData.getCourses()
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json({ message: err });
        });
});

// Catch-all for 404 errors
app.use(function(req, res, next) {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Initialize the server
collegeData.initialize()
    .then(function() {
        app.listen(HTTP_PORT, function() {
            console.log("Server listening on port " + HTTP_PORT);
        });
    })
    .catch(function(err) {
        console.error(err);
    });

module.exports = app;
