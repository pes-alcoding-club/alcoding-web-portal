const User = require('../../models/User');
var requireRole = require('../middleware/Token').requireRole;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Alcoding');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var gfs = Grid("Alcoding", mongoose.mongo);

module.exports = (app) => {
    app.post('/api/admin/signup', requireRole("admin"), function (req, res) {

        // TODO: Change Email to usn
        var firstName = '' + req.body.firstName;
        var lastName = '' + req.body.lastName;
        var password = '' + req.body.password;
        var email = ('' + req.body.email).toLowerCase().trim();
        var usn = '' + req.body.usn;
        var role = '' + req.body.role;

        if (!firstName) {
            return res.status(400).send({
                success: false,
                message: 'Error: First name cannot be blank.'
            });
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'Error: Email cannot be blank.'
            });
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                message: 'Error: Password cannot be blank.'
            });
        }

        // Steps:
        // 1. Verify email doesn't exist
        // 2. Save
        User.find({
            email: email
        }, (err, previousUsers) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Error: Server find error'
                });
            } else if (previousUsers.length > 0) {
                return res.status(409).send({
                    success: false,
                    message: 'Error: Account already exists.'
                });
            }
            // Save the new user
            const newUser = new User();

            newUser.email = email;
            newUser.name.firstName = firstName;
            newUser.name.lastName = lastName;
            newUser.usn = usn;
            newUser.password = newUser.generateHash(password);
            if (role && role != "admin") {
                // TODO: in the else part, throw an error "Cannot assign role 'admin' "
                newUser.role = role;
            }

            newUser.save((err, user) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: 'Error: Server error'
                    });
                }
                console.log(newUser._id + " Added to DB.")
                return res.status(200).send({
                    success: true,
                    message: 'Signed up'
                });
            });
        });
    }); // end of sign up endpoint

    // Storage Engine
    var storage = new GridFsStorage({
        url: 'mongodb://localhost:27017/Alcoding',
        file: function (res, file) {
            if (file.mimetype === 'text/csv') {
                return {
                    bucketName: 'adminUploads', //name of the bucket to which the files will be stored in 2 collections
                    filename: file.originalname,
                    metadata: {
                        originalName: file.originalname
                    }
                    // TODO: Add a safe crypting method for filenames based on originalfilename (consider using crypto package)
                    // TODO: handle errors
                }
            }
            else {
                return res.status(400).send({
                    success: false,
                    message: "Please Enter CSV file."
                });
            }
        }
    });
    const upload = multer({ storage: storage });

    // Endpoint for uploading the file
    // Add boundary in ContentType header 
    app.post('/api/admin/upload', requireRole('admin'), upload.single('inputFile'), function (req, res) {
        if (!req.file) {
            return res.status(500).send({
                success: false,
                message: 'File failed to upload'
            });
        }
        else {
            console.log("File " + req.file.id + "is uploaded")
            var details = {
                "file_id": req.file.id,
                "file_name": req.file.filename
            }
            // TODO: Append version of file if same file is sent by User

            //Store the details of the file in the User document under files
            User.findOneAndUpdate({
                _id: req.user_id
            }, {
                    $push: {
                        files: details
                    }
                }, {
                    new: true
                }, function (err) {
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: "Error: Server error"
                        });
                    }
                    else {
                        return res.status(200).send({
                            success: true,
                            message: "File added to User Files successfully"
                        });
                    }
                });
            return res.status(200).send({
                success: true,
                message: 'File successfuly uploaded',
                data: req.file
            });
        }
    }); // end of upload endpoint

    app.get('/api/admin/file/:filename', requireRole('admin'), function (req, res, ) {
        if (!req.params.filename) {
            return res.send({
                success: false,
                message: "Error: filename has not been entered in parameters"
            });
        }
        gfs.find({ filename: req.params.filename, root: 'adminUploads' }, function (err, file) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            }
            else if (!file) {
                return res.status(404).send({
                    success: false,
                    message: "Error: No file found of this name"
                });
            }
            var readstream = gfs.createReadStream({
                filename: file.filename,
                file_id: file._id,
                root: 'adminUploads'
            });
            res.set('Content-Type', file.contentType);
            readstream.on('error', function (err) {
                res.end();
            });
            return readstream.pipe(res); // Streams the file, open in web
        });
        // TODO: Make file downloadable
    });
}