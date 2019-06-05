const User = require('../../models/User');
const File = require('../../models/Files');
const Group = require('../../models/Group')
var requireRole = require('../../middleware/Token').requireRole;
// var fileDB = require('../../middleware/fileStorage').fileDB;
var diskStorage = require('../../middleware/fileStorage').diskStorage;
var fileUpload = require('../../middleware/fileStorage').fileUpload;
var retrieveFile = require('../../middleware/fileStorage').retrieveFile;
var fs = require("fs");
var dir = process.cwd() + '/../temp';
var keyName = "inputFile";

module.exports = (app) => {
    app.post('/api/admin/signup', requireRole("admin"), function (req, res) {

        var usn = req.body.usn;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var email = req.body.email;
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

        // Process data
        usn = ('' + usn).toUpperCase().trim();
        email = ('' + email).toLowerCase().trim();

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
            newUser.password = newUser.generateHash(usn);

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

    app.post('/api/admin/upload', requireRole("admin"), diskStorage(dir).single(keyName), fileUpload, function (req, res) {
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "Error: File not recieved"
            });
        }
        if (req.file) {
            return res.status(200).send({
                success: true,
                message: "File uploaded and added to DB",
                data: req.file
            });
        }
    });

    app.delete('/api/admin/user', requireRole("admin"), function (req, res) {
        if (!req.body.usn) {
            return res.status(400).send({
                success: false,
                message: "Error: usn not recieved"
            });
        }
        User.findOneAndDelete({
            usn: req.body.usn
        }, function (err, user) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Error: Server error'
                });
            }
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'Error: User not found'
                });
            }
            return res.status(200).send({
                success: 'true',
                message: "User " + user._id + " successfully deleted"
            })
        })
    });

    app.post('/api/admin/createGroup', requireRole('admin'), function (req, res) {
        if (!req.body.name) {
            return res.status(400).send({
                success: false,
                message: "Error: name not recieved"
            });
        }

        if (!req.body.usn) {
            return res.status(400).send({
                success: false,
                message: "Error: usn not recieved"
            });
        }

        if (!req.body.graduating) {
            return res.status(400).send({
                success: false,
                message: "Error: graduating year not recieved"
            });
        }

        User.findOne({
            usn: req.body.usn,
            role: 'student',
            isDeleted: false
        }, function (err, user) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Error: Server error'
                }); 
            }
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'Error: User not found'
                });
            }

            var userID = user._id;
            Group.findOne({
                name: req.body.name,
                graduating: req.body.graduating
            }, function (err, group) {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: 'Error: Server error'
                    });
                }
                if (!group) {
                    var newGroup = new Group();
                    newGroup.name = req.body.name;
                    newGroup.graduating = req.body.graduating;
                    newGroup.students = new Array();
                    newGroup.students.push(userID);
                    newGroup.save(function (err, group) {
                        if (err) {
                            return res.status(500).send({
                                success: false,
                                message: 'Error: Server error'
                            });
                        }
                        console.log("Group " + group._id + " added");
                        User.findOneAndUpdate({
                            _id: userID
                        }, {
                                $push: { "groups": group._id }
                            }, { new: true }, function (err, user) {
                                if (err) {
                                    return res.status(500).send({
                                        success: false,
                                        message: 'Error: Server error'
                                    });
                                }
                                return res.status(200).send({
                                    success: true,
                                    message: "User added to Group " + group.name
                                })
                            })
                    })
                }
                else {
                    Group.findOneAndUpdate({
                        _id: group._id,
                        isDeleted: false
                    }, {
                            $push: { "students": userID }
                        }, { new: true }, function (err, group) {
                            if (err) {
                                return res.status(500).send({
                                    success: false,
                                    message: 'Error: Server error'
                                });
                            }
                            User.findOneAndUpdate({
                                _id: userID
                            }, {
                                    $push: { "groups": group._id }
                                }, { new: true }, function (err, user) {
                                    if (err) {
                                        return res.status(500).send({
                                            success: false,
                                            message: 'Error: Server error'
                                        });
                                    }
                                    return res.status(200).send({
                                        success: true,
                                        message: "User added to Group " + group.name
                                    })
                                })
                        })
                }
            })
        })
    });
}
