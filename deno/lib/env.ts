import { config } from "dotenv";

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

export function initEnv() {
  for (let i = 0; i < Deno.args.length; i++) {
    const item = Deno.args[i];
    if (item.startsWith("-e=") || item.startsWith("--env=")) {
      const envKeyTmp = item.replace(/^-e=/, "").replace(/^--env=/, "");
      if (envKeyTmp) {
        envKey = envKeyTmp;
      }
    }
  }
  if (envKey === "dev") {
    envKey = "development";
  } else if (envKey === "prod") {
    envKey = "production";
  }
  
  window.process = window.process || { };
  window.process.env = window.process.env || { };
  if (envKey === "development") {
    window.process.env.NODE_ENV = "development";
  } else {
    window.process.env.NODE_ENV = "production";
  }
  
  const cwd = Deno.cwd();
  
  if (envKey === "development") {
    config({
      export: true,
      path: `${ cwd }/.env.dev`,
    });
  } else if (envKey === "production") {
    config({
      export: true,
      path: `${ cwd }/.env.prod`,
    });
  } else if (!envKey) {
    config({
      export: true,
      path: `${ cwd }/.env.${ envKey }`,
    });
  }
  config({
    export: true,
    path: `${ cwd }/.env`,
  });  
}
initEnv();
