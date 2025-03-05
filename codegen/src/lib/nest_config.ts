import { readFileSync } from "fs";
import * as dotenv from "dotenv";

type Database = {
  type: string,
  host: string,
  port?: number,
  username: string,
  password?: string,
  database?: string,
};

const buf = readFileSync(`../deno/.env.dev`);
const conf = dotenv.parse(buf);

const config: {
  database: Database;
  oss_accesskey: string;
  oss_secretkey: string;
  oss_endpoint: string;
  oss_bucket: string;
} = {
  database: {
    type: conf.database_type,
    host: conf.database_hostname,
    port: Number(conf.database_port),
    username: conf.database_username,
    password: conf.database_password,
    database: conf.database_database,
  },
  ...conf,
} as any;

export default config;
