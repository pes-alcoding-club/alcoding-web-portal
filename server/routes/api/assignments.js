var Course = require('../../models/assignments/Course');
var Assignment = require('../../models/assignments/Assignment');
var requireRole = require('../../middleware/Token').requireRole;
var requireTag = require('../../middleware/Token').requireTag;
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
    // Endpoint for retrieving all active courses for a user - either as teachingMember or student
    app.get('/api/assignments/:userID/courses', requireTag('part of college'), function (req, res) {
        if (!req.params.userID) {
            return res.status(400).send({
                success: false,
                message: "Error: userID not in parameters. Please try again."
            });
        }

        var search = { isDeleted: false, validated: true, active: true };
        search['class.teachingMembers']= {"$elemMatch": {"teacher": req.params.userID}};
        Course.find(search, (err, teachingCourses) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: Server error."
                });
            }
            delete search['class.teachingMembers']
            search.students = req.params.userID
            Course.find(search, function(err, courses){
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: "Error: Server error."
                    });
                }
                courses = courses.concat(teachingCourses)
                return res.status(200).send({
                    success: true,
                    message: "Details successfully retrieved.",
                    courses
                });
            })
        });
    })

    // Endpoint for retreiving assignments under particular course
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
            active: true,
            validated: true,
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
            active: true,
            validated: true,
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

    // Endpoint for user to request course to courseAdmin
    app.post('/api/assignments/requestCourse', requireTag("part of college"), function(req, res){
        if(!req.body.code){
            return res.status(400).send({
                success: false,
                message: 'Course code required in parameters.'
            });
        }

        if(!req.body.role){
            return res.status(400).send({
                success: false,
                message: 'Role required in parameters.'
            });
        }

        if(!req.body.name){
            return res.status(400).send({
                success: false,
                message: 'Course name required in parameters.'
            });
        }

        if(!req.body.department){
            return res.status(400).send({
                success: false,
                message: 'Course department required in parameters.'
            });
        }
        User.findOne({
            _id: req.user_id,
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
                department: req.body.department
            }, function(err, courses){
                if(err){
                    return res.status(500).send({
                        success: false,
                        message: "Error: Server error"
                    });
                }
                if(courses.length>0){
                    return res.status(404).send({
                        success: false,
                        message: "Error: Course already exists"
                    });
                }
                const newCourse = new Course();
                newCourse.name = req.body.name;
                newCourse.code = req.body.code;
                newCourse.department = req.body.department;
                newCourse.class.teachingMembers.push({teacher: user._id, role: req.body.role});
                newCourse.save((err, course) => {
                    if(err){
                        return res.status(500).send({
                            success: false,
                            message: "Error: Server error"
                        });
                    }
                    console.log("Course Request ID made - "+course._id.toString())
                    return res.status(200).send({
                        success: true,
                        message: "Course Request ID - "+course._id.toString()
                    })
                })
            })
        })
    })

    app.get('/api/assignments/:userID/getValidatedCourses', requireTag('member of course'), function(req, res){
        if(!req.params.userID){
            return res.status(400).send({
                success: false,
                message: 'userID required in parameters.'
            });
        }
        Course.find({
            active: false,
            validated: true,
            isDeleted: false,
            'class.teachingMembers': {"$elemMatch": {"teacher": req.params.userID}}
        }, function(err, courses){
            if(err){
                return res.status(500).send({
                    success: false,
                    message: "Error: Server error"
                });
            }
            if(courses.length==0){
                return res.status(200).send({
                    success: true,
                    message: "No inactive validated courses found"
                });
            }
            return res.status(200).send({
                success: true,
                message: "Courses retrieved successfully",
                courses
            })
        })
    })

    // Endpoint for creating a course after it is validated by courseAdmin
    app.put('/api/assignments/:courseID/createValidatedCourse', requireTag('member of course'), function (req, res) {
        if(!req.params.courseID){
            return res.status(400).send({
                success: false,
                message: 'CourseID required in parameters.'
            });
        }    
        
        if (!req.body.description) {
            return res.status(400).send({
                success: false,
                message: 'Description required.'
            });
        }

        if (!req.body.duration) {
            return res.status(400).send({
                success: false,
                message: 'Duration required.'
            });
        }

        if (!req.body.details) {
            return res.status(400).send({
                success: false,
                message: 'Details like Credits, Hours required.'
            });
        }

        User.findOne({
            _id: req.user_id,
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
            Course.findOneAndUpdate({
                _id: req.params.courseID,
                validated: true,
                active: false,
                isDeleted: false
            }, {
                description: req.body.description,
                duration: req.body.duration,
                details: req.body.details,
                active: true
            }, {new: true}, function(err, course){
                if(err){
                    return res.status(500).send({
                        success: false,
                        message: "Error: Server Error"
                    });
                }
                if(!course){
                    return res.status(404).send({
                        success: false,
                        message: "Error: Course not found"
                    });
                }
                return res.status(200).send({
                    success:true,
                    message: "Course successfully created with ID - "+course._id.toString(),
                })
            })
        })
    })

    // Endpoint for creating assignment under course
    app.post('/api/assignments/:userID/createAssignment', requireTag('member of course'), function (req, res) {
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

        Course.findOne({
            _id: req.body.courseID,
            isDeleted: false,
            'class.teachingMembers': {"$elemMatch": {"teacher": req.params.userID}},
            active: true,
            validated: true
        }, function (err, courses) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: Server error"
                });
            }
            if (!courses) {
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

    // Shows the submissions for particular assignment
    app.get('/api/assignments/:assignmentID/submissions', requireTag('member of course'), function(req,res){
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

    // Endpoint for downloading File Submission
    app.get('/api/assignments/:fileID/:userID/download', requireTag('member of course'), downloadFile(dir));

    // Endpoint for zipping the submissions
    app.get('/api/assignments/:assignmentID/zip', requireTag('member of course'), addFilesForZip, zipFile(dir));

    // Endpoint for getting Assignmeents details
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

