import "/lib/date_util.ts";
import "/lib/env.ts";
import { initApp } from "/lib/oak/mod.ts";
import { logInit } from "/lib/log.ts";

import "/gen/graphql.ts";
import "/src/graphql.ts";
import "/lib/oss/oss.graphql.ts";
import "/lib/app/app.graphql.ts";

if (window.process.env.NODE_ENV === "production") {
  logInit({
    path: Deno.env.get("log_path"),
  });
}

const app = initApp();

const server_port = Deno.env.get("server_port");
const port = Number(server_port);
if (isNaN(port) || port < 1024) {
  throw `端口号 server_port: (${ server_port }) 错误，请检查环境变量！`;
}
console.log(`app started: ${ port }`);

await app.listen({ port });
