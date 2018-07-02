const User = require('../../models/User');
const File = require('../../models/Files');
var requireRole = require('../../middleware/Token').requireRole;
var path = require('path');
var dir = '/Users/adityavinodkumar/Desktop/Code/Alcoding/server/adminfiles/';
//Enter your respective adminuploads directory above
var fs = require("fs");
var multer = require('multer');
var keyName = "inputFile" //Change according to your key name for file

//Adds the adminuploads directory  
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

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

    var storage = multer.diskStorage({
        destination: dir,
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
    var upload = multer({ storage: storage });
    //TODO: Make better cryptic naming convention for files 

    app.post('/api/admin/upload', upload.single(keyName), requireRole("admin"), function (req, res) {
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "Error: File not recieved"
            });
        }

        File.find({
            user_id: req.user_id,
            originalname: req.file.originalname
        }, function (err, users) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: Server error"
                });
            }
            else if (users.length > 0) {
                return res.status(400).send({
                    success: false,
                    message: "Error: File is already entered by user."
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

    });

    app.get('/api/admin/file/:filename', requireRole('admin'), function (req, res) {
        if (!req.params.filename) {
            return res.status(400).send({
                success: false,
                message: "Error: filename has not been entered in parameters"
            });
        }
        File.find({
            originalname: req.params.filename
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
            //TODO: Make file downloadable
            //TODO: Delete file endpoint
        });
    });
}