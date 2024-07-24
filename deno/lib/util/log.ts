// deno-lint-ignore-file no-empty
import dayjs from "dayjs";

import {
  basename,
  extname,
} from "jsr:@std/path";

export interface LogConfig {
  path: string;
  lever?: "log"|"error"|"info";
  separate?: string;
  expire_day?: number;
}

export function logInit(conf: LogConfig) {
  // const consoleError = console.error;
  if(conf && conf.path) {
    try {
      Deno.mkdirSync(conf.path, { recursive: true });
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
          await Deno.writeTextFile(lgPh, pixStr+" "+keyUp.padEnd(5," ")+" "+str+"\n", { append: true })
          return;
        }
        let exists = true;
        try {
          await Deno.stat(lgPh);
        } catch (_err) {
          exists = false;
        }
        if(!exists) {
          const date = new Date();
          for await (const fileEntry of Deno.readDir(conf.path)) {
            if (!fileEntry.isFile) {
              continue;
            }
            const file = basename(fileEntry.name, extname(fileEntry.name));
            const dateTmp = dayjs(file, separate, false);
            if(!dateTmp.isValid()) {
              continue;
            }
            if(date.getTime() - dateTmp.toDate().getTime() >= expire_time) {
              await Deno.remove(conf.path + "/" + file);
            }
          }
        }
        await Deno.writeTextFile(lgPh, pixStr+" "+keyUp.padEnd(5," ")+" "+str+"\n", { append: true });
      };
    });
  }
}
