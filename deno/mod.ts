import "/lib/env.ts";
import "/lib/util/date_util.ts";
import { getEnv } from "/lib/env.ts";
import { initApp } from "/lib/oak/mod.ts";
import { logInit } from "/lib/util/log.ts";

import "/lib/graphql.ts";

// deno-lint-ignore no-explicit-any
if ((globalThis as any).process.env.NODE_ENV === "production") {
  logInit({
    path: await getEnv("log_path"),
  });
}

const app = initApp();

const server_port = await getEnv("server_port");
const port = Number(server_port);
if (isNaN(port) || port < 1024) {
  throw `端口号 server_port: (${ server_port }) 错误，请检查环境变量！`;
}
console.log(`app started: ${ port }`);

await app.listen({
  port,
  hostname: await getEnv("server_host"),
});
