var multer = require('multer');
const User = require('../models/User');
const File = require('../models/Files');
var Course = require('../models/Assignments/Course');
var Assignment = require('../models/Assignments/Assignment');
// var connect = require('connect');
var fs = require("fs");
var path = require('path');
var keyName = "inputFile" //Change according to your key name for file

var diskStorage = function (dir) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
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

// TODO: Connect Package Error
// var fileDB = (function(dir) {
//     var chain = connect();
//     [diskStorage(dir).single(keyName), fileUpload].forEach(function(middleware) {
//       chain.use(middleware);
//     });
//     return chain;
// })();

var retrieveFile = function (dir) {
    return function (req, res) {
        File.find({
            _id: req.params.fileid
        }, function (err, files) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: server error"
                });
            }
            else if (files.length == 0) {
                return res.status(404).send({
                    success: false,
                    message: "Error: No file found with this name"
                });
            }
            var file = files[0];
            var filePath = path.join(dir, file.originalname);
            var stream = fs.createReadStream(filePath);
            stream.on('error', function (error) {
                res.writeHead(404, 'Not Found');
                res.end();
            });
            stream.pipe(res);
        });
    }
}
//TODO: Make file downloadable
//TODO: Delete file endpoint

module.exports = { retrieveFile, diskStorage, fileUpload, assignmentCheck, addDirectory };
module.exports = { retrieveFile, fileDB, assignmentCheck };
