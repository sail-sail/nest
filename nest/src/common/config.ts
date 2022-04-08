import "dotenv/config";
import { parse as tomlParse } from "toml";
import {
  readFileSync,
  // mkdirSync,
  // accessSync,
  // constants,
} from "fs";
// import { readdir, stat, unlink } from "fs/promises";

// let later = undefined;

export const _PROJECT_PATH = process.env._PROJECT_PATH || process.cwd().replace(/\\/g, "/")+"/";

// const tmp_dir = `${ _PROJECT_PATH }/src/common/tmp/`;
// if (process.env.NODE_ENV === "production") {
//   try {
//     mkdirSync(tmp_dir);
//   } catch (err) {
//   }
//   try {
//     accessSync(tmp_dir, constants.R_OK | constants.W_OK);
//   } catch (err) {
//     throw `系统临时文件夹无读写文件权限! ${ err.message }`;
//   }
//   if (!later) {
//     later = require("@breejs/later");
//   }
//   later.setInterval(async function() {
//     const date = new Date();
//     const dateTime2 = date.getTime()-172800000;
//     try {
//       const files = await readdir(tmp_dir);
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         if (file.startsWith(".")) continue;
//         const tmpFile = tmp_dir+"/"+file;
//         const stats = await stat(tmpFile);
//         if (dateTime2 >= stats.atime.getTime()) {
//           console.log(`unlink.tmpFile: ${ tmpFile }`);
//           await unlink(tmpFile);
//         }
//       }
//     } catch (err) {
//       console.error(err.message);
//     }
//   }, later.parse.cron('0 20 * * *'));
// }

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
  socketPath?: string,
};

const configStr = readFileSync(`${ _PROJECT_PATH }/config.toml`, "utf8");
const config = <{
  server: {
    host: string,
    port: number,
    token_timeout: number,
    title: string,
  },
  database: database,
  cache?: {
    type: "redis",
    database: number,
    expire: number,
    socket?: {
      path?: string,
      host?: string,
      port?: number,
    },
  },
  tmpfile: {
    type: "redis",
    database: number,
    expire: number,
    socket?: {
      path?: string,
      host?: string,
      port?: number,
    },
  },
  oss?: {
    type: "minio",
    accessKey?: string,
    secretKey?: string,
    endPoint?: string,
    port?: number,
    bucket?: string,
    region?: string,
    poolSize?: number,
    pendingTimeout?: number,
  },
  wxapp?: {
    appid?: string,
    secret?: string,
  },
  log?: {
    lever: "log"|"error",
    path: string,
    separate: string,
    expire_day: number,
  },
}>tomlParse(configStr.replace(/\{\{_PROJECT_PATH\}\}/g, _PROJECT_PATH));
// console.log(config);

if (config.server.title) process.title = config.server.title;

export default config;
