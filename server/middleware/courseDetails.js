var Course = require('../models/assignments/Course');
var Assignment = require('../models/assignments/Assignment');
var Group = require('../models/Group');

var addNewDetails = function(req, res, next){
    if(!req.body.classes){
        return res.status(400).send({
            success: false,
            message: "Error: class details not in body. Please try again."
        });
    }
    if(!req.params.courseID){
        return res.status(400).send({
            success: false,
            message: "Error: courseID not in parameters. Please try again."
        });
    }
    if(req.body.classes.length===0){
        return res.status(400).send({
            success: false,
            message: "Error: Classes object is empty. Please try again."
        });
    }
    Course.findOneAndDelete({
        _id: req.params.courseID,
        validated: false,
        isDeleted: false
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
        var courseRequest = Object.assign({}, course._doc)
        delete courseRequest._id
        courseRequest.studentsList = []
        var operations = [];
        req.body.classes.forEach(classDetailsObject => {
            var students = new Set();
            operations.push(Group.find({
                    isDeleted: false,
                    name: {$in: classDetailsObject.class.sections},
                    termEndYear: classDetailsObject.graduatingYearOfStudents
                }, (err, groups)=>{
                    if(err){
                        return res.status(500).send({
                            success:false,
                            message: "Error: Server error"
                        })
                    }
                    groups.forEach(group => {
                        group.members.forEach(member => {
                            students.add(member.toString())
                        })
                    })
                    courseRequest.studentsList.push(students);
                })
            )
        })
        return Promise.all(operations).then(listOfJobs => {
            req.courseRequest = Object.assign({}, courseRequest)
            next();
        }).catch(err => {
            return res.status(500).send({
                success: false,
                message: 'Error: Server error'
            });
        })
    })
}


module.exports = {addNewDetails}