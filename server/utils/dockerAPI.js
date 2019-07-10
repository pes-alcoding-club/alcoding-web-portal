var Docker = require("dockerode");
var docker = new Docker({ socketPath: "/var/run/docker.sock" });

const getOutput = async jsonObj => {
  let container = null;
  var temp = "output";
  let strJson = null;
  container = await docker.createContainer({
    Image: "alcoding/compiler_store",
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    OpenStdin: true,
    StdinOnce: false
  });

  container.attach(
    {
      stream: true,

      stdin: true,
      stdout: true,
      stderr: true
    },
    function(err, stream) {
      if (err) throw err;
      strJson = JSON.stringify(jsonObj);
      stream.write(strJson + "\n");
    }
  );

  container = await container.start();

  await container.wait();

  temp = await container.logs({
    stdout: true
  });

  console.log(temp);
  strArr = temp.split(strJson + "\r" + "\n");
  console.log(strArr);
  container = await container.remove();

  console.log("container removed");
  return JSON.parse(strArr[1]);
};

module.exports = getOutput;
