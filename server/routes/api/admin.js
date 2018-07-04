const User = require('../../models/User');
const File = require('../../models/Files');
var requireRole = require('../../middleware/Token').requireRole;
var diskStorage = require('../../middleware/fileStorage').diskStorage;
var addDirectory = require('../../middleware/fileStorage').addDirectory;
var path = require('path');
var dir = process.cwd() + '/../temp';
var keyName = "inputFile" //Change according to your key name for file

addDirectory(dir);

module.exports = (app) => {
    app.post('/api/admin/signup', requireRole("admin"), function (req, res) {

        // TODO: Change Email to usn

        var usn = req.body.usn;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var email = req.body.email;
        var password = req.body.password;
        var role = req.body.role;

        if (!firstName) {
            return res.status(400).send({
                success: false,
                message: 'Error: First name cannot be blank.'
            });
        }
        if (!usn) {
            return res.status(400).send({
                success: false,
                message: 'Error: usn cannot be blank.'
            });
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                message: 'Error: Password cannot be blank.'
            });
        }

        // Process data
        usn = ('' + usn).toUpperCase().trim();
        email = ('' + email).toLowerCase().trim();
        password = '' + password;

        // Deduplication flow
        User.find({
            usn: usn
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

            newUser.usn = usn;
            newUser.name.firstName = firstName;
            if (lastName) { newUser.name.lastName = lastName; }
            if (email) { newUser.basicInfo.email = email; }
            newUser.password = newUser.generateHash(password);
        
            if (role) {
                if (role == "admin") {
                    return res.status(403).send({
                        success: false,
                        message: "Error: Forbidden request, Cannot assign role:\"admin\"."
                    });
                }
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

    var upload = diskStorage(dir); 

    app.post('/api/admin/file', upload.single(keyName), requireRole("admin"), function (req, res) {
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "Error: File not recieved"
            });
        }

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
