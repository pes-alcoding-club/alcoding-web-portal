var Course = require('../../models/Assignments/Course');
var Assignment = require('../../models/Assignments/Assignment');
var requireRole = require('../../middleware/Token').requireRole;
var verifyUser = require('../../middleware/Token').verifyUser;
var assignmentCheck = require('../../middleware/fileStorage').assignmentCheck;
var fileDB = require('../../middleware/fileStorage').fileDB;

module.exports = (app) => {
    app.get('/api/assignments/:userID/courses', function (req, res) {
        if (!req.params.userID) {
            return res.status(400).send({
                success: false,
                message: "Error: userID not in parameters. Please try again."
            });
        }

        Course.find({
            students: req.params.userID,
            isDeleted: false
        }, (err, courses) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: Server error."
                });
            }
            if (courses.length < 1) {
                console.log(courses);
                return res.status(404).send({
                    success: false,
                    message: 'Error: No courses found for this user.'
                });
            }

            return res.status(200).send({
                success: true,
                message: "Details successfully retrieved.",
                courses: { courses }
            });
        });
    })

    app.get('/api/assignments/:courseCode/assignments', function (req, res) {
        var courseCode = req.params.courseCode;
        if (!courseCode) {
            return res.status(400).send({
                success: false,
                message: 'CourseCode not in parameters'
            });
        }
        Course.find({
            code: courseCode,
            isDeleted: false
        }, (err, courses) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: Server error."
                });
            }
            if (courses.length < 1) {
                return res.status(404).send({
                    success: false,
                    message: 'Error: No courses found.'
                });
            }
            var course = courses[0];
            Assignment.find({
                course: course._id,
                isDeleted: false
            }, (err, assignments) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: "Error: Server error."
                    });
                }

                if (assignments.length < 1) {
                    return res.status(404).send({
                        success: false,
                        message: 'Error: No assignments found for this course.'
                    });
                }

                return res.status(200).send({
                    success: true,
                    message: "Details successfully retrieved.",
                    assignments: { assignments }
                });
            });

        })
    })

    app.post('/api/course/:userID/createCourse', requireRole("admin"), function (req, res) {
        if (!req.params.userID) {
            return res.status(400).send({
                success: false,
                message: "Error: userID not in parameters. Please try again."
            });
        }

        if (!req.body.name) {
            return res.status(400).send({
                success: false,
                message: 'Course name required.'
            });
        }

        if (!req.body.code) {
            return res.status(400).send({
                success: false,
                message: 'Course code required.'
            });
        }

        if (!req.body.department) {
            return res.status(400).send({
                success: false,
                message: 'Department required.'
            });
        }

        Course.find({
            code: req.body.code,
            isDeleted: false,
        }, (err, previousCourse) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: Server Error"
                });
            }
            if (previousCourse.length > 0) {
                return res.status(409).send({
                    success: false,
                    message: "Error: Course already exists"
                });
            }
            // save the course
            const newCourse = new Course();

            newCourse.name = req.body.name;
            newCourse.code = req.body.code;
            newCourse.department = req.body.department;
            newCourse.description = req.body.description;
            newCourse.resourcesUrl = req.body.resourcesUrl;
            newCourse.duration.startDate = req.body.startDate;
            newCourse.duration.endDate = req.body.endDate;
            newCourse.details.credits = req.body.credits;
            newCourse.details.hours = req.body.hours;
            newCourse.professors.push(req.params.userID)
            // console.log(newCourse)

            newCourse.save((err, course) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: "Error: Server error"
                    });
                }
                console.log(newCourse._id + " Added to DB")
                return res.status(200).send({
                    success: true,
                    message: "New course created"
                })
            })
        });

        app.post('/api/assignment/:userID/createAssignment', function (req, res) {
            if (!req.params.userID) {
                return res.status(400).send({
                    success: false,
                    message: "Error: userID not in parameters. Please try again."
                });
            }

            if (!req.body.name) {
                return res.status(400).send({
                    success: false,
                    message: 'Error: First name cannot be blank.'
                })
            }
            if (!req.body.uniqueId) {
                return res.status(400).send({
                    success: false,
                    message: 'Error: uniqueId cannot be blank'
                });
            }
            if (!req.body.type) {
                return res.status(400).send({
                    success: false,
                    message: "Error: type cannot be blank"
                });
            }
            if(!req.body.courseID){
                return res.status(400).send({
                    success: false,
                    message: "Error: courseID cannot be blank"
                });
            }

            Course.find({
                _id: req.body.courseID,
                isDeleted: false,
                professors: req.params.userID
            }, function (err, courses) {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: "Error: Server error"
                    });
                }
                if (courses.length == 0) {
                    return res.status(404).send({
                        success: false,
                        message: 'Error: No courses found for this user.'
                    });
                }

                var assignment = new Assignment();
                assignment.course = req.body.courseID;
                assignment.name = req.body.name;
                assignment.uniqueID = req.body.uniqueId;
                assignment.type = req.body.type;
                assignment.details = req.body.details;
                assignment.maxMarks = req.body.maxMarks;
                assignment.resourcesUrl = req.body.resourcesUrl;
                assignment.duration.startDate = req.body.startDate;
                assignment.duration.endDate = req.body.endDate;
                assignment.POC = req.body.POC;

                assignment.save(function (err, assignment) {
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: "Error: server error"
                        });
                    }
                    console.log('Assignment ' + assignment._id + ' saved to DB');
                    Course.findOneAndUpdate({
                        _id: assignment.course
                    }, {
                            $push: {
                                assignments: assignment._id
                            }
                        }, { new: true }, function (err, course) {
                            if (err) {
                                return res.status(500).send({
                                    success: false,
                                    message: "Error: server error"
                                });
                            }
                            console.log("Assignment " + assignment._id + " added to course " + course._id);
                            return res.status(200).send({
                                success: true,
                                message: "Assignment " + assignment._id + " added to DB"
                            })
                        });
                })
            });
        })
    })

    app.post('/api/assignment/:userID/:assignmentID/upload', verifyUser, assignmentCheck, fileDB, function (req, res, next) {
        Assignment.findOneAndUpdate({
            _id: req.params.assignmentID,
            isDeleted:false
        }, {
            $push:{
                submissions: {
                    'user':req.params.userID,
                    'file':req.file._id
                }
            }
        }, {new:true}, function(err, assignment){
            if(err){
                return res.status(500).send({
                    success: false,
                    message: "Error: server error"
                });
            }
            console.log("User "+req.params.userID+" has successfully submitted the assignment");
            console.log(assignment);
            return res.status(200).send({
                success:true,
                message:"User "+req.params.userID+" has successfully submitted the assignment"
            });
        });
    });

    app.post('/api/course/assignment/:userID', verifyUser, function(req,res) {
        if(!req.params.userID){
            return res.status(400).send({
                success: false,
                message: "Error: userID not in parameters. Please try again."
            });
        }

        if(!req.body.assignmentID){
            return res.status(400).send({
                success: false,
                message: "Error: assignmentID not entered"
            });
        }

        if(!req.body.courseID){
            return res.status(400).send({
                success: false,
                message: "Error: courseID not entered"
            });
        }

        Course.find({
            _id:req.body.courseID,
            students:req.params.courseID
        }, function(err, courses){
            if(err){
                return res.status(500).send({
                    success: false,
                    message: "Error: server error"
                });
            }
            if(!courses.length)
            {
                return res.status().send({
                    success:false,
                    message:"Error: Given user hasn't signed up for this course"
                });
            }
            Assignment.findOne({
                _id: req.body.assignmentID,
                "submissions": {user: req.params.userID}
            }, function(err, assignment){
                if(err){
                    return res.status(500).send({
                        success: false,
                        message: "Error: server error"
                    });
                }
                if(!assignment){
                    return res.status().send({
                        success:false,
                        message:"Error: No such assignment in given course"
                    });
                }
                return res.status(200).send({
                    success:true,
                    message:"Assignment has been submitted",
                    submitted:true
                });
            });
        })
    })
}

