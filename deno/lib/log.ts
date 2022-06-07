// deno-lint-ignore-file no-empty
import {
  appendFile,
  readdir,
  unlink,
  stat,
  access,
} from "std/node/fs/promises.ts";

import {
  mkdirSync,
} from "std/node/fs.ts"

import dayjs from "dayjs";

export interface LogConfig {
  path?: string;
  lever?: "log"|"error"|"info";
  separate?: string;
  expire_day?: number;
}

export function logInit(conf: LogConfig) {
  // const consoleError = console.error;
  if(conf && conf.path) {
    try {
      mkdirSync(conf.path);
    } catch (_err) {
    }
    let arr: ("log"|"error"|"info")[] = ["log","error","info"];
    const lever = conf.lever || "info";
    const separate = conf.separate || "YYYY-MM-DD";
    let expire_day = Number(conf.expire_day);
    expire_day = expire_day || 7;
    const expire_time = expire_day * 86400000;
    if(lever === "log") {
      arr = ["log","error"];
    } else if(lever === "error") {
      arr = ["error"];
    }
    arr.forEach(function(key) {
      // const consoleKey = console[key];
      const keyUp = key.toUpperCase();
      console[key] = async function(str) {
        const dateMom = dayjs();
        //consoleKey.apply(console,arguments);
        if(str === "%s: %dms") return;
        const pixStr = dateMom.format("YYYY-MM-DD HH:mm:ss.SSS")+" ";
        const lgFlNm = dateMom.format(separate)+".log";
        const lgPh = conf.path+"/"+lgFlNm;
        if(!expire_day || expire_day <= 0) {
          await appendFile(lgPh,pixStr+" "+keyUp.padEnd(5," ")+" "+str+"\n");
          return;
        }
        let exists = true;
        try {
          await access(lgPh);
        } catch (_err) {
          exists = false;
        }
        if(!exists) {
          const files = await readdir(conf.path);
          const date = new Date();
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const dateTmp = dayjs(file,separate+".log");
            if(dateTmp.isValid()) continue;
            let stats = undefined;
            try {
              stats = await stat(conf.path+"/"+file);
            } catch (_err) { }
            if(!stats || !stats.isFile()) continue;
            if(date.getTime() - dateTmp.toDate().getTime() >= expire_time) {
              await unlink(conf.path+"/"+file);
            }
          }
        }
        await appendFile(lgPh,pixStr+" "+keyUp.padEnd(5," ")+" "+str+"\n");
      };
    });
  }
}
