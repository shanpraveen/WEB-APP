const Sequelize = require('sequelize');

// Set up sequelize to point to your Postgres database
var sequelize = new Sequelize('neondb', 'neondb_owner', '7yFC5IQrntwz', {
    host: 'ep-restless-sun-a5o28jz4.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }, 
    query: { raw: true }
});

// Define Student model
var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true 
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

// Define Course model
var Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

// Define the relationship between Student and Course
Course.hasMany(Student, { foreignKey: 'course' });

// Initialize the database
const initialize = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => resolve())
            .catch((err) => reject("Unable to sync the database:", err));
    });
};

// Get all students
const getAllStudents = () => {
    return new Promise((resolve, reject) => {
        Student.findAll()
            .then(data => resolve(data))
            .catch(err => reject("No results returned"));
    });
};

// Get students by course
const getStudentsByCourse = (course) => {
    return new Promise((resolve, reject) => {
        Student.findAll({ where: { course: course } })
            .then(data => resolve(data))
            .catch(err => reject("No results returned"));
    });
};

// Get student by student number
const getStudentsByNum = (num) => {
    return new Promise((resolve, reject) => {
        Student.findOne({ where: { studentNum: num } })
            .then(data => resolve(data))
            .catch(err => reject("No results returned"));
    });
};

// // Get TAs
// const getTAs = () => {
//     return new Promise((resolve, reject) => {
//         Student.findAll({ where: { TA: true } })
//             .then(data => resolve(data))
//             .catch(err => reject("No results returned"));
//     });
// };

// Get all courses
const getCourses = () => {
    return new Promise((resolve, reject) => {
        Course.findAll()
            .then(data => resolve(data))
            .catch(err => reject("No results returned"));
    });
};

// Get course by ID
const getCourseById = (id) => {
    return new Promise((resolve, reject) => {
        Course.findAll({ where: { id: id } })
            .then(data => resolve(data))
            .catch(err => reject("No results returned"));
    });
};

// Add a new student
function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        // Ensure the TA property is set correctly
        console.log("Student Data:", studentData)
        studentData.TA = studentData.TA ? true : false;

        // Iterate over the studentData object and set empty strings to null
        for (let property in studentData) {
            if (studentData[property] === "") {
                studentData[property] = null;
            }
        }

        // Create a new student in the database
        Student.create(studentData)
            .then(() => {
                resolve();
            })
            .catch(err => {
                reject("unable to create student: " + err);
            });
    });
}

// Update a student
const updateStudent = (studentData) => {
    studentData.TA = studentData.TA ? true : false;
    return new Promise((resolve, reject) => {
        Student.update(studentData, { where: { studentNum: studentData.studentNum } })
            .then(() => resolve())
            .catch(err => reject("Unable to update student"));
    });
};

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
