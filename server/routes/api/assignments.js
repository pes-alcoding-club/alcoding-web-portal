var Course = require('../../models/assignments/Course');
var Assignment = require('../../models/assignments/Assignment');
var requireRole = require('../../middleware/Token').requireRole;
var verifyUser = require('../../middleware/Token').verifyUser;
const User = require('../../models/User');
const Group = require('../../models/Group')
const File = require('../../models/Files');
var diskStorage = require('../../middleware/fileStorage').diskStorage;
var fileUpload = require('../../middleware/fileStorage').fileUpload;
var downloadFile = require('../../middleware/fileStorage').downloadFile;
var zipFile = require('../../middleware/fileStorage').zipFile;
var addFilesForZip = require('../../middleware/fileStorage').addFilesForZip;
var dir = process.cwd() + '/../temp';
var keyName = "inputFile";

module.exports = (app) => {
    app.get('/api/assignments/:userID/courses', verifyUser, function (req, res) {
        if (!req.params.userID) {
            return res.status(400).send({
                success: false,
                message: "Error: userID not in parameters. Please try again."
            });
        }

        var search = { isDeleted: false };
        if(req.role == 'student') search.students = req.user_id;
        else if(req.role == 'prof') {
            search['class.professor']=req.user_id;
        }

        Course.find(search, (err, courses) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: Server error."
                });
            }
            // if (courses.length < 1) {
            //     return res.status(404).send({
            //         success: false,
            //         message: 'Error: No courses found for this user.'
            //     });
            // }

            return res.status(200).send({
                success: true,
                message: "Details successfully retrieved.",
                courses
            });
        });
    })

    app.get('/api/assignments/:courseID/assignments', function (req, res) {
        var courseID = req.params.courseID;
        if (!courseID) {
            return res.status(400).send({
                success: false,
                message: 'courseID not in parameters'
            });
        }
        Course.find({
            _id: courseID,
            isDeleted: false
        }, (err, course) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: Server error."
                });
            }
            if (!course) {
                return res.status(404).send({
                    success: false,
                    message: 'Error: No course found.'
                });
            }
            Assignment.find({
                course: courseID,
                isDeleted: false
            }, (err, assignments) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: "Error: Server error."
                    });
                }

                if (assignments.length == 0) {
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

    //Endpoint for viewing Assignments to be submitted by User in a Course
    app.get('/api/assignments/:courseID/:userID/new', function (req, res) {
        var courseID = req.params.courseID;
        var userID = req.params.userID;
        if (!courseID || !userID) {
            return res.status(400).send({
                success: false,
                message: 'courseID, userID required.'
            });
        }
        Course.find({
            _id: courseID,
            isDeleted: false
        }, (err, course) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: Server error."
                });
            }
            if (!course) {
                return res.status(404).send({
                    success: false,
                    message: 'Error: No course found.'
                });
            }
            Assignment.find({
                course: courseID,
                submissions: {
                    "$not": {"$elemMatch": {"user": userID}}
                },
                isDeleted: false
            }, (err, assignments) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: "Error: Server error."
                    });
                }
                if(assignments){
                    var assignments = {assignments}
                }
                return res.status(200).send({
                    success: true,
                    message: "Details successfully retrieved.",
                    assignments: assignments
                });
            });
        })
    })

    // Endpoint for creating a new course as a professor or anchor
    app.post('/api/assignments/createCourse', requireRole('prof'), function (req, res) {
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

        if (!req.body.professorID) {
            return res.status(400).send({
                success: false,
                message: 'ProfessorID in Course required.'
            })
        }

        if (!req.body.sections) {
            return res.status(400).send({
                success: false,
                message: 'Section in Course required.'
            })
        }

        if(!req.body.role) {
            return res.status(400).send({
                success: false,
                message: 'Role of Professor in Course required.'
            })
        }

        if(!req.body.graduating){
            return res.status(400).send({
                success: false,
                message: 'Graduating year of students in Course required.'
            })
        }

        User.findOne({
            usn: req.body.professorID,
            isDeleted: false
        }, function(err, user){
            if(err){
                return res.status(500).send({
                    success: false,
                    message: "Error: Server error"
                });
            }
            if(!user){
                return res.status(404).send({
                    success: false,
                    message: "Error: No such user exists in DB"
                });
            }
            Course.find({
                code: req.body.code,
                'class.professor': user._id,
                isDeleted: false
            }, function(err, previousCourse){
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
                newCourse.class.professor = user._id;
                newCourse.students = new Array();
                var sections = req.body.sections.split(',');
                newCourse.class.sections = sections;
                Group.find({
                    isDeleted: false,
                    name: {$in: sections}, 
                    graduating: req.body.graduating
                }, function(err, groups){
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: "Error: Server error"
                        });
                    }
                    if (!groups){
                        return res.status(404).send({
                            success: false,
                            message: "Error: No such user group found"
                        })
                    }
                    groups.forEach(group => {
                        group.students.forEach( student => {
                            newCourse.students.push(student)
                        })
                    })
                    if(req.body.role=='anchor'){
                        if(req.body.anchorDescription){
                            newCourse.anchorDescription = req.body.anchorDescription;
                        }
                    }
                    // console.log(newCourse);
                    newCourse.save((err, course) => {
                        if (err) {
                            return res.status(500).send({
                                success: false,
                                message: "Error: Server error"
                            });
                        }
                        console.log(course._id + " Course Added to DB")
                        return res.status(200).send({
                            success: true,
                            message: "New course created"
                        });
                    });
                });
            })
        })
    })

    app.post('/api/assignments/:userID/createAssignment', requireRole('prof'), function (req, res) {
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
        if (!req.body.courseID) {
            return res.status(400).send({
                success: false,
                message: "Error: courseID cannot be blank"
            });
        }

        Course.find({
            _id: req.body.courseID,
            isDeleted: false,
            'class.professor': req.params.userID
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

    app.delete('/api/assignemnts/:userID/:courseID/delete', requireRole('prof'), function(req,res){
        if(!req.params.courseID){
            return res.status(400).send({
                success: false,
                message: "Error: courseID not in parameters. Please try again."
            });
        }

        if(!req.params.userID){
            return res.status(400).send({
                success: false,
                message: "Error: userID not in parameters. Please try again."
            });
        }

        Course.findOneAndDelete({
            _id: req.params.courseID,
            "class.professor": req.params.userID
        }, function(err, course){
            if(err){
                return res.status(500).send({
                    success: false,
                    message: "Error: server error"
                });
            }
            if(!course){
                return res.status(404).send({
                    success: false,
                    message: "Error: Course not found"
                });
            }
            return res.status(200).send({
                success: true,
                message: "Course "+course._id+" successfully deleted"
            })
        })
    })

    // Upload Assignment
    app.all('/api/assignments/:userID/:assignmentID/upload', verifyUser, diskStorage(dir).single(keyName), fileUpload, function (req, res, next) {
        Assignment.findOneAndUpdate({
            _id: req.params.assignmentID,
            isDeleted: false
        }, {
                $push: {
                    submissions: {
                        'user': req.params.userID,
                    }
                }
            }, { new: true }, function(err, assignment) {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: "Error: server error"
                    });
                }
                var submissions = [];
                for(var i=0; i<assignment.submissions.length; i++){
                    var submission = assignment.submissions[i];
                    if(submission.user!=req.params.userID){
                        submissions.push(submission);
                    }
                }
                File.find({
                    user_id: req.user_id,
                    originalname: req.file.originalname
                }, function(err, files){
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: "Error: Server error"
                        });
                    }
                    req.fileID = files[files.length-1]._id; //Get Latest file submitted by user
                    var object = {user:req.user_id, file:req.fileID};
                    submissions.push(object);
                    
                    Assignment.findOneAndUpdate({
                        _id: req.params.assignmentID,
                        isDeleted: false,
                    },{
                        "$set":{
                            submissions:submissions
                        }
                    },null, function(err, assignment){
                        if (err) {
                            return res.status(500).send({
                                success: false,
                                message: "Error: Server error"
                            });
                        }
                        console.log("User " + req.params.userID + " has successfully submitted the assignment");
                        return res.status(200).send({
                            success: true,
                            message: "User " + req.params.userID + " has successfully submitted the assignment"
                        });
                    })
                })
            });
    })

    app.get('/api/assignments/:assignmentID/submissions', requireRole('prof'), function(req,res){
        Assignment.find({
            _id:req.params.assignmentID
        }, function(err, assignments){
            if(err){
                return res.status(500).send({
                    success: false,
                    message: "Error: server error"
                });
            }
            if(!assignments){
                return res.status(404).send({
                    success: false,
                    message: 'Error: No such assignment found'
                });
            }
            var assignment = assignments[0];
            if(assignment.submissions.length){
                return res.status(200).send({
                    success:true,
                    message: "Assignment submissions successfully retrieved",
                    data: {assignment}
                })
            }
            else{
                return res.status(404).send({
                    success: false,
                    message: 'Error: No submissions for this assignment'
                });
            }
        })
    })

    app.get('/api/assignments/:fileID/:userID/download', requireRole('prof'), downloadFile(dir));

    app.get('/api/assignments/:assignmentID/zip', requireRole('prof'), addFilesForZip, zipFile(dir));

    app.get('/api/assignments/:assignmentID/details', function(req,res){
        Assignment.find({
            _id:req.params.assignmentID,
            isDeleted:false
        }, function(err,assignments){
            if(err){
                return res.status(500).send({
                    success: false,
                    message: "Error: server error"
                });
            }
            if(!assignments){
                return res.status(404).send({
                    success: false,
                    message: 'Error: No such assignment found'
                });
            }
            var assignment = assignments[0].toObject();
            delete assignment.submissions;
            return res.status(200).send({
                success:true,
                message:"Assignment Details successfully retrieved",
                data:{assignment}
            })
        })
    })
}

