const getOutput = require("../../utils/dockerAPI");

module.exports = app => {
  app.post("/api/onlineJudge/submit", async (req, res) => {
    const data = req.body.data || new Object({});
    //console.log(data);
    try {
      const val = await getOutput(data);
      res.json(val);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  });
};
