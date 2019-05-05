const shell = require("shelljs");
const path = require("path");
const muri = require("muri");
const paths = require("../config/paths");

const backups = path.join(paths.appDb, "backups/");
const { MONGODB_URI } = process.env;

if (!shell.which("mongodump")) {
  shell.echo("mongodump not found in environment");
  shell.exit(1);
}

if (!MONGODB_URI) {
  shell.echo("MONGODB_URI not set in environment");
  shell.exit(1);
}

const { hosts: [{ host, port }], db, auth: { user, pass } } = muri(MONGODB_URI);
const args = [
  `-h ${host}:${port}`,
  `-d ${db}`,
  `-u ${user}`,
  `-p ${pass}`,
  `-o ${path.join(backups, Date.now().toString())}`
].join(" ");

const output = shell.exec(`mongodump ${args}`);
if (output.code !== 0) {
  shell.echo(output.stderr);
  shell.exit(1);
} else {
  shell.echo(output.stdout);
}
