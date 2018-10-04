const User = require('../../models/User');
const File = require('../../models/Files');
var requireRole = require('../../middleware/Token').requireRole;
// var fileDB = require('../../middleware/fileStorage').fileDB;
var diskStorage = require('../../middleware/fileStorage').diskStorage;
var fileUpload = require('../../middleware/fileStorage').fileUpload;
var retrieveFile = require('../../middleware/fileStorage').retrieveFile;
var fs = require("fs");
var dir = process.cwd() + '/../temp';
var keyName = "inputFile";

module.exports = (app) => {
  app.get('/api/contests/:userID/contenderInfo', function (req, res) {
    var userID = req.params.userID;
    if (!userID) {
      return res.status(400).send({
        success: false,
        message: 'Error: userID not in parameters.'
      });
    }

    User.find({
      _id: userID,
      isDeleted: false
    }, (err, users) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: "Error: Server error."
        });
      }
      if (!users) {
        return res.status(404).send({
          success: false,
          message: 'No users'
        });
      }
      if (users.length != 1) {
        return res.status(404).send({
          success: false,
          message: 'More than one user'
        });
      }
      var user = users[0].toObject();
      delete user.password;
      delete user.role;
      delete user.files;

      return res.status(200).send({
        success: true,
        message: "Individual contender details retrieved.",
        contenderDetails: user
      });

    })
  })

  app.get('/api/contests/globalRankList', function (req, res) {
    User.find({
      isDeleted: false,
    }, (err, users) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: "Error: Server error."
        });
      }
      if (!users) {
        return res.status(404).send({
          success: false,
          message: 'No users'
        });
      }
      var userContenderDetails = [];
      for (var user of users) {
        var name = user.name.firstName + " " + user.name.lastName;
        pushObject = Object.assign({ usn: user.usn, name }, user.contender.toObject());
        pushObject.rating = Math.round(pushObject.rating);
        pushObject.best = Math.round(pushObject.best);
        if(pushObject.rating!=-1 && pushObject.timesPlayed!=0)
          userContenderDetails.push(pushObject);
        else
          continue;
      }
      return res.status(200).send({
        success: true,
        message: "globalRankList retrieved.",
        globalRankList: { userContenderDetails }
      });

    })
  })

  app.post('/api/contests/updateContenders', requireRole("admin"), function (req, res) {
    var usn = req.body.usn;
    var name = req.body.name;
    var email = req.body.email;
    var codejam = req.body.codejam;
    var rating = req.body.rating;
    var volatility = req.body.volatility;
    var timesPlayed = req.body.timesPlayed;
    var lastFive = req.body.lastFive;
    var best = req.body.best;
    var hackerearth = req.body.hackerearth;

    if (!usn) {
      return res.status(400).send({
        success: false,
        message: 'Error: First name cannot be blank.'
      });
    }

    // Process data
    usn = ('' + usn).toUpperCase().trim();

    // Deduplication flow
    User.find({
      usn: usn,
      isDeleted: false
    }, (err, previousUsers) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: 'Error: Server find error'
        });
      }
      else if (previousUsers.length > 0) { //Update
        // previousUsers[0].contender.handles.codejam = codejam;
        // previousUsers[0].contender.handles.hackerearth = hackerearth;
        previousUsers[0].contender.rating = rating;
        previousUsers[0].contender.volatility = volatility;
        previousUsers[0].contender.timesPlayed = timesPlayed;
        previousUsers[0].contender.lastFive = lastFive;
        previousUsers[0].contender.best = best;
        previousUsers[0].save((err, user) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              success: false,
              message: 'Server error'
            });
          }
          return res.status(200).send({
            success: true,
            message: 'Contender Updated'
          });
        });
      }
      else {
        //New user
        const newUser = new User();

        newUser.usn = usn;
        if (name) { newUser.name.firstName = name.split(" ")[0]; newUser.name.lastName = name.split(" ")[1]; }
        if (email) { newUser.basicInfo.email = email; }
        newUser.password = newUser.generateHash(usn);
        newUser.role = "student";

        // newUser.contender.handles.codejam = codejam;
        // newUser.contender.handles.hackerearth = hackerearth;
        newUser.contender.rating = rating;
        newUser.contender.volatility = volatility;
        newUser.contender.timesPlayed = timesPlayed;
        newUser.contender.lastFive = lastFive;
        newUser.contender.best = best;

        newUser.save((err, user) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              success: false,
              message: 'Server error'
            });
          }
          console.log(newUser._id + " added to DB.")
          return res.status(200).send({
            success: true,
            message: 'Signed Up'
          });
        });
      }

    });
  });
}
