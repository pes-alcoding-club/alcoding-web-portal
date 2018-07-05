var verifyUser = require('../../middleware/Token').verifyUser;
var requireRole = require('../../middleware/Token').requireRole;
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

      // Return a response with course data
      return res.status(200).send({
        success: true,
        message: "Details successfully retrieved.",
        courses: {courses}
      });
    }); //end of userCourses endpoint
})

  app.get('/api/assignments/:courseID/assignments', function (req, res) {
    if(!req.params.courseID){
      return res.status(400).send({
        success: false,
        message: 'CourseID not entered in parameters'
      });
    }
      Assignment.find({
        course: req.params.courseID,
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

      // Return a response with assignments data
      return res.status(200).send({
        success: true,
        message: "Details successfully retrieved.",
        assignments: Object.assign({},...assignments)
      });
    });
  })
} //end ofcourseAssignments endpoint
