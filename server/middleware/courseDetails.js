var Course = require('../models/assignments/Course');
var Assignment = require('../models/assignments/Assignment');
var Group = require('../models/Group');

var addNewDetails = function(req, res, next){
    if(!req.body.class){
        return res.status(400).send({
            success: false,
            message: "Error: class details not in body. Please try again."
        });
    }
    if(!req.body.graduatingYearOfStudents){
        return res.status(400).send({
            success: false,
            message: "Error: Graduating Year of Students not in body. Please try again."
        });
    }
    if(!req.params.courseID){
        return res.status(400).send({
            success: false,
            message: "Error: courseID not in parameters. Please try again."
        });
    }
    Course.findOne({
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
        var newCourse = Object.assign({}, course._doc)
        delete newCourse._id
        newCourse.class = req.body.class
        Group.find({
            isDeleted: false,
            name: {$in: req.body.class.sections},
            termEndYear: req.body.graduatingYearOfStudents
        }, function(err, groups){
            if(err){
                return res.status(500).send({
                    success: false,
                    message: "Error: server error"
                });
            }
            if(!groups){
                return res.status(404).send({
                    success: false,
                    message: "Error: no such group found"
                })
            }
            groups.forEach(group => {
                group.members.forEach( student => {
                    if(newCourse.students.indexOf(student)===-1){
                        newCourse.students.push(student)
                    }
                })
            })
            req.newCourse = Object.assign({}, newCourse)
            next();
        })
    })
}


module.exports = {addNewDetails}