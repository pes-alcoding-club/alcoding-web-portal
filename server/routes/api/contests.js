const Contender = require('../../models/contests/Contender');
const Contest = require('../../models/contests/Contest')

const User = require('../../models/User');

var requireRole = require('../middleware/Token').requireRole;
var verifyUser = require('../middleware/Token').verifyUser;

module.exports = (app) => {
    app.post('/api/contests/handle', verifyUser, function (req, res) {
      var platform = req.body.platform;
      var handle = req.body.handle;

      if (!platform || !handle) {
        return res.status(400).send({
          success: false,
          message: 'Error: Both fields required.'
        });
      }
      newHandle = {"platform": platform, "handle": handle};
      Contender.findOneAndUpdate({user: req.user}, {$push: {handles: newHandle}});

      return res.status(200).send({
        success: true,
        message: 'Handle Added',
      });
    }),

    app.post('/api/contests/history', requireRole("admin"), function (req, res) {
      var contest = req.body.contest;
      var score = req.body.score;
      var rank = req.body.rank;

      if (!contest || !score || !rank) {
        return res.status(400).send({
          success: false,
          message: 'Error: All fields required.'
        });
      }
      newHistory = {"contest": contest, "score": score, "rank": rank};
      Contender.findOneAndUpdate({user: req.user}, {$push: {history: newHistory}});

      return res.status(200).send({
        success: true,
        message: 'History Added',
      });
    }),

    app.post('/api/contests/contest', requireRole("admin"), function (req, res) {
      var name = req.body.name;
      var url = req.body.url;
      var platform = req.body.platform;
      var ranksUrl = req.body.ranksUrl;
      var date = req.body.date;
      var maxScore = req.body.maxScore;

      if (!name || !url || !platform || !ranksUrl || !date) {
        return res.status(400).send({
          success: false,
          message: 'Error: Name, URL, Platform, RanksURL, Date are required fields.'
        });
      }
      newContest = new Contest();
      newContest.name = name;
      newContest.url = url;
      newContest.platform = platform;
      newContest.ranksUrl = ranksUrl;
      newContest.maxScore = maxScore;
      newContest.date = date;
      newContest.save((err) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.status(200).send({
          success: true,
          message: 'New contest created',
        });
      });
    }),

    app.post('/api/contests/contender', requireRole("admin"), function (req, res) {
      var currentRank = req.body.currentRank;

      if (!currentRank) {
        return res.status(400).send({
          success: false,
          message: 'Error: Current Rank required. -1 if unknown.'
        });
      }
      newContender = new Contender();
      newContender.user = req.user;
      newContender.currentRank = currentRank;
      newContender.save((err) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.status(200).send({
          success: true,
          message: 'New contender created',
        });
      });
    }), // Completion of post methods

    app.get('/api/contests/leaderboard', function (req, res) {
      var limitTo = req.body.limitTo;
      if(!limitTo){
        limitTo = 100;
      }

      console.log("Request to access leaderbaord.");

      Contender.
        find({
          isDeleted: false,
          currentRank: { $ne: -1 },
        }).
        limit(limitTo).
        sort({ currentRank: 1}, (err, contenders) => {
          if (err) {
            return res.status(500).send({
              success: false,
              message: "Error: Server error"
            });
          }
          var i;
          var leaderbaord = {};
          for (i=0; i<contenders.length; i++){
            rankHolder = {
              rank: contenders[i].currentRank,
              user: contenders[i].user.name.firstName,
            };
            leaderbaord.push(rankHolder);
          }
          return res.status(200).send({
            success: true,
            message: "Leaderboard successfully retrieved",
            leaderboard: leaderbaord
          });

        });
    });

    app.get('/api/contests/:userID/contender', verifyUser, function (req, res) {
      var user_id = req.params.userID;

      //Verify that userID is present as a parameter
      if (!user_id) {
        return res.status(400).send({
          success: false,
          message: 'Error: userID parameter cannot be blank'
        });
      }

      console.log("Request to access contender details of " + user_id);
      // Search for the user in the User model with his user_id
      User.find({
        _id: user_id
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
        Contender.find({
          user: user,
          isDeleted: false 
        }, (err, contenders) => {
          if (err) {
            return res.status(500).send({
              success: false,
              message: "Error: Server error"
            });
          }

          if (contenders.length != 1) {
            return res.status(404).send({
              success: false,
              message: 'Error: Contender not found.'
            });
          }
          var contender = contenders[0].toObject();
          delete contender.user;
          delete contender.isDeleted;
  
          return res.status(200).send({
            success: true,
            message: "Details successfully retrieved",
            contender: contender
          });
        })
      });
    });
};
