const Contender = require('../../models/contests/Contender');
const Contest = require('../../models/contests/Contest')

const User = require('../../models/User');

var requireRole = require('../middleware/Token').requireRole;
var verifyUser = require('../middleware/Token').verifyUser;

function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    if (arr[i] !== undefined) rv[i] = arr[i];
  return rv;
}

module.exports = (app) => {
  app.post('/api/contests/handle', verifyUser, function (req, res) {
    var email = req.body.email;
    var platform = req.body.platform;
    var handle = req.body.handle;

    if (!email || !platform || !handle) {
      return res.status(400).send({
        success: false,
        message: 'Error: Email of user, Platform and Handle fields required.'
      });
    }

    User.find({
      email: email,
      isDeleted: false,
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
      var user = users[0];
      newHandle = { "platform": platform, "handle": handle };
      Contender.findOneAndUpdate({
        user: user._id
      }, { $push: { handles: newHandle } }, (err, updatedContender) => {
          if (err) {
            return res.status(500).send({
              success: false,
              message: "Error: Server update error"
            });
          }
        });

      return res.status(200).send({
        success: true,
        message: 'Handle Added succesfully',
      });
    })
  }), // Works

    app.post('/api/contests/updateContender', requireRole("admin"), function (req, res) {
      var email = req.body.email;
      var contestName = req.body.contestName;
      var score = req.body.score;
      var rank = req.body.rank;
      var currentRank = req.body.currentRank;

      if (!email) {
        return res.status(400).send({
          success: false,
          message: 'Error: Email field is required'
        });
      }

      User.find({
        email: email
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

        Contest.find({
          name: contestName
        }, (err, contests) => {
          if (err) {
            return res.status(500).send({
              success: false,
              message: "Error: Server error"
            });
          }

          if (contests.length != 1) {
            return res.status(404).send({
              success: false,
              message: 'Error: Contest not found.'
            });
          }
          var contest = contests[0].toObject();
          newHistory = { "contest": contest, "score": score, "rank": rank };
          Contender.findOneAndUpdate({ user: user }, { $push: { history: newHistory } });
          Contender.findOneAndUpdate({ user: user }, { currentRank: currentRank });

          return res.status(200).send({
            success: true,
            message: 'Contender Updated',
          });
        })
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
    }), // Works

    app.post('/api/contests/contender', requireRole("admin"), function (req, res) {
      var email = req.body.email;
      var currentRank = req.body.currentRank;

      if (!email || !currentRank) {
        return res.status(400).send({
          success: false,
          message: 'Error: Current Rank and Email of user required.'
        });
      }

      User.find({
        email: email,
        isDeleted: false,
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
        var user = users[0];

        Contender.find({
          user: user._id,
          isDeleted: false
        }, (err, previousContenders) => {
          if (err) {
            return res.status(500).send({
              success: false,
              message: "Error: Server find error"
            });
          }
          else if (previousContenders.length > 0) {
            return res.status(409).send({
              success: false,
              message: 'Error: Contender already exists.'
            });
          }
          newContender = new Contender();
          newContender.user = user._id;
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
        })
      })
    }), // Completion of post methods and works

    app.get('/api/contests/leaderboard', function (req, res) {
      var limitTo = req.body.limitTo;
      if (!limitTo) {
        limitTo = 100;
      }
      console.log("Request to access leaderbaord.");
      Contender.
        find({
          isDeleted: false,
          currentRank: { $ne: -1 },
        }).
        limit(limitTo).
        sort({ currentRank: 1 }).
        exec(function (err, contenders) {
          if (err) {
            return res.status(500).send({
              success: false,
              message: "Error: Server error"
            });
          }
          var leaderboard = { data: [] };
          var thisContender;
          var firstName;
          var user;
          for (var i = 0; i < contenders.length; i++) {
            thisContender = contenders[i];
            User.find({
              _id: thisContender.user,
              isDeleted: false
            }, (err, users) => {
              if (err) {
                return res.status(500).send({
                  success: false,
                  message: "Error: Server find error"
                });
              }

              if (users.length != 1) {
                return res.status(404).send({
                  success: false,
                  message: 'Error: User not found.'
                });
              }
              user = users[0];
              firstName = user.name.firstName;
              rankHolder = {
                rank: thisContender.currentRank,
                user: firstName,
              };
              leaderboard.data.push(rankHolder);
              console.log(leaderboard);
            })
          }
          return res.status(200).send({
            success: true,
            message: "Leaderboard successfully retrieved",
            leaderboard: leaderboard // Fix data send
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
        user: user._id,
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
