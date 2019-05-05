const { spawn } = require("child_process");
const startNgrok = require("./ngrok");

// run ngrok
startNgrok().then(redirectUrl => {
  // set environent var to simulate production
  process.env.REDIRECT_URL = redirectUrl;
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const server = spawn(npm,  ["run", "server"]);

  server.stdout.pipe(process.stdout);
  server.stderr.pipe(process.stderr);

  server.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
});
