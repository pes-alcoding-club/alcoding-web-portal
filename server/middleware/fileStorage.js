var multer = require('multer');
const User = require('../models/User');
const File = require('../models/Files');
var fs = require("fs");
var path = require('path');
var homedir = require('os').homedir();

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

var downloadFile = function (dir) {
    return function (req, res, next) {
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
            User.findOne({
                _id: req.params.userID
            }, function(err, user){
                if(err){
                    return res.status(500).send({
                        success: false,
                        message: "Error: server error"
                    });
                }
                if(!user){
                    return res.status(404).send({
                        success: false,
                        message: "Error: No such user found"
                    });
                }
                var usn = user.usn
                var file = files[0];
                var filePath = path.join(dir, file.originalname)
                var fileName = usn+'_'+file.originalname;
                return res.download(filePath, fileName, function (err) {
                    if (err) {
                      return res.status(404).send({
                        success: false,
                        message: "Error: File not found."
                      });
                    }
                  });
            })
        });
    }
}

//TODO: Delete file endpoint

module.exports = { diskStorage, fileUpload, downloadFile };
