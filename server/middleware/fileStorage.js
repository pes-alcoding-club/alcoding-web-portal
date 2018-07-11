// middleware for multer storage
var multer = require('multer');
const User = require('../models/User');
const File = require('../models/Files');
var fs = require("fs");
var path = require('path');

// Adds the directory
var addDirectory = function (dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

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

var fileUpload = function (req, res) {
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
        else if (files.length > 0) {
            var foundFile = files[0];
            File.findOneAndUpdate({
                _id: foundFile._id
            }, {
                    $inc: { __v: 1 },
                    $set: {
                        encoding: req.file.encoding,
                        mimetype: req.file.mimetype,
                        size: req.file.size
                    }
                }, null, function (err, file) {
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: 'Error: Server error'
                        });
                    }
                    console.log("Version of file " + file._id + " is updated ");
                });
            return res.status(400).send({
                success: true,
                message: "File is already entered by user. Version updated"
            })
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
                            return res.status(200).send({
                                success: true,
                                message: "File uploaded and added to DB",
                                data: file
                            });
                        }
                    });
            });
        }
    })
}

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

module.exports = { diskStorage, addDirectory, fileUpload, retrieveFile };