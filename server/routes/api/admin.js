const User = require('../../models/User');
const File = require('../../models/Files');
const Group = require('../../models/Group')
const jwt = require('jsonwebtoken');
var fs = require("fs");
var privateKey = fs.readFileSync('server/sslcert/server.key', 'utf8'); //privatekey for jwt
var requireRole = require('../../middleware/Token').requireRole;
const UserSession = require('../../models/UserSession');
// var fileDB = require('../../middleware/fileStorage').fileDB;
var diskStorage = require('../../middleware/fileStorage').diskStorage;
var fileUpload = require('../../middleware/fileStorage').fileUpload;
var retrieveFile = require('../../middleware/fileStorage').retrieveFile;
var dir = process.cwd() + '/../temp';
var keyName = "inputFile";
const config = require('../../../config/config');

module.exports = (app) => {
    app.post('/api/admin/signupMembers', requireRole('admin'), function (req, res) {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var email = req.body.email;
    
        if (!firstName) {
            return res.status(400).send({
                success: false,
                message: 'Error: First name cannot be blank.'
            });
        }
        
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'Error: email cannot be blank.'
            });
        }

        if (!req.body.usn && !req.body.employeeID) {
            return res.status(400).send({
                success: false,
                message: 'Error: identity details cannot be blank. Please enter SRN or EmplyeeID'
            });
        }
    
        // Process data
        if(req.body.usn) usn = ('' + req.body.usn).toUpperCase().trim();
        if(req.body.employeeID) employeeID = ('' + req.body.employeeID).toUpperCase().trim();
        email = ('' + email).toLowerCase().trim();
        // Deduplication flow
        User.find({
            "basicInfo.email":{$eq: email},
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
    
            newUser.name.firstName = firstName;
            newUser.basicInfo.email = email;
            if (lastName) { newUser.name.lastName = lastName; }
            newUser.tags.push('part of college')
            if (typeof employeeID!=='undefined'){
                newUser.tags.push('part of department')
                newUser.employeeID = employeeID
            }
            if (typeof usn!=='undefined'){
                newUser.tags.push('student')
                newUser.usn = usn
            }
    
            newUser.save((err, user) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: 'Error: Server error'
                    });
                }
                console.log(newUser._id + " Added to DB.")

                payload = {
                    user_id: user._id,
                    role: user.role,
                    tags: user.tags
                };

                jwt.sign(payload, privateKey, {
                    expiresIn: "1h"
                }, (err, token) => {
                    if(err){
                        return res.status(500).send({
                            success: false,
                            message: 'Error: Server Error'
                        });
                    }
                    newSession = new UserSession();
                    newSession.token = token;
                    newSession.save((err, session) => {
                        if(err){
                            return res.status(500).send({
                                success: false,
                                message: 'Error: Server error'
                            });
                        }
                        console.log("JWT generated for set password.");
                        var link = config.host_url + 'set/' + token + '/' + user._id.toString();
                        var writeData = user.basicInfo.email + "," + user.name.firstName + "," + link + ',setPassword' + "\n";
                        fs.appendFile("./server/sendEmail/emails.csv", writeData, function(err){
                            if(err){
                                return console.log(err);
                            }
                            console.log("Email scheduled")
                        })
                        return res.status(200).send({
                            success: true,
                            message: 'Signed Up successfully with email.'
                        })
                    })
                })
            });
        });
    }); // end of sign up endpoint

    app.delete('/api/admin/user', requireRole("admin"), function (req, res) {
        if (!req.body.email) {
            return res.status(400).send({
                success: false,
                message: "Error: email not recieved"
            });
        }
        email = ('' + req.body.email).toLowerCase().trim();
        User.findOneAndDelete({
            "basicInfo.email":{$eq: email},
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

        if (!req.body.email) {
            return res.status(400).send({
                success: false,
                message: "Error: email not recieved"
            });
        }

        if(!req.body.termEndYear){
            return res.status(400).send({
                success: false,
                message: "Error: termEndYear not recieved"
            })
        }

        termEndYear = parseInt(req.body.termEndYear)
        email = ('' + req.body.email).toLowerCase().trim();
        User.findOne({
            "basicInfo.email" : {$eq: email},
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
                termEndYear: termEndYear
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
                    newGroup.termEndYear = termEndYear;
                    newGroup.members = new Array();
                    newGroup.members.push(userID);
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
                            $push: { "members": userID }
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
