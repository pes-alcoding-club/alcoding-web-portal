var multer = require('multer');
const User = require('../models/User');
const File = require('../models/Files');
var Course = require('../models/assignments/Course');
var Assignment = require('../models/assignments/Assignment');
// var connect = require('connect');
var fs = require("fs");
var path = require('path');
var keyName = "inputFile" //Change according to your key name for file

var diskStorage = function (dir) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }            
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
        onError: function (err, next) {
            console.log('error', err);
            next(err);
        },
        //TODO: Make better cryptic naming convention for files
    });
    return multer({ storage: storage });
}

var fileUpload = function (req, res, next) {
    File.find({
        user_id: req.user_id,
        originalname: req.file.originalname
    }, function (err, files) {
        if (err) {
            return res.status(500).send({
                success: false,
                message: "Error: Server error"
            });
        }
        else {
            var uploadFile = new File();
            
            uploadFile.originalname = req.file.originalname;
            uploadFile.encoding = req.file.encoding;
            uploadFile.mimetype = req.file.mimetype;
            uploadFile.destination = req.file.destination;
            uploadFile.filename = req.file.filename;
            uploadFile.size = req.file.size;
            uploadFile.user_id = req.user_id;

            uploadFile.save(function (err, file) {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: 'Error: Server error'
                    });
                }
                console.log(file._id + " Added to DB.");
                req.fileID = file._id;
                User.findOneAndUpdate({
                    _id: req.user_id
                }, {
                        $push: { files: file._id }
                    }, { new: true }, function (err, user) {
                        if (err) {
                            return res.status(500).send({
                                success: false,
                                message: 'Error: Server error'
                            });
                        }
                        else {
                            console.log("File added to user " + user._id);
                        }
                    });
            });
        }
    })
    next();
}

var assignmentCheck = function (req, res, next) {
    if(!req.params.userID){
        return res.status(400).send({
            success: false,
            message: "Error: userID not in parameters. Please try again."
        });
    }
    if (!req.file) {
        return res.status(400).send({
            success: false,
            message: "Error: File not recieved"
        });
    }
    if (!req.params.assignmentID) {
        return res.status(400).send({
            success: false,
            message: "Error: Enter assignment ID"
        });
    }
    Course.find({
        students: req.params.userID,
        assignments: req.params.assignmentID,
    }, function(err, courses){
        if(err){
            // console.log("hello");
            return res.status(500).send({
                success: false,
                message: "Error: server error"
            });
        }
        if(courses.length==0){
            return res.status().send({
                success:false,
                message:"Error: Given user hasn't signed up for this course"
            });
        }
        // console.log(courses[0]);
        Assignment.find({
            _id: req.params.assignmentID,
            isDeleted: false,
            "submissions": {user: req.params.userID}
        }, function(err, assignment){
            if(err){
                return res.status(500).send({
                    success: false,
                    message: "Error: server error"
                });
            }
            if(assignment){
                return res.status(400).send({
                    success: false,
                    message: "Error: The student has already uploaded the assignment."
                })
            }
        });
    });
    next();
}

// var fileDB = function(middleware) {
//     if (!middleware.length) {
//         return function(_req, _res, next) { next(); };
//     }
//     var head = middleware[0];
//     var tail = middleware.slice(1);

//     return function(req, res, next) {
//         head(req, res, function(err) {
//             if (err) return next(err);
//             compose(tail)(req, res, next);
//         });
//     };
// }

var downloadFile = function(dir) {
    return function(req,res,next){
        File.find({
            _id: req.params.fileID
        }, function (err, files) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: server error"
                });
            }
            if (files.length == 0) {
                return res.status(404).send({
                    success: false,
                    message: "Error: No file found with this id"
                });
            }
            var file = files[0];
            var filePath = path.join(dir, file.originalname);
            res.download(filePath, file._id.toString()+'.'+file.originalname.split('.')[1], function(err){
                if(err){
                    return res.status(500).send({
                        success: false,
                        message: "Error: server error"
                    });
                }
            })
        });
    }
}

//TODO: Make file downloadable
//TODO: Delete file endpoint

module.exports = { diskStorage, fileUpload, assignmentCheck, downloadFile };
// module.exports = { fileDB, assignmentCheck, downloadFile };
