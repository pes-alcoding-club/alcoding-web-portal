var Course = require('../../models/assignments/Course');
var Assignment = require('../../models/assignments/Assignment');
var requireRole = require('../../middleware/Token').requireRole;
const User = require('../../models/User');
const Group = require('../../models/Group')
const File = require('../../models/Files');
const addNewDetails = require('../../middleware/courseDetails').addNewDetails;

module.exports = (app) => {
    // Endpoint for getting unvalidated new course requestss
    app.get('/api/courseAdmin/newCourses', requireRole('courseAdmin'), function(req, res){
        Course.find({
            validated: false, 
            isDeleted: false
        }, function(err, courses){
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
    app.delete('/api/courseAdmin/:courseID/delete', requireRole('courseAdmin'), function(req,res){
        if(!req.params.courseID){
            return res.status(400).send({
                success: false,
                message: "Error: courseID not in parameters. Please try again."
            });
        }

        Course.findOneAndDelete({
            _id: req.params.courseID,
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

    // Endpoint to retrieve userID's of all professors
    app.get('/api/courseAdmin/getDepartmentMembers', requireRole('courseAdmin'), function(req, res){
        Group.findOne({
            name: 'prof',
            termEndYear: -1
        }, function(err, group){
            if(err){
                return res.status(500).send({
                    success:false,
                    message: "Error: Server error"
                })
            }
            if(!group){
                return res.status(404).send({
                    success: false,
                    message: "Error: no such group found"
                })
            }
            return res.status(200).send({
                success: true,
                message: "Details successfully retrieved",
                members: group.members
            })
        })
    })

    // Endpoint for validating course request
    app.put('/api/courseAdmin/:courseID/validate', requireRole('courseAdmin'), addNewDetails, function(req, res){
        var newCourse = Object.assign({}, req.newCourse)
        newCourse.validated = true
        Course.findOneAndUpdate({
            _id: req.params.courseID,
            validated: false
        }, newCourse, {new: true}, function(err, course){
            if(err){
                return res.status(500).send({
                    success:false,
                    message: "Error: Server error"
                })
            }
            // console.log(course.class.teachingMembers)
            teachingMembers = []
            course.class.teachingMembers.forEach(member => {
                if(teachingMembers.indexOf(member.teacher)===-1) {
                    teachingMembers.push(member.teacher)
                }
            })
            User.find({
                _id: {$in: teachingMembers}
            }).then(docs => {
                var jobOperations = []
                docs.forEach(doc => {
                    var newTags = doc.tags
                    if(newTags.indexOf('member of course')===-1){
                        newTags.push('member of course')
                    }
                    jobOperations.push(User.findOneAndUpdate({
                            _id: doc._id
                        }, {
                            tags: newTags
                        }, {new: true}, function(err, user){
                            if(err){
                                return res.status(500).send({
                                    success:false,
                                    message: "Error: Server error"
                                })
                            }
                        })
                    )
                })
                return Promise.all(jobOperations);
            }).then(listOfJobs => {
                res.status(200).send({
                    success: true,
                    message: 'Course Request validated successfully'
                })
            }).catch(err => {
                res.status(500).send({
                    success: false,
                    message: 'Error: Server error'
                });
            })
        }) 
    })
}