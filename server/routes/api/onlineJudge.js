const getOutput = require("../../utils/dockerAPI");
// A json object has to passed with request body to this endpoint,  the json has the format
// {
//   "data": {
//       "language": "cpp",
//       "testCases": [
//           "1",
//           "2",
//           "3"
//       ],
//       "timeout": "1s",
//       "files": [
//           {
//               "name": "foo.cpp",
//               "content": "#include <stdio.h>\nint main(){ //Test comment. \nint w; scanf(\"%d\", &w); printf(\"Number: %d\", w);   return 0;}"
//           }
//       ]
//   }
// }
// It calls the getOutput function, passing the data json  as the parameter, and return the output json of the getOutput 
// function.
module.exports = app => {
  app.post("/api/onlineJudge/submit", async (req, res) => {
    const data = req.body.data || new Object({});
    
    try {
      const val = await getOutput(data);
      return res.status(200).json(val);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server error");
    }
  });
};
