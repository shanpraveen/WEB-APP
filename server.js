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
const exphbs = require('express-handlebars');
var path = require('path');
var app = express();

app.use(express.urlencoded({ extended: true }));

var collegeData = require('./modules/collegeData');

app.use(express.static(path.join(path.resolve(), 'public')));

app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        }
    }
}));

app.set('view engine', '.hbs');

app.set('views', path.join(__dirname, 'views'));

// Middleware to set the active route
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
   });

// Serve home page
app.get("/", function(req, res) {
    res.render('home');
});

// Serve about page
app.get("/about", function(req, res) {
    res.render('about');
});

// Serve HTML demo page
app.get("/htmlDemo", function(req, res) {
    res.render('htmlDemo');
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
            .then(function(data) {
                res.render("students", {students: data}); 
            })
            .catch(function(err) {
                res.render("students", {message: "no results"});
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

app.get('/student/:num', (req, res) => {
    collegeData.getStudentsByNum(req.params.num)
        .then(data => {
            // res.json(data))
            res.render("student", {student: data[0]});
        })
        .catch(err => {
            // res.json({ message: err })
            res.render("student", {message: "no results"});
        });
});

app.post('/student/update', (req, res) => {
    let studentNum = parseInt(req.body.studentNum, 10);
    let course = parseInt(req.body.course, 10);

    if (isNaN(studentNum) || isNaN(course)) {
        return res.status(400).send('Invalid input: studentNum and course must be numbers');
    }

    const updatedStudent = {
        studentNum: studentNum,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        addressStreet: req.body.addressStreet,
        addressCity: req.body.addressCity,
        addressProvince: req.body.addressProvince,
        TA: req.body.TA === 'on',
        status: req.body.status,
        course: course
    };
    collegeData.updateStudent(updatedStudent)
        .then(() => {
            res.redirect('/students');
        })
        .catch(err => {
            res.status(500).send("Unable to update student: " + err);
        });
});

// Get TAs
// app.get("/tas", function(req, res) {
//     collegeData.getTAs()
//         .then(function(tas) {
//             res.json(tas);
//         })
//         .catch(function(err) {
//             res.json({ message: "No results" });
//         });
// });

// Get courses
app.get("/courses", function(req, res) {
    collegeData.getCourses()
        .then(function(data) {
            res.render("courses", {courses: data});
        })
        .catch(function(err) {
            res.render("courses", {message: "no results"});
        });
});

app.get('/course/:id', (req, res) => {
    collegeData.getCourseById(req.params.id)
        .then(data => {
            res.render("course", {course: data[0]});
        })
        .catch(err => {
            res.render("course",{ message: "no results" });
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
