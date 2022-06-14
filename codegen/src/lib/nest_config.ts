import { readFileSync } from "fs";
import * as dotenv from "dotenv";

type database = {
  type: "postgres"|"mysql"|"oracle",
  host: string,
  port?: number,
  username: string,
  password?: string,
  database?: string,
};

const buf = readFileSync(`../deno/.env.dev`);
const conf = dotenv.parse(buf);

const config = {
  type: conf.database_type,
  host: conf.database_host,
  port: conf.database_port,
  username: conf.database_username,
  password: conf.database_password,
  database: conf.database_database,
};

export default config;
