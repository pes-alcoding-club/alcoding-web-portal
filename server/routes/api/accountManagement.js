const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const jwt = require('jsonwebtoken');
var verifyUser = require('../../middleware/Token').verifyUser;
const fs = require('fs');
var nodemailer = require('nodemailer');
var path = require('path');
var privateKey = fs.readFileSync('server/sslcert/server.key', 'utf8'); //privatekey for jwt
const config = require('../../../config/config');

// TODO: Limit number of queries to these endpoints
// TODO: Async functionality
// TODO: Change logout to POST as it isn't idempotent

module.exports = (app) => {
  app.post('/api/admin/signup', function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;

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
    if (!password) {
        return res.status(400).send({
            success: false,
            message: 'Error: password cannot be blank.'
        });
    }

    // Process data
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
        newUser.password = newUser.generateHash(password);
        newUser.valid = true;

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

  app.post('/api/account/signin', function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    console.log("Email " + email + " attempting to signIn.");

    if (!email) {
      return res.status(400).send({
        success: false,
        message: 'Error: email cannot be blank.'
      });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        message: 'Error: Password cannot be blank.'
      });
    }

    // Process data
    email = ('' + email).toLowerCase().trim();
    password = '' + password;

    // Search for user in db
    User.find({
      "basicInfo.email":{$eq: email},
      isDeleted: false,
      valid: true
    }, (err, users) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: 'Error: Server Error.'
        });
      }
      if (users.length != 1) {
        return res.status(401).send({
          success: false,
          message: 'Error: Invalid'
        });
      }

      const user = users[0];
      if (!user.checkPassword(password)) {
        return res.status(401).send({
          success: false,
          message: 'Error: Invalid credentials.'
        });
      }

      // Otherwise correct user
      payload = {
        user_id: user._id,
        role: user.role,
        tags: user.tags
      };
      jwt.sign(payload, privateKey, {
        expiresIn: "2d"
      }, (err, token) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            success: false,
            message: 'Error: Server Error.'
          });
        }

        newSession = new UserSession();
        newSession.token = token;
        newSession.save((err, session) => {
          if (err) {
            return res.status(500).send({
              success: false,
              message: 'Error: Server error'
            });
          }
          console.log("JWT generated.");
          return res.status(200).send({
            success: true,
            message: 'Valid sign in',
            user_id: payload.user_id,
            token: token
          });
        });
      });
    });
  }), //end of sign in endpoint

    app.post('/api/account/:userID/changePassword', verifyUser, function (req, res) {
      var user_id = req.params.userID;
      var oldPassword = req.body.oldPassword;
      var newPassword = req.body.newPassword;

      if (!user_id) {
        return res.status(400).send({
          success: false,
          message: 'Error: userID not entered in parameters'
        });
      }
      if (!oldPassword) {
        return res.status(400).send({
          success: false,
          message: 'Error: old Password not entered in body'
        });
      }
      if (!newPassword) {
        return res.status(400).send({
          success: false,
          message: 'Error: new Password not entered in body'
        });
      }

      User.find({
        _id: user_id,
        valid: true,
        isDeleted: false
      }, function (err, users) {
        if (err) {
          return res.status(500).send({
            success: false,
            message: 'Error: Server Error.'
          });
        }
        if (!users) {
          return res.status(400).send({
            success: false,
            message: 'User does not exist in DB.'
          })
        }
        var user = users[0];
        var toemail = user.basicInfo.email;
        if (user.checkPassword(oldPassword)) {
          newPassword = user.generateHash(newPassword);
          User.findByIdAndUpdate({
            _id: user_id
          }, {
              $set: {
                password: newPassword
              }
            }, null, function (err) {
              if (err) {
                return res.status(500).send({
                  success: false,
                  message: 'Error: Server Error.'
                });
              } else {
                return res.status(200).send({
                  success: true,
                  message: 'Password succesfully changed.'
                });
                // fs.readFile(path.join(process.cwd(), 'server/mailTemplates/changedPassword.txt'), 'utf8', function (err, data) {
                //   if (err) {
                //     return res.status(500).send({
                //       success: false,
                //       message: 'Error: Server error'
                //     });
                //   }
                //   var emaildata = data.toString();
                //   var datetime = new Date();
                //   emaildata = emaildata.replace("{username}", user.name.firstName);
                //   emaildata = emaildata.replace("{time}", datetime.toString());
                //   fs.readFile(path.join(process.cwd(), '../email_auth.csv'),'utf8', function(err,data){
                //     if (err) {
                //       return res.status(500).send({
                //         success: false,
                //         message: 'Error: Server error'
                //       });
                //     }
                //     var email = data.toString().split(',')[0].trim();
                //     var password = data.toString().split(',')[1].trim();
                //     var transporter = nodemailer.createTransport({
                //       service: 'gmail',
                //       auth: {
                //         user: email,
                //         pass: password
                //       }
                //     });

                //     var mailOptions = {
                //       from: email,
                //       to: toemail,
                //       subject: 'Password Change for Alcoding Account',
                //       text: emaildata
                //     };

                //     transporter.sendMail(mailOptions, function (error, info) {
                //       if (error) {
                //         console.log(error);
                //         return res.status(500).send({
                //           success: false,
                //           message: "Error: Server error"
                //         });
                //       } else {
                //         console.log('Email for password change sent: ' + info.response);
                //         return res.status(200).send({
                //           success: true,
                //           message: "Email sent to " + toemail
                //         })
                //       }
                //     });
                //   })
                // })
              }
            })
        } else {
          return res.status(400).send({
            success: false,
            message: "User has entered wrong password"
          })
        }
      })
    }), //end of change password endpoint

    app.post('/api/account/:userID/newPassword', verifyUser, function (req, res) {
      var newPassword = req.body.newPassword;
      if (!req.params.userID) {
        return res.status(400).send({
          success: false,
          message: 'Error: userID not entered in parameters'
        });
      }
      if (!newPassword) {
        return res.status(400).send({
          success: false,
          message: 'Error: new Password not entered in body'
        });
      }
      const user = new User();
      newPassword = user.generateHash(newPassword);
      User.findOneAndUpdate({
        _id: req.params.userID
      }, {
          $set: {
            password: newPassword,
            valid: true
          }
        }, null, function (err, user) {
          if (err) {
            return res.status(500).send({
              success: false,
              message: "Error: Server error"
            });
          }
          UserSession.findOneAndRemove({
            token: req.token
          }, (err) => {
            if (err) {
              return res.status(500).send({
                success: false,
                message: "Error: Server error"
              });
            }
          });
          return res.status(200).send({
            success: true,
            message: "User password changed successfully."
          })
        });
    }), //end of new password endpoint

    app.get('/api/account/:userID/logout', verifyUser, function (req, res) {
      // GET http://localhost:8080/api/account/:userID/logout
      var user_id = req.params.userID;

      if (!user_id) {
        return res.status(400).send({
          success: false,
          message: 'Error: UserID parameter cannot be blank'
        });
      }

      UserSession.findOneAndRemove({
        token: req.token
      }, (err, session) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error: Server error"
          });
        }
        if (!session) {
          return res.status(400).send({
            success: false,
            message: "Error: Invalid."
          });
        }

        return res.status(200).send({
          success: true,
          message: 'User has been logged out'
        });
      });
    }), //end of logout endpoint

    app.get('/api/account/:userID/verifyToken', verifyUser, function (req, res) {
      console.log("Is valid token? ");
      return res.status(200).send({
        success: true,
        message: "Token is valid.",
        user: user
      });
    }), //end of verifyToken endpoint 

    app.post('/api/account/:userID/username', verifyUser, function (req, res) {
      if (!req.body.username) {
        return res.status(400).send({
          success: false,
          message: 'Error: username not provided'
        });
      }
      User.find({
        username: req.body.username,
        isDeleted: false
      }, function (err, users) {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error: Server error"
          });
        }
        if (users.length > 0) {
          return res.status(404).send({
            success: false,
            message: 'Error: Username already exists'
          });
        }
        User.findOneAndUpdate({
          _id: req.user_id,
          valid: true,
          isDeleted: false
        }, {
            username: req.body.username
          }, null, function (err, user) {
            if (err) {
              return res.status(500).send({
                success: false,
                message: "Error: Server error"
              });
            }
            if (!user) {
              return res.status(404).send({
                success: false,
                message: 'Error: No such user exists'
              });
            }
            return res.status(200).send({
              success: true,
              message: 'Username updated successfully',
            });
          })
      })
    }),

    app.get("/api/users/:username", function(req,res){
      if(!req.params.username){
        return res.status(400).send({
          success: false,
          message: "Error: username not recieved"
        });
      }

      User.findOne({
        username: req.params.username,
        valid: true,
        isDeleted: false,
      }, function(err, user){
        if(err){
          return res.status(500).send({
            success: false,
            message: 'Error: Server error'
          });
        }
        if(!user){
          return res.status(404).send({
            success: false,
            message: 'Error: No such user found'
          });
        }
          // TODO: Retrieve more data like courses assigned for the users who are professors
        var user_data = new Object();
        user_data.usn = user.usn;
        user_data.name = user.name;
        user_data.username = user.username;
        user_data.groups = user.groups;
        user_data.rating = user.contender.rating;
        user_data.best = user.contender.best;
        user_data.role = user.role;
        return res.status(200).send({
          success: true,
          message: "Successfully retrieved",
          user: user_data
        })
      })
    })

    app.get('/api/account/:userID/details', verifyUser, function (req, res) {
      // GET http://localhost:8080/api/account/:userID/details
      var user_id = req.params.userID;

      //Verify that userID is present as a parameter
      if (!user_id) {
        return res.status(400).send({
          success: false,
          message: 'Error: userID parameter cannot be blank'
        });
      }

      console.log("Request to access details of " + user_id);
      // Search for the user in the User model with his user_id
      User.find({
        _id: user_id,
        valid: true
      }, (err, users) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error: Server error"
          });
        }

        if (users.length != 1) {
          return res.status(404).send({
            success: false,
            message: 'Error: User not found.'
          });
        }
        var user = users[0].toObject();
        delete user.password;
        delete user.isDeleted;
        delete user.__v;
        delete user.files;

        // Return a response with user data
        return res.status(200).send({
          success: true,
          message: "Details successfully retrieved",
          user: user
        });
      });
    }), //end of getDetails endpoint

    app.get('/api/account/:userID/info', function (req, res) {
      // GET http://localhost:8080/api/account/:userID/info
      var user_id = req.params.userID;

      //Verify that userID is present as a parameter
      if (!user_id) {
        return res.status(400).send({
          success: false,
          message: 'Error: userID parameter cannot be blank'
        });
      }

      console.log("Requesting info of " + user_id);
      // Search for the user in the User model with his user_id
      User.find({
        _id: user_id,
        valid: true
      }, (err, users) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error: Server error"
          });
        }

        if (users.length != 1) {
          return res.status(404).send({
            success: false,
            message: 'Error: User not found.'
          });
        }
        var user = users[0].toObject();
        delete user.password;
        delete user.isDeleted;
        delete user.__v;
        delete user.files;
        delete user.contender;
        delete user.basicInfo;
        delete user.groups;
        delete user.role;
        delete user.createdAt;
        delete user.updatedAt;
        delete user._id;

        // Return a response with user data
        return res.status(200).send({
          success: true,
          message: "Details successfully retrieved",
          user: user
        });
      });
    }), //end of info endpoint

    app.put('/api/account/:userID/basicInfo', verifyUser, function (req, res) {
      // PUT http://localhost:8080/api/account/:userID/basicInfo
      var user_id = req.params.userID;

      //Verify that userID is present as a parameter
      if (!user_id) {
        return res.status(400).send({
          success: false,
          message: 'Error: userID parameter cannot be blank'
        });
      }

      console.log("Request to update details of " + user_id);
      var update = req.body

      User.findOneAndUpdate({
        _id: user_id,
        valid: true
      }, {
          basicInfo: Object.assign({}, update)
        },
        (err) => {

          if (err) {
            return res.status(500).send({
              success: false,
              message: "Error: Server error"
            });
          } else {
            return res.status(200).send({
              success: true,
              message: "Details Updated!"
            });
          }
        })

    }), //end of basic info endpoint

    app.post('/api/account/forgotPassword', function (req, res) {
      if (!req.body.email) {
        return res.status(400).send({
          success: false,
          message: 'Error: No SRN'
        });
      }
      User.findOne({
        email: req.body.email,
        valid: true
      }, function (err, user) {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error: Server error"
          });
        }
        if (!user) {
          return res.status(404).send({
            success: false,
            message: "No User"
          })
        }

        payload = {
          user_id: user._id,
          role: user.role,
          tags: user.tags
        };

        jwt.sign(payload, privateKey, {
          expiresIn: "1h"
        }, (err, token) => {
          if (err) {
            return res.status(500).send({
              success: false,
              message: 'Error: Server Error'
            });
          }

          newSession = new UserSession();
          newSession.token = token;
          newSession.save((err, session) => {
            if (err) {
              return res.status(500).send({
                success: false,
                message: 'Error: Server error'
              });
            }
            console.log("JWT generated for forgot password.");
            var link = config.host_url + 'reset/' + token + '/' + user._id.toString();
            var writeData = user.basicInfo.email + "," + user.name.firstName + "," + link + ',forgotPassword' + "\n";
            fs.appendFile("./server/sendEmail/emails.csv", writeData, function (err) {
              if (err) {
                return console.log(err);
              }
              console.log("Email scheduled");
            });
            return res.status(200).send({
              success: true,
              message: 'Email sent'
            });

          });
        });
      })
    })
};
