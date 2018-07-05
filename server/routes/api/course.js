var verifyUser = require('../../middleware/Token').verifyUser;
var requireRole = require('../../middleware/Token').requireRole;
var Course = require('../../models/assignments/Course');
var Assignment = require('../../models/assignments/Assignment');

module.exports = (app) => {
    app.post('/api/course/createCourse', function(req, res){

    var name = '' + req.body.name;
    var code = req.body.code;
    var department = req.body.department;
    var description = req.body.description;
    var resourcesUrl = req.body.resourcesUrl;
    var endDate = req.body.endDate;
    var startDate = req.body.startDate;
    var credits = req.body.credits;
    var hours = req.body.hours;
    var prof = req.body.professors;
    var students = req.body.students;

    if(!name){
        return res.status(400).send({
            success: false,
            message: 'Course name required.'
        });
    }

    if(!code){
        return res.status(400).send({
            success: false,
            message: 'Course code required.'
        });
    }

    if(!department){
        return res.status(400).send({
            success: false,
            message: 'Department required.'
        });
    }

    Course.find({
        code: code
        // isDeleted: false
    }, (err, previousCourse) => {
        if (err){
            return res.status(500).send({
                success: false,
                message: "Error: Server Error"
            });
        }
        if (previousCourse.length > 0){
            return res.status(409).send({
                success: false,
                message: "Error: Course already exists"
            });
        }
    // save the course
        const newCourse = new Course();

        newCourse.name = name;
        newCourse.code = code;
        newCourse.department = department;
        newCourse.description = description;
        newCourse.resourcesUrl = resourcesUrl;
        newCourse.duration.startDate = startDate;
        newCourse.duration.endDate = endDate;
        newCourse.details.credits = credits;
        newCourse.details.hours = hours;
        newCourse.professors = prof;
        newCourse.students = students;
        console.log(newCourse)

        newCourse.save((err, course) =>{
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: Server1 error"
                });
            }
            console.log(newCourse._id + " Added to DB")
            return res.status(200).send({
                success: true,
                message: "New course created"
            })
        })
    }
)
})
// end of createCourse endpoint
app.post('/api/assignment/createAssignment', function(req, res){

    var name = '' + req.body.name;
    var user = '' + req.body.user;
    var uniqueId = '' + req.body.uniqueId;
    var courseCode = '' + req.body.courseCode;
    var type = '' + req.body.type;
    var maxMarks = '' + req.body.maxMarks;
    var resourcesUrl = '' + req.body.resourcesUrl;
    var endDate = '' + req.body.endDate;
    var startDate = '' + req.body.startDate;
    var POC = '' + req.body.POC;
    var submissionsUrl = '' + req.body.submissionsUrl;
    console.log(courseCode)

    if (!courseCode || !type || !uniqueId || !name || !submissionsUrl || !user){
        return res.status(400).send({
            success: false,
            message: 'Error: All details are required'
        });
    }
    var courseid = courseCode
    Assignment.find({
        courseid: courseid._id,
        isDeleted: false
    }, (err, course) => {
        if (err){
            return res.status(500).send({
                success: false,
                message: "Error: Server1 Error"
            });
        }
    // save the assignments
    const newAss = new Assignment();

    newAss.name = name;
    newAss.course = courseCode;
    newAss.type = type;
    newAss.submissions.user = user._id;
    newAss.maxMarks = maxMarks;
    newAss.resourcesUrl = resourcesUrl;
    newAss.duration.startDate = startDate;
    newAss.duration.endDate = endDate;
    newAss.POC = POC;
    newAss.uniqueId = uniqueId;
    newAss.submissionsUrl = submissionsUrl;

    console.log(newAss)
    newAss.save((err, assignment) => {
        if (err){
            return res.status(500).send({
                success: false,
                message: "Error: Server Error"
            });
        }
        console.log(newAss._id + "Added to DB")
        return res.status(200).send({
            success: true,
            message: "New Assignment created"
        });
    })
})

})// end of Assignments endpoint
app.get('/api/course/:userID/', verifyUser, function (req, res) {
    if (!req.params.userID) {
        return res.status(400).send({
            success: false,
            message: "Error: userID has not been entered in parameters. Please try again."
        });
      }

    Course.find({
      student: req.params.userID,
      // isDeleted: false
      // Comment out the above line if courses are ever deleted.
    }, (err, courses) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: "Error: Server error."
        });
      }
      if (courses.length < 1) {
        return res.status(404).send({
          success: false,
          message: 'Error: No courses found for this user.'
        });
      }

      // Return a response with course data
      return res.status(200).send({
        success: true,
        message: "Details successfully retrieved.",
        courses: courses.toObject()
      });
    }); //end of userCourses endpoint
})

  app.get('/api/assignments/:courseID', verifyUser, function (req, res) {
    if(!req.params.courseID){
      return res.status(400).send({
        success: false,
        message: 'courseID not entered in parameters'
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
        assignments: assignments.toObject()
      });
    });
  })
} //end ofcourseAssignments endpoint