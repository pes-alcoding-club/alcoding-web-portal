var Course = require('../../models/assignments/Course');
var Assignment = require('../../models/assignments/Assignment');
var requireRole = require('../../middleware/Token').requireRole;
const User = require('../../models/User');
const Group = require('../../models/Group')
const File = require('../../models/Files');
const addNewDetails = require('../../middleware/courseDetails').addNewDetails;

module.exports = (app) => {
    // Endpoint for getting unvalidated new course requestss
    app.get('/api/courseAdmin/newCourses', requireRole('courseAdmin'), function (req, res) {
        Course.find({
            validated: false,
            isDeleted: false
        }, function (err, courses) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: Server error."
                });
            }

            if (courses.length < 1) {
                return res.status(404).send({
                    success: false,
                    message: 'Error: No new courses found'
                });
            }

            return res.status(200).send({
                success: true,
                message: "Details successfully retrieved.",
                courses
            });
        })
    })

    // Endpoint to delete course request
    app.delete('/api/courseAdmin/:courseID/delete', requireRole('courseAdmin'), function (req, res) {
        if (!req.params.courseID) {
            return res.status(400).send({
                success: false,
                message: "Error: courseID not in parameters. Please try again."
            });
        }

        Course.findOneAndDelete({
            _id: req.params.courseID,
        }, function (err, course) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: server error"
                });
            }
            if (!course) {
                return res.status(404).send({
                    success: false,
                    message: "Error: Course not found"
                });
            }
            return res.status(200).send({
                success: true,
                message: "Course " + course._id + " successfully deleted"
            })
        })
    })

    // Endpoint to retrieve userID's of all professors
    app.get('/api/courseAdmin/getGroups', requireRole('courseAdmin'), function (req, res) {
        Group.find({
            name: { "$nin": ["prof", "students"] }
        }, function (err, groups) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: Server error"
                })
            }
            if (!groups) {
                return res.status(404).send({
                    success: false,
                    message: "Error: no groups found"
                })
            }
            return res.status(200).send({
                success: true,
                message: "Details successfully retrieved",
                groups
            })
        })
    })

    // Endpoint for validating course request
    app.put('/api/courseAdmin/:courseID/validate', requireRole('courseAdmin'), addNewDetails, function (req, res) {
        var courseRequest = Object.assign({}, req.courseRequest)
        var jobOperations = [], teachingMembers = [], classPos = 0;
        req.body.classes.forEach(classDetailsObject => {
            var newCourse = new Course();
            newCourse.code = courseRequest.code;
            newCourse.name = courseRequest.name;
            newCourse.department = courseRequest.department;
            classDetailsObject.class.teachingMembers.forEach(teacher => {
                newCourse.class.teachingMembers.push(teacher);
            })
            classDetailsObject.class.sections.forEach(section => {
                newCourse.class.sections.push(section);
            })
            courseRequest.studentsList[classPos++].forEach(student => {
                newCourse.students.push(student)
            })
            newCourse.validated = true;
            classDetailsObject.class.teachingMembers.forEach(member => {
                if (teachingMembers.indexOf(member.teacher) === -1) {
                    teachingMembers.push(member.teacher)
                }
            })
            jobOperations.push(newCourse.save((err, course) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: 'Error: Server error'
                    });
                }
            }))
            return Promise.all(jobOperations).then(() => {
                User.find({
                    _id: { $in: teachingMembers }
                }, (err, docs) => {
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: 'Error: Server error'
                        });
                    }
                    if (docs.length == 0) {
                        return res.status(400).send({
                            success: false,
                            message: 'Error: No such users found'
                        });
                    }
                    var teacherJobs = []
                    docs.forEach(doc => {
                        var newTags = doc.tags
                        if (newTags.indexOf('member of course') === -1) {
                            newTags.push('member of course')
                        }
                        teacherJobs.push(User.findOneAndUpdate({
                            _id: doc._id
                        }, {
                            tags: newTags
                        }, { new: true }, function (err, user) {
                            if (err) {
                                return res.status(500).send({
                                    success: false,
                                    message: "Error: Server error"
                                })
                            }
                        })
                        )
                    })
                    return Promise.all(teacherJobs).then(teacherJobs => {
                        return res.status(200).send({
                            success: true,
                            message: 'Course Request validated successfully'
                        })
                    }).catch(err => {
                        return res.status(500).send({
                            success: false,
                            message: 'Error: Server error'
                        });
                    })
                })
            }).catch(err => {
                return res.status(500).send({
                    success: false,
                    message: 'Error: Server error'
                });
            })
        });
    })
}