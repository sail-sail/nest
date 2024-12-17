const {
  readFileSync,
} = require("node:fs");

const dotenv = require("dotenv");

const buf = readFileSync(`${ __dirname }/../../../../deno/.env.dev`);
const conf = dotenv.parse(buf);

const config = {
  database: {
    type: conf.database_type,
    host: conf.database_hostname,
    port: conf.database_port,
    username: conf.database_username,
    password: conf.database_password,
    database: conf.database_database,
  },
  ...conf,
};

module.exports = config;
