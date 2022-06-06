import { parse as tomlParse } from "toml";
import { readFileSync } from "fs";

type database = {
  [key: string]: any,
  name?: string,
  type: "postgres"|"mysql"|"oracle",
  host: string,
  port?: number,
  username: string,
  password?: string,
  database?: string,
  logging?: string,
  synchronize?: boolean,
  extra: any,
  cache?: {
    host?: string,
    port?: number,
  },
};

const configStr = readFileSync(`../nest/config.toml`, "utf8");
const config = <{
  database: database,
}>tomlParse(configStr);

export default config;
