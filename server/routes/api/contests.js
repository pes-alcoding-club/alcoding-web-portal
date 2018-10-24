const User = require('../../models/User');
const File = require('../../models/Files');
var requireRole = require('../../middleware/Token').requireRole;
var verifyUser = require('../../middleware/Token').verifyUser;
var path = require("path")
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

  app.get('/api/contests/updatedHandles', requireRole("admin"), function (req, res) {
    var file = path.join(dir, "handles.json");

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
      var userContenderDetails = {};
      for (var user of users) {
        let name = user.name.firstName + " " + user.name.lastName;
        delete user.contender["$init"];
        userContenderDetails[user.usn] = Object.assign({}, user.contender);
        userContenderDetails[user.usn]["batch"] = user.batch;
      }

      let data = JSON.stringify(userContenderDetails, null, 2);
      // fs.writeFileSync(file, data);
      fs.writeFile(file, data, (err) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error: Server error."
          });
        }
        return res.download(file, function (err) {
          if (err) {
            return res.status(404).send({
              success: false,
              message: "Error: File not found."
            });
          }
        });
      });
    })
  });

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
        if (pushObject.rating != -1 && pushObject.timesPlayed != 0)
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

  app.put('/api/contests/:userID/codingHandle', verifyUser, function (req, res) {
    var userID = req.params.userID;
    var codechef = req.body.codechef;
    var codejam = req.body.codejam;
    var kickstart = req.body.kickstart;
    var spoj = req.body.spoj;
    var hackerRank = req.body.hackerRank;
    var codeforces = req.body.codeforces;
    var hackerEarth = req.body.hackerEarth;

    // Deduplication flow
    User.find({
      _id: userID,
      isDeleted: false
    }, (err, previousUsers) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: 'Server find error'
        });
      }
      else if (previousUsers.length > 0) {
        // Update
        var handles = previousUsers[0].contender.handles.toObject();

        if (!handles || Array.isArray(handles))
          handles = new Object();
        if (codejam) handles.codejam = codejam;
        if (kickstart) handles.kickstart = kickstart;
        if (spoj) handles.spoj = spoj;
        if (hackerRank) handles.hackerRank = hackerRank;
        if (codeforces) handles.codeforces = codeforces;
        if (hackerEarth) handles.hackerEarth = hackerEarth;
        if (codechef) handles.codechef = codechef;

        previousUsers[0].contender.handles = handles;
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
        if (!usn) {
          return res.status(400).send({
            success: false,
            message: 'Error: Could not find user'
          });
        }
      }
    });
  });

  app.post('/api/contests/updateContenders', requireRole("admin"), function (req, res) {
    var usn = req.body.usn;
    var name = req.body.name;
    var email = req.body.email;
    var rating = req.body.rating;
    var volatility = req.body.volatility;
    var timesPlayed = req.body.timesPlayed;
    var lastFive = req.body.lastFive;
    var best = req.body.best;

    if (!usn) {
      return res.status(400).send({
        success: false,
        message: 'Error: USN cannot be blank'
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
      else if (previousUsers.length > 0) {
        // Update
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
              message: 'Error: Server error'
            });
          }
          return res.status(200).send({
            success: true,
            message: 'Contender Updated'
          });
        });
      }
      else {
        return res.status(400).send({
          success: false,
          message: 'Error: User not found.'
        });
      }
    });
  });
}
