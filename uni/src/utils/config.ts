import pages from "@/pages.json";

let host = "";
let port: string | undefined = undefined;
let protocol = "http:";
let domain = "";
let wsProt = "ws:";
let appid = "wxd4b24c53a1813485";
let agentid = "";

const homePage = `/${pages.pages[0]?.path}`;

if(import.meta.env.MODE === "development") {
  // #ifndef H5
  host = "localhost";
  port = "4000";
  domain = `${ host }${ port ? `:${ port }` : "" }`;
  protocol = "http:";
  wsProt = "ws:";
  // #endif
  // #ifdef H5
  host = location.hostname;
  port = location.port;
  domain = location.host;
  protocol = location.protocol;
  if(protocol === "https:") {
    wsProt = "wss:";
  } else {
    wsProt = "ws:";
  }
  // #endif
}
if (import.meta.env.MODE === "production") {
  // #ifndef H5
  host = "localhost";
  port = undefined;
  domain = `${ host }${ port ? `:${ port }` : "" }`;
  protocol = "https:";
  wsProt = "wss:";
  // #endif
  // #ifdef H5
  host = location.hostname;
  port = location.port;
  domain = location.host;
  protocol = location.protocol;
  if(protocol === "https:") {
    wsProt = "wss:";
  } else {
    wsProt = "ws:";
  }
  // #endif
}

let urlBase = `${protocol}//${host}`;
if(port) {
  urlBase += `:${port}`;
}
const url = `${urlBase}/api`;
let wss = `${wsProt}//${host}`;
if(port) {
  wss += `:${port}`;
}

const config = {
  urlBase,
  url,
  wss,
  host,
  port,
  protocol,
  wsProt,
  homePage,
  domain,
  appid,
  agentid,
  pinia: undefined,
};

export default config;
