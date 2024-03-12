// deno-lint-ignore-file
import {
  configAsync,
  type DotenvConfig,
} from "dotenv";

declare global {
  interface Window {
    process: {
      env: {
        NODE_ENV: string;
      };
    };
  }
}

let envKey = "dev";
let cwd = Deno.cwd();

function initEnv() {
  for (let i = 0; i < Deno.args.length; i++) {
    const item = Deno.args[i].trim();
    if (item.startsWith("-e=") || item.startsWith("--env=")) {
      const envKeyTmp = item.replace(/^-e=/, "").replace(/^--env=/, "");
      if (envKeyTmp) {
        envKey = envKeyTmp;
      }
    } else if (item === "-e" || item === "--env") {
      envKey = Deno.args[i+1]?.trim();
    } else if (item.startsWith("-c=") || item.startsWith("--cwd=")) {
      const cwdTmp = item.replace(/^-c=/, "").replace(/^--cwd=/, "");
      if (cwdTmp) {
        cwd = cwdTmp;
        Deno.chdir(cwd);
      }
    } else if (item === "-c" || item === "--cwd") {
      cwd = Deno.args[i+1]?.trim();
      Deno.chdir(cwd);
    }
  }
  if (envKey === "dev") {
    envKey = "development";
  } else if (envKey === "prod") {
    envKey = "production";
  }
  
  (globalThis as any).process = (globalThis as any).process || { };
  (globalThis as any).process.env = (globalThis as any).process.env || { };
  if (envKey === "development") {
    (globalThis as any).process.env.NODE_ENV = "development";
  } else {
    (globalThis as any).process.env.NODE_ENV = "production";
  }
}
initEnv();

let parsedEnv: DotenvConfig;

async function parseEnv() {
  if (envKey === "development") {
    parsedEnv = await configAsync({
      export: false,
      path: `${ cwd }/.env.dev`,
    });
  } else if (envKey === "production") {
    parsedEnv = await configAsync({
      export: false,
      path: `${ cwd }/.env.prod`,
    });
  } else if (!envKey) {
    parsedEnv = await configAsync({
      export: false,
      path: `${ cwd }/.env`,
    });
  } else {
    parsedEnv = await configAsync({
      export: false,
      path: `${ cwd }/.env.${ envKey }`,
    });
  }
}

/**
 * 获取环境变量
 * @export
 * @param {string} key
 * @return {Promise<string>} 
 */
export async function getEnv(key: string): Promise<string> {
  const val = Deno.env.get(key);
  if (val) {
    return val;
  }
  if (!parsedEnv) {
    await parseEnv();
  }
  return parsedEnv[key];
}

export function getParsedEnv(key: string): string {
  return parsedEnv[key];
}

/**
 * 设置环境变量
 * @param {string} key
 * @param {string} val
 */
export function setEnv(key: string, val: string) {
  Deno.env.set(key, val)
}

export async function getEnvs() {
  const obj = Deno.env.toObject();
  if (!parsedEnv) {
    await parseEnv();
  }
  const envs: {[key: string]: string} = { };
  const keys = Object.keys(parsedEnv);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const val = obj[key] ?? parsedEnv[key];
    if (val != null) {
      envs[key] = val;
    }
  }
  return envs;
}
