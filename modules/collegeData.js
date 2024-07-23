const fs = require('fs');
const path = require('path');  


const studentLink = path.join(__dirname,'..', 'data', 'students.json');
const courseLink = path.join(__dirname,'..', 'data', 'courses.json');

class Data {                    
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

const initialize = () => {
    return new Promise((resolve, reject) => { 
        fs.readFile(studentLink, 'utf8', (err, studentData) => {        
            if (err) {                                                            
                reject("Unable to read students.json");                         
                return;                                                    
            }
            let students = JSON.parse(studentData);

            fs.readFile(courseLink, 'utf8', (err, courseData) => {    
                if (err) {
                    reject("Unable to read courses.json");
                    return;
                }
                let courses = JSON.parse(courseData);
                dataCollection = new Data(students, courses);
                resolve();
            });
        });
    });
};

const getAllStudents = () => {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length === 0) {
            reject("No results.");
        } else {
            resolve(dataCollection.students);
        }
    });
};

// const getTAs = () => {
//     return new Promise((resolve, reject) => {
//         const TAs = dataCollection.students.filter(student => student.TA === true);
//         if (TAs.length === 0) {
//             reject("No results.");
//         } else {
//             resolve(TAs);
//         }
//     });
// };

const getCourses = () => {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length === 0) {
            reject("no results returned");
        } else {
            resolve(dataCollection.courses);
        }
    });
};

const getCourseById = (id) => {
    return new Promise((resolve, reject) => {
        const selectedCourse = dataCollection.courses.filter(course => course.courseId === parseInt(id));
        if (selectedCourse.length > 0) {
            resolve(selectedCourse);
        } else {
            reject('query returned 0 results');
        }
    });
};

const getStudentsByCourse = (course) => {
    const selectedStudents = dataCollection.students.filter( student => student.course === parseInt(course));
    return new Promise((resolve, reject) => {
        if (selectedStudents.length > 0) {
            resolve(selectedStudents);
        } else {
            reject('No results returned');
        }
    })
}

const getStudentsByNum = (num) => {
    const selectedStudents = dataCollection.students.filter( student => student.studentNum === parseInt(num));
    return new Promise((resolve, reject) => {
        if (selectedStudents.length > 0) {
            resolve(selectedStudents);
        } else {
            reject('No results returned');
        }
    })
}

function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        studentData.TA = studentData.TA !== undefined;
        studentData.studentNum = dataCollection.students.length + 1;
        dataCollection.students.push(studentData);
        
        fs.writeFile(studentLink, JSON.stringify(dataCollection.students, null, 2), (err) => {
            if (err) {
                console.log('Error',err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function updateStudent(studentData) {
    return new Promise((resolve, reject) => {
        const index = dataCollection.students.findIndex(student => student.studentNum === parseInt(studentData.studentNum));
        if (index === -1) {
            reject('Student not found');
        } else {
            studentData.TA = studentData.TA !== undefined;
            dataCollection.students[index] = studentData;
            fs.writeFile(studentLink, JSON.stringify(dataCollection.students, null, 2), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }
    });
}

module.exports = {
    initialize,
    getAllStudents,
    // getTAs,
    getCourses,
    getCourseById,
    getStudentsByCourse,
    getStudentsByNum,
    addStudent,
    updateStudent
};
