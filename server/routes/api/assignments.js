const User = require('../../models/User');
const File = require('../../models/Files');
var Course = require('../../models/assignments/Course');
var Assignment = require('../../models/assignments/Assignment');

module.exports = (app) => {
  app.get('/api/assignments/:userID/courses', function (req, res) {
    if (!req.params.userID) {
        return res.status(400).send({
            success: false,
            message: "Error: userID not in parameters. Please try again."
        });
      }

    Course.find({
      students: req.params.userID,
      isDeleted: false
    }, (err, courses) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: "Error: Server error."
        });
      }
      if (courses.length < 1) {
        console.log(courses);
        return res.status(404).send({
          success: false,
          message: 'Error: No courses found for this user.'
        });
      }

      return res.status(200).send({
        success: true,
        message: "Details successfully retrieved.",
        courses: {courses}
      });
    });
})

  app.get('/api/assignments/:courseCode/assignments', function (req, res) {
    var courseCode = req.params.courseCode;
    if(!courseCode){
      return res.status(400).send({
        success: false,
        message: 'CourseCode not in parameters'
      });
    }
        Course.find({
          code: courseCode,
          isDeleted: false
        }, (err, courses) => {
          if(err){
            return res.status(500).send({
              success: false,
              message: "Error: Server error."
            });
          }
          if (courses.length < 1) {
            return res.status(404).send({
              success: false,
              message: 'Error: No courses found.'
            });
          }
          var course = courses[0];
          Assignment.find({
            course: course._id,
            isDeleted: false
          }, (err, assignments) => {
            if (err) {
              return res.status(500).send({
                success: false,
                message: "Error: Server error."
              });
            }
  
          if (assignments.length < 1) {
            return res.status(404).send({
              success: false,
              message: 'Error: No assignments found for this course.'
            });
          }
  
          return res.status(200).send({
            success: true,
            message: "Details successfully retrieved.",
            assignments: {assignments}
          });
        });

      })
  })

  app.get('/api/assignments/:courseCode/:userID/assignmentsNotSubmitted', function (req, res) {
    var courseCode = req.params.courseCode;
    var userID = req.params.userID;
    if(!courseCode || !userID){
      return res.status(400).send({
        success: false,
        message: 'CourseCode, UserID required.'
      });
    }
        Course.find({
          code: courseCode,
          isDeleted: false
        }, (err, courses) => {
          if(err){
            return res.status(500).send({
              success: false,
              message: "Error: Server error."
            });
          }
          if (courses.length < 1) {
            return res.status(404).send({
              success: false,
              message: 'Error: No courses found.'
            });
          }
          var course = courses[0];

          User.find({
            _id: userID,
          }, (err, users) => {
            if(err){
              return res.status(500).send({
                success: false,
                message: "Error: Server error."
              });
            }
            if (users.length < 1) {
              return res.status(404).send({
                success: false,
                message: 'Error: User not found.'
              });
            }
            var user = users[0];
            Assignment.find({
              course: course._id,
              submissions: {
                "$not": {"$elemMatch": {user: user._id}},
              },
              isDeleted: false
            }, (err, assignments) => {
              if (err) {
                return res.status(500).send({
                  success: false,
                  message: "Error: Server error."
                });
              }
    
            if (assignments.length < 1) {
              return res.status(404).send({
                success: false,
                message: 'Error: No assignments found for this course.'
              });
            }
    
            return res.status(200).send({
              success: true,
              message: "Details successfully retrieved.",
              assignments: {assignments}
            });
          });
        })
      })
  })
}
